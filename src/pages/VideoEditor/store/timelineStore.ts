import { create } from 'zustand';
import type {
  ClipKind,
  DropIndicator,
  MediaItem,
  TimelineClip,
  TimelineTrack,
  TrackType,
} from '../types';
import { INITIAL_CLIPS, INITIAL_TRACKS } from '../data';
import {
  VE_CONSTANTS,
  createId,
  clipEnd,
  clipsOverlap,
  collectSnapTargets,
  resolveNonOverlappingStart,
  snapFrame,
} from '../utils';
import { useHistoryStore } from './historyStore';
import { useSelectionStore } from './selectionStore';
import { usePlaybackStore } from './playbackStore';

function mediaKind(item: MediaItem): ClipKind {
  if (item.type === 'audio') return 'audio';
  if (item.type === 'image') return 'video';
  return 'video';
}

function preferredTrackType(kind: ClipKind): TrackType {
  if (kind === 'audio') return 'audio';
  if (kind === 'text') return 'text';
  return 'video';
}

type TimelineState = {
  tracks: TimelineTrack[];
  clips: TimelineClip[];
  snapEnabled: boolean;
  magneticEnabled: boolean;
  timelineZoom: number;
  dropIndicator: DropIndicator;

  setSnapEnabled: (v: boolean) => void;
  setMagneticEnabled: (v: boolean) => void;
  setTimelineZoom: (z: number) => void;
  setDropIndicator: (indicator: DropIndicator) => void;

  toggleTrackLock: (trackId: string) => void;
  toggleTrackHidden: (trackId: string) => void;
  toggleTrackMuted: (trackId: string) => void;
  renameTrack: (trackId: string, name: string) => void;
  setTrackHeight: (trackId: string, height: number) => void;
  setTrackColor: (trackId: string, color: string) => void;

  addMediaToTimeline: (
    media: MediaItem,
    trackId: string,
    startFrame: number,
  ) => string | null;
  moveClip: (clipId: string, trackId: string, startFrame: number, commit?: boolean) => void;
  /** Absolute trim from drag origin — avoids cumulative snap/sourceOffset drift. */
  applyTrimFromOrigin: (
    clipId: string,
    edge: 'left' | 'right',
    origin: { startFrame: number; durationFrames: number; sourceOffset: number },
    targetEdgeFrame: number,
    commit?: boolean,
  ) => void;
  trimClip: (
    clipId: string,
    edge: 'left' | 'right',
    frameDelta: number,
    commit?: boolean,
  ) => void;
  splitClipAtPlayhead: (clipId?: string | null) => void;
  deleteClip: (clipId?: string | null) => void;
  duplicateClip: (clipId?: string | null) => void;
  copySelected: () => void;
  cutSelected: () => void;
  pasteClipboard: (atFrame?: number) => void;
  toggleClipLock: (clipId: string) => void;
  toggleClipDisabled: (clipId: string) => void;
  commitHistory: (label: string) => void;
  restoreSnapshot: (clips: TimelineClip[], tracks: TimelineTrack[]) => void;
};

export const useTimelineStore = create<TimelineState>((set, get) => ({
  tracks: structuredClone(INITIAL_TRACKS),
  clips: structuredClone(INITIAL_CLIPS),
  snapEnabled: true,
  magneticEnabled: true,
  timelineZoom: 1,
  dropIndicator: null,

  setSnapEnabled: (v) => set({ snapEnabled: v }),
  setMagneticEnabled: (v) => set({ magneticEnabled: v }),
  setTimelineZoom: (z) => set({ timelineZoom: Math.min(4, Math.max(0.4, z)) }),
  setDropIndicator: (indicator) =>
    set((s) => {
      const prev = s.dropIndicator;
      if (
        prev === indicator ||
        (prev &&
          indicator &&
          prev.trackId === indicator.trackId &&
          prev.frame === indicator.frame &&
          prev.durationFrames === indicator.durationFrames &&
          prev.valid === indicator.valid)
      ) {
        return s;
      }
      return { dropIndicator: indicator };
    }),

  commitHistory: (label) => useHistoryStore.getState().pushLabel(label),

  restoreSnapshot: (clips, tracks) => set({ clips, tracks }),

  toggleTrackLock: (trackId) =>
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, locked: !t.locked } : t,
      ),
    })),

  toggleTrackHidden: (trackId) =>
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, hidden: !t.hidden } : t,
      ),
    })),

  toggleTrackMuted: (trackId) =>
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, muted: !t.muted } : t,
      ),
    })),

  renameTrack: (trackId, name) => {
    set((s) => ({
      tracks: s.tracks.map((t) => (t.id === trackId ? { ...t, name } : t)),
    }));
    get().commitHistory(`Rename track · ${name}`);
  },

  setTrackHeight: (trackId, height) =>
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId
          ? { ...t, height: Math.min(96, Math.max(28, Math.round(height))) }
          : t,
      ),
    })),

  setTrackColor: (trackId, color) =>
    set((s) => ({
      tracks: s.tracks.map((t) => (t.id === trackId ? { ...t, color } : t)),
    })),

  addMediaToTimeline: (media, trackId, startFrame) => {
    const { tracks, clips, snapEnabled, magneticEnabled } = get();
    const track = tracks.find((t) => t.id === trackId);
    if (!track || track.locked) return null;

    const kind = mediaKind(media);
    const preferred = preferredTrackType(kind);
    if (
      preferred === 'audio' &&
      track.type !== 'audio' &&
      track.type !== 'voice'
    ) {
      return null;
    }
    if (preferred === 'video' && track.type !== 'video' && track.type !== 'overlay') {
      // allow video media onto video tracks only
      if (track.type === 'text' || track.type === 'effects') return null;
    }

    const durationFrames = Math.max(
      VE_CONSTANTS.MIN_CLIP_FRAMES,
      Math.round(media.durationSec * VE_CONSTANTS.FPS),
    );
    const totalFrames = usePlaybackStore.getState().totalFrames;
    const targets = collectSnapTargets(clips, null, totalFrames);
    let start = snapFrame(startFrame, targets, snapEnabled).frame;
    if (magneticEnabled) {
      start = resolveNonOverlappingStart(
        clips.filter((c) => c.trackId === trackId),
        null,
        start,
        durationFrames,
      );
    } else {
      const conflict = clips.some(
        (c) =>
          c.trackId === trackId &&
          start < clipEnd(c) &&
          c.startFrame < start + durationFrames,
      );
      if (conflict) return null;
    }

    const clip: TimelineClip = {
      id: createId('clip'),
      trackId,
      name: media.name.replace(/\.[^.]+$/, ''),
      kind,
      startFrame: start,
      durationFrames,
      sourceOffset: 0,
      sourceDurationFrames: durationFrames,
      mediaId: media.id,
      thumbnail: media.thumbnail || undefined,
      color: track.color,
    };

    set({ clips: [...clips, clip], dropIndicator: null });
    useSelectionStore.getState().selectClip(clip.id);
    usePlaybackStore.getState().ensureCapacity(clipEnd(clip));
    get().commitHistory(`Add ${clip.name}`);
    return clip.id;
  },

  moveClip: (clipId, trackId, startFrame, commit = true) => {
    const { clips, tracks, snapEnabled, magneticEnabled } = get();
    const clip = clips.find((c) => c.id === clipId);
    if (!clip || clip.locked) return;
    const track = tracks.find((t) => t.id === trackId);
    if (!track || track.locked) return;

    const totalFrames = usePlaybackStore.getState().totalFrames;
    const targets = collectSnapTargets(clips, clipId, totalFrames);
    let start = snapFrame(startFrame, targets, snapEnabled).frame;
    if (magneticEnabled) {
      start = resolveNonOverlappingStart(
        clips.filter((c) => c.trackId === trackId),
        clipId,
        start,
        clip.durationFrames,
      );
    } else {
      const conflict = clips.some(
        (c) =>
          c.id !== clipId &&
          c.trackId === trackId &&
          start < clipEnd(c) &&
          c.startFrame < start + clip.durationFrames,
      );
      if (conflict) return;
    }

    start = Math.max(0, start);
    if (clip.trackId === trackId && clip.startFrame === start) {
      if (commit) return; // no-op click — skip history
      return;
    }

    set({
      clips: clips.map((c) =>
        c.id === clipId ? { ...c, trackId, startFrame: start } : c,
      ),
    });
    usePlaybackStore.getState().ensureCapacity(start + clip.durationFrames);
    if (commit) get().commitHistory(`Move ${clip.name}`);
  },

  applyTrimFromOrigin: (clipId, edge, origin, targetEdgeFrame, commit = true) => {
    const { clips, snapEnabled } = get();
    const clip = clips.find((c) => c.id === clipId);
    if (!clip || clip.locked) return;
    const trackClips = clips.filter((c) => c.trackId === clip.trackId && c.id !== clipId);
    const totalFrames = usePlaybackStore.getState().totalFrames;
    const targets = collectSnapTargets(clips, clipId, totalFrames);

    let next: TimelineClip = { ...clip };

    if (edge === 'left') {
      let newStart = snapFrame(targetEdgeFrame, targets, snapEnabled).frame;
      const maxStart = origin.startFrame + origin.durationFrames - VE_CONSTANTS.MIN_CLIP_FRAMES;
      newStart = Math.min(Math.max(0, newStart), maxStart);
      const delta = newStart - origin.startFrame;
      const newDuration = origin.durationFrames - delta;
      const newSourceOffset = Math.max(0, origin.sourceOffset + delta);
      if (newDuration < VE_CONSTANTS.MIN_CLIP_FRAMES) return;
      if (newSourceOffset + newDuration > clip.sourceDurationFrames) return;
      const candidate = { startFrame: newStart, durationFrames: newDuration };
      if (trackClips.some((o) => clipsOverlap(candidate, o))) return;
      next = {
        ...clip,
        startFrame: newStart,
        durationFrames: newDuration,
        sourceOffset: newSourceOffset,
      };
    } else {
      let newEnd = snapFrame(targetEdgeFrame, targets, snapEnabled).frame;
      const minEnd = origin.startFrame + VE_CONSTANTS.MIN_CLIP_FRAMES;
      const maxEnd = origin.startFrame + (clip.sourceDurationFrames - origin.sourceOffset);
      newEnd = Math.min(Math.max(minEnd, newEnd), maxEnd);
      const newDuration = newEnd - origin.startFrame;
      const candidate = { startFrame: origin.startFrame, durationFrames: newDuration };
      if (trackClips.some((o) => clipsOverlap(candidate, o))) return;
      next = {
        ...clip,
        startFrame: origin.startFrame,
        durationFrames: newDuration,
        sourceOffset: origin.sourceOffset,
      };
    }

    if (
      next.startFrame === clip.startFrame &&
      next.durationFrames === clip.durationFrames &&
      next.sourceOffset === clip.sourceOffset
    ) {
      return;
    }

    set({ clips: clips.map((c) => (c.id === clipId ? next : c)) });
    if (commit) get().commitHistory(`Trim ${clip.name}`);
  },

  trimClip: (clipId, edge, frameDelta, commit = true) => {
    const clip = get().clips.find((c) => c.id === clipId);
    if (!clip) return;
    const origin = {
      startFrame: clip.startFrame,
      durationFrames: clip.durationFrames,
      sourceOffset: clip.sourceOffset,
    };
    const target =
      edge === 'left'
        ? clip.startFrame + frameDelta
        : clipEnd(clip) + frameDelta;
    get().applyTrimFromOrigin(clipId, edge, origin, target, commit);
  },

  splitClipAtPlayhead: (clipId) => {
    const id = clipId ?? useSelectionStore.getState().selectedClipId;
    if (!id) return;
    const { clips } = get();
    const clip = clips.find((c) => c.id === id);
    if (!clip || clip.locked) return;
    const currentFrame = usePlaybackStore.getState().currentFrame;
    const end = clipEnd(clip);
    if (currentFrame <= clip.startFrame + 1 || currentFrame >= end - 1) return;

    const leftDur = currentFrame - clip.startFrame;
    const rightDur = end - currentFrame;
    const right: TimelineClip = {
      ...clip,
      id: createId('clip'),
      startFrame: currentFrame,
      durationFrames: rightDur,
      sourceOffset: clip.sourceOffset + leftDur,
      name: `${clip.name}`,
      hasTransitionAfter: false,
    };

    set({
      clips: [
        ...clips.map((c) =>
          c.id === clip.id
            ? {
                ...c,
                durationFrames: leftDur,
                hasTransitionAfter: false,
              }
            : c,
        ),
        right,
      ],
    });
    useSelectionStore.getState().selectClip(right.id);
    get().commitHistory(`Split ${clip.name}`);
  },

  deleteClip: (clipId) => {
    const id = clipId ?? useSelectionStore.getState().selectedClipId;
    if (!id) return;
    const { clips } = get();
    const clip = clips.find((c) => c.id === id);
    if (!clip || clip.locked) return;
    set({ clips: clips.filter((c) => c.id !== id) });
    useSelectionStore.getState().selectClip(null);
    get().commitHistory(`Delete ${clip.name}`);
  },

  duplicateClip: (clipId) => {
    const id = clipId ?? useSelectionStore.getState().selectedClipId;
    if (!id) return;
    const { clips, magneticEnabled } = get();
    const clip = clips.find((c) => c.id === id);
    if (!clip) return;
    let start = clipEnd(clip);
    if (magneticEnabled) {
      start = resolveNonOverlappingStart(
        clips.filter((c) => c.trackId === clip.trackId),
        null,
        start,
        clip.durationFrames,
      );
    }
    const dup: TimelineClip = {
      ...clip,
      id: createId('clip'),
      startFrame: start,
      name: `${clip.name} Copy`,
    };
    set({ clips: [...clips, dup] });
    useSelectionStore.getState().selectClip(dup.id);
    usePlaybackStore.getState().ensureCapacity(clipEnd(dup));
    get().commitHistory(`Duplicate ${clip.name}`);
  },

  copySelected: () => {
    const id = useSelectionStore.getState().selectedClipId;
    if (!id) return;
    const clip = get().clips.find((c) => c.id === id);
    if (!clip) return;
    useSelectionStore.getState().setClipboard({
      clips: [structuredClone(clip)],
    });
  },

  cutSelected: () => {
    get().copySelected();
    get().deleteClip();
  },

  pasteClipboard: (atFrame) => {
    const clipboard = useSelectionStore.getState().clipboard;
    if (!clipboard?.clips.length) return;
    const frame =
      atFrame ?? usePlaybackStore.getState().currentFrame;
    const { clips, magneticEnabled } = get();
    const source = clipboard.clips[0];
    if (!source) return;
    let start = frame;
    if (magneticEnabled) {
      start = resolveNonOverlappingStart(
        clips.filter((c) => c.trackId === source.trackId),
        null,
        start,
        source.durationFrames,
      );
    }
    const pasted: TimelineClip = {
      ...source,
      id: createId('clip'),
      startFrame: start,
      name: `${source.name}`,
    };
    set({ clips: [...clips, pasted] });
    useSelectionStore.getState().selectClip(pasted.id);
    usePlaybackStore.getState().ensureCapacity(clipEnd(pasted));
    get().commitHistory(`Paste ${pasted.name}`);
  },

  toggleClipLock: (clipId) =>
    set((s) => ({
      clips: s.clips.map((c) =>
        c.id === clipId ? { ...c, locked: !c.locked } : c,
      ),
    })),

  toggleClipDisabled: (clipId) =>
    set((s) => ({
      clips: s.clips.map((c) =>
        c.id === clipId ? { ...c, disabled: !c.disabled } : c,
      ),
    })),
}));
