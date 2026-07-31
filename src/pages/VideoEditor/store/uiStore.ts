import { create } from 'zustand';
import type {
  AiToolId,
  AiToolStatus,
  AspectRatio,
  AudioProps,
  EditorModule,
  ExportSettings,
  PropertiesTab,
  SpeedProps,
  TextProps,
  TransformProps,
  VideoFeatures,
  VideoSubTab,
} from '../types';
import {
  DEFAULT_AUDIO,
  DEFAULT_EXPORT,
  DEFAULT_SPEED,
  DEFAULT_TEXT,
  DEFAULT_TRANSFORM,
  DEFAULT_VIDEO_FEATURES,
  AI_TOOLS,
} from '../data';
import { useHistoryStore } from './historyStore';

type UiState = {
  projectName: string;
  sequenceName: string;
  autoSaveLabel: string;
  activeModule: EditorModule;
  sidebarCollapsed: boolean;
  mediaPanelOpen: boolean;
  propertiesOpen: boolean;
  timelineExpanded: boolean;
  mobileModulesOpen: boolean;
  aspectRatio: AspectRatio;
  showSafeArea: boolean;
  previewFit: 'fit' | 'fill' | '100%';
  isFullscreen: boolean;
  isPreviewLoading: boolean;
  propertiesTab: PropertiesTab;
  videoSubTab: VideoSubTab;
  transform: TransformProps;
  audioProps: AudioProps;
  speedProps: SpeedProps;
  textProps: TextProps;
  videoFeatures: VideoFeatures;
  historyOpen: boolean;
  shortcutsOpen: boolean;
  exportOpen: boolean;
  exportSettings: ExportSettings;
  isExporting: boolean;
  exportProgress: number;
  aiStatuses: Partial<Record<AiToolId, AiToolStatus>>;
  aiProgress: Partial<Record<AiToolId, number>>;
  renderStatus: 'idle' | 'rendering' | 'ready';
  gpuLabel: string;

  setProjectName: (name: string) => void;
  setAutoSaveLabel: (label: string) => void;
  setActiveModule: (module: EditorModule) => void;
  toggleSidebarCollapsed: () => void;
  setMediaPanelOpen: (open: boolean) => void;
  setPropertiesOpen: (open: boolean) => void;
  setTimelineExpanded: (open: boolean) => void;
  setMobileModulesOpen: (open: boolean) => void;
  toggleTimelineExpanded: () => void;
  setAspectRatio: (r: AspectRatio) => void;
  setShowSafeArea: (v: boolean) => void;
  setPreviewFit: (f: 'fit' | 'fill' | '100%') => void;
  setFullscreen: (v: boolean) => void;
  setPreviewLoading: (v: boolean) => void;
  setPropertiesTab: (t: PropertiesTab) => void;
  setVideoSubTab: (t: VideoSubTab) => void;
  setTransform: (partial: Partial<TransformProps>) => void;
  setAudioProps: (partial: Partial<AudioProps>) => void;
  setSpeedProps: (partial: Partial<SpeedProps>) => void;
  setTextProps: (partial: Partial<TextProps>) => void;
  setVideoFeatures: (partial: Partial<VideoFeatures>) => void;
  resetAllProperties: () => void;
  setHistoryOpen: (v: boolean) => void;
  setShortcutsOpen: (v: boolean) => void;
  setExportOpen: (v: boolean) => void;
  setExportSettings: (partial: Partial<ExportSettings>) => void;
  startExport: () => void;
  runAiTool: (id: AiToolId) => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  projectName: 'Wedding Highlights',
  sequenceName: 'Sequence 01',
  autoSaveLabel: 'Auto Saved 2 min ago',
  activeModule: 'media',
  sidebarCollapsed: false,
  mediaPanelOpen: true,
  propertiesOpen: true,
  timelineExpanded: true,
  mobileModulesOpen: false,
  aspectRatio: '16:9',
  showSafeArea: true,
  previewFit: 'fit',
  isFullscreen: false,
  isPreviewLoading: false,
  propertiesTab: 'video',
  videoSubTab: 'basic',
  transform: { ...DEFAULT_TRANSFORM },
  audioProps: { ...DEFAULT_AUDIO },
  speedProps: { ...DEFAULT_SPEED },
  textProps: { ...DEFAULT_TEXT },
  videoFeatures: { ...DEFAULT_VIDEO_FEATURES },
  historyOpen: false,
  shortcutsOpen: false,
  exportOpen: false,
  exportSettings: { ...DEFAULT_EXPORT },
  isExporting: false,
  exportProgress: 0,
  aiStatuses: {},
  aiProgress: {},
  renderStatus: 'ready',
  gpuLabel: 'GPU · Ready',

  setProjectName: (name) => set({ projectName: name }),
  setAutoSaveLabel: (label) => set({ autoSaveLabel: label }),
  setActiveModule: (module) => {
    set({
      activeModule: module,
      mediaPanelOpen: true,
      mobileModulesOpen: false,
    });
    if (module === 'export') set({ exportOpen: true });
  },
  toggleSidebarCollapsed: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMediaPanelOpen: (open) => set({ mediaPanelOpen: open }),
  setPropertiesOpen: (open) => set({ propertiesOpen: open }),
  setTimelineExpanded: (open) => set({ timelineExpanded: open }),
  setMobileModulesOpen: (open) => set({ mobileModulesOpen: open }),
  toggleTimelineExpanded: () =>
    set((s) => ({ timelineExpanded: !s.timelineExpanded })),
  setAspectRatio: (r) => set({ aspectRatio: r }),
  setShowSafeArea: (v) => set({ showSafeArea: v }),
  setPreviewFit: (f) => set({ previewFit: f }),
  setFullscreen: (v) => set({ isFullscreen: v }),
  setPreviewLoading: (v) => set({ isPreviewLoading: v }),
  setPropertiesTab: (t) => set({ propertiesTab: t }),
  setVideoSubTab: (t) => set({ videoSubTab: t }),
  setTransform: (partial) =>
    set((s) => ({ transform: { ...s.transform, ...partial } })),
  setAudioProps: (partial) =>
    set((s) => ({ audioProps: { ...s.audioProps, ...partial } })),
  setSpeedProps: (partial) =>
    set((s) => ({ speedProps: { ...s.speedProps, ...partial } })),
  setTextProps: (partial) =>
    set((s) => ({ textProps: { ...s.textProps, ...partial } })),
  setVideoFeatures: (partial) =>
    set((s) => ({ videoFeatures: { ...s.videoFeatures, ...partial } })),
  resetAllProperties: () => {
    set({
      transform: { ...DEFAULT_TRANSFORM },
      audioProps: { ...DEFAULT_AUDIO },
      speedProps: { ...DEFAULT_SPEED },
      videoFeatures: { ...DEFAULT_VIDEO_FEATURES },
    });
    useHistoryStore.getState().pushLabel('Reset all properties');
  },
  setHistoryOpen: (v) => set({ historyOpen: v }),
  setShortcutsOpen: (v) => set({ shortcutsOpen: v }),
  setExportOpen: (v) => set({ exportOpen: v }),
  setExportSettings: (partial) =>
    set((s) => ({ exportSettings: { ...s.exportSettings, ...partial } })),

  startExport: () => {
    set({ isExporting: true, exportProgress: 0, renderStatus: 'rendering' });
    const tick = () => {
      const { exportProgress, isExporting } = get();
      if (!isExporting) return;
      if (exportProgress >= 100) {
        set({
          isExporting: false,
          exportProgress: 100,
          renderStatus: 'ready',
          exportOpen: false,
        });
        useHistoryStore.getState().pushLabel('Export completed');
        return;
      }
      set({ exportProgress: Math.min(100, exportProgress + 8) });
      window.setTimeout(tick, 180);
    };
    window.setTimeout(tick, 180);
  },

  runAiTool: (id) => {
    const tool = AI_TOOLS.find((t) => t.id === id);
    if (!tool) return;
    set((s) => ({
      aiStatuses: { ...s.aiStatuses, [id]: 'processing' },
      aiProgress: { ...s.aiProgress, [id]: 0 },
      isPreviewLoading: true,
    }));
    const steps = 12;
    const stepMs = tool.durationMs / steps;
    let step = 0;
    const advance = () => {
      step += 1;
      const progress = Math.round((step / steps) * 100);
      set((s) => ({ aiProgress: { ...s.aiProgress, [id]: progress } }));
      if (step >= steps) {
        set((s) => ({
          aiStatuses: { ...s.aiStatuses, [id]: 'done' },
          aiProgress: { ...s.aiProgress, [id]: 100 },
          isPreviewLoading: false,
        }));
        useHistoryStore.getState().pushLabel(`AI · ${tool.title}`);
        window.setTimeout(() => {
          set((s) => ({
            aiStatuses: { ...s.aiStatuses, [id]: 'idle' },
            aiProgress: { ...s.aiProgress, [id]: 0 },
          }));
        }, 2000);
        return;
      }
      window.setTimeout(advance, stepMs);
    };
    window.setTimeout(advance, stepMs);
  },
}));
