import { useCallback, useMemo, useState, type DragEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Folder,
  Grid2X2,
  List,
  Filter,
  Plus,
  Search,
  Mic,
  Music2,
  Film,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { secondsToDisplay, sortMediaItems, VE_CONSTANTS } from '../utils';
import {
  useMediaStore,
  useTimelineStore,
  useUiStore,
} from '../store';
import { useMatchMedia } from '../hooks';
import { TabBar, LoadingPulse } from './ui';
import type { MediaSortKey, MediaSourceTab } from '../types';
import { AiStudioPanel } from './panels/AiStudioPanel';
import { ModulePlaceholderPanel } from './panels/ModulePlaceholderPanel';
import { MobileBottomSheet } from './MobileBottomSheet';

const MEDIA_TABS: { id: MediaSourceTab; label: string }[] = [
  { id: 'project', label: 'Project' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'brand', label: 'Brand' },
];

const SORT_OPTIONS: { id: MediaSortKey; label: string }[] = [
  { id: 'recent', label: 'Recent' },
  { id: 'name', label: 'Name' },
  { id: 'duration', label: 'Duration' },
  { id: 'type', label: 'Type' },
];

export function MediaPanel() {
  const activeModule = useUiStore((s) => s.activeModule);
  const mediaPanelOpen = useUiStore((s) => s.mediaPanelOpen);
  const setMediaPanelOpen = useUiStore((s) => s.setMediaPanelOpen);
  const isPhone = useMatchMedia('(max-width: 767px)');
  const mediaTab = useMediaStore((s) => s.mediaTab);
  const setMediaTab = useMediaStore((s) => s.setMediaTab);
  const mediaView = useMediaStore((s) => s.mediaView);
  const setMediaView = useMediaStore((s) => s.setMediaView);
  const mediaSearch = useMediaStore((s) => s.mediaSearch);
  const setMediaSearch = useMediaStore((s) => s.setMediaSearch);
  const mediaSort = useMediaStore((s) => s.mediaSort);
  const setMediaSort = useMediaStore((s) => s.setMediaSort);
  const folders = useMediaStore((s) => s.folders);
  const mediaItems = useMediaStore((s) => s.mediaItems);
  const selectedFolderId = useMediaStore((s) => s.selectedFolderId);
  const setSelectedFolderId = useMediaStore((s) => s.setSelectedFolderId);
  const selectedMediaId = useMediaStore((s) => s.selectedMediaId);
  const setSelectedMediaId = useMediaStore((s) => s.setSelectedMediaId);
  const setDraggingMediaId = useMediaStore((s) => s.setDraggingMediaId);
  const importMediaFiles = useMediaStore((s) => s.importMediaFiles);
  const isImporting = useMediaStore((s) => s.isImporting);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = mediaSearch.trim().toLowerCase();
    const items = mediaItems.filter((item) => {
      if (selectedFolderId && item.folderId !== selectedFolderId) return false;
      if (q && !item.name.toLowerCase().includes(q)) return false;
      return true;
    });
    return sortMediaItems(items, mediaSort);
  }, [mediaItems, mediaSearch, selectedFolderId, mediaSort]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      void importMediaFiles(accepted);
    },
    [importMediaFiles],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/webm': ['.webm'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'audio/*': [],
    },
  });

  const startMediaDrag = (e: DragEvent, mediaId: string) => {
    const payload = JSON.stringify({ mediaId });
    e.dataTransfer.setData(VE_CONSTANTS.MEDIA_DRAG_MIME, payload);
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.effectAllowed = 'copy';
    setDraggingMediaId(mediaId);
  };

  const endMediaDrag = () => {
    setDraggingMediaId(null);
    useTimelineStore.getState().setDropIndicator(null);
  };

  const panelBody =
    activeModule === 'ai-studio' ? (
      <AiStudioPanel />
    ) : activeModule === 'media' ? (
      <div className="flex h-full min-h-0 flex-col" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-3 border-b border-[var(--ve-border)] p-3">
          <TabBar tabs={MEDIA_TABS} value={mediaTab} onChange={setMediaTab} />
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={open}
              disabled={isImporting}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-[var(--ve-primary)] py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_var(--ve-primary-glow)] disabled:opacity-60"
            >
              {isImporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Import
            </motion.button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] py-2 text-[12px] font-semibold text-[var(--ve-ink-soft)] transition-colors hover:border-[var(--ve-primary)]/40 hover:text-[var(--ve-ink)]"
            >
              <Mic className="h-3.5 w-3.5" />
              Record
            </button>
          </div>
          <div className="flex items-center gap-1.5 rounded-[12px] border border-[var(--ve-border)] bg-[var(--ve-card)] px-2.5 py-2">
            <Search className="h-3.5 w-3.5 text-[var(--ve-ink-muted)]" />
            <input
              value={mediaSearch}
              onChange={(e) => setMediaSearch(e.target.value)}
              placeholder="Search media..."
              className="min-w-0 flex-1 bg-transparent text-[12px] text-[var(--ve-ink)] outline-none placeholder:text-[var(--ve-ink-muted)]"
            />
            <Filter className="h-3.5 w-3.5 text-[var(--ve-ink-muted)]" />
          </div>
          <select
            value={mediaSort}
            onChange={(e) => setMediaSort(e.target.value as MediaSortKey)}
            className="h-8 w-full rounded-[10px] border border-[var(--ve-border)] bg-[var(--ve-card)] px-2 text-[11px] font-semibold text-[var(--ve-ink-soft)] outline-none"
            aria-label="Sort media"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                Sort · {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ve-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
          {isImporting ? (
            <div className="mb-3 rounded-[var(--ve-radius-md)] border border-[var(--ve-border)] bg-[var(--ve-card)] py-6">
              <LoadingPulse label="Generating thumbnails…" />
            </div>
          ) : null}

          {isDragActive ? (
            <div className="mb-3 rounded-[var(--ve-radius-md)] border-2 border-dashed border-[var(--ve-primary)] bg-[var(--ve-primary-soft)] px-3 py-6 text-center text-[12px] font-semibold text-[var(--ve-primary)]">
              Drop MP4, MOV, WEBM, JPG, PNG
            </div>
          ) : null}

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ve-ink-muted)]">
            Folders
          </p>
          <div className="mb-4 space-y-0.5">
            {folders.map((folder) => {
              const active = selectedFolderId === folder.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedFolderId(active ? null : folder.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-[12px] px-2.5 py-2 text-left transition-colors',
                    active
                      ? 'bg-[var(--ve-primary-soft)] text-[var(--ve-primary)]'
                      : 'text-[var(--ve-ink-soft)] hover:bg-[var(--ve-elevated)] hover:text-[var(--ve-ink)]',
                  )}
                >
                  <Folder className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">
                    {folder.name}
                  </span>
                  <span className="text-[10px] font-medium text-[var(--ve-ink-muted)]">
                    {folder.count}
                  </span>
                  <ChevronRight className="h-3 w-3 text-[var(--ve-ink-muted)]" />
                </button>
              );
            })}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ve-ink-muted)]">
              Files · drag to timeline
            </p>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setMediaView('grid')}
                className={cn(
                  'rounded-lg p-1.5',
                  mediaView === 'grid'
                    ? 'bg-[var(--ve-elevated)] text-[var(--ve-primary)]'
                    : 'text-[var(--ve-ink-muted)]',
                )}
                aria-label="Grid view"
              >
                <Grid2X2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMediaView('list')}
                className={cn(
                  'rounded-lg p-1.5',
                  mediaView === 'list'
                    ? 'bg-[var(--ve-elevated)] text-[var(--ve-primary)]'
                    : 'text-[var(--ve-ink-muted)]',
                )}
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {mediaView === 'grid' ? (
            <div className="grid grid-cols-2 gap-2">
              {filtered.map((item) => {
                const selected = selectedMediaId === item.id;
                const hovered = hoveredId === item.id;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    draggable
                    whileHover={{ y: -2 }}
                    onDragStart={(e) => {
                      const de = e as unknown as DragEvent;
                      if (de.dataTransfer) startMediaDrag(de, item.id);
                    }}
                    onDragEnd={endMediaDrag}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedMediaId(item.id)}
                    className={cn(
                      'group relative cursor-grab overflow-hidden rounded-[12px] border text-left transition-shadow active:cursor-grabbing',
                      selected
                        ? 'border-[var(--ve-primary)] shadow-[0_0_0_1px_var(--ve-primary)]'
                        : 'border-[var(--ve-border)] hover:border-[var(--ve-border-strong)]',
                    )}
                  >
                    <div className="relative aspect-video bg-[var(--ve-card)]">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt=""
                          className={cn(
                            'h-full w-full object-cover transition-transform duration-300',
                            hovered ? 'scale-105' : 'scale-100',
                          )}
                          draggable={false}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--ve-ink-muted)]">
                          {item.type === 'audio' ? (
                            <Music2 className="h-6 w-6" />
                          ) : (
                            <Film className="h-6 w-6" />
                          )}
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-white">
                        {secondsToDisplay(item.durationSec)}
                      </span>
                    </div>
                    <p className="truncate px-1.5 py-1.5 text-[10px] font-semibold text-[var(--ve-ink-soft)]">
                      {item.name}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  draggable
                  onDragStart={(e) => startMediaDrag(e, item.id)}
                  onDragEnd={endMediaDrag}
                  onClick={() => setSelectedMediaId(item.id)}
                  className={cn(
                    'flex w-full cursor-grab items-center gap-2 rounded-[12px] px-2 py-1.5 text-left active:cursor-grabbing',
                    selectedMediaId === item.id
                      ? 'bg-[var(--ve-primary-soft)]'
                      : 'hover:bg-[var(--ve-elevated)]',
                  )}
                >
                  <div className="h-9 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--ve-card)]">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-[var(--ve-ink)]">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[var(--ve-ink-muted)]">
                      {secondsToDisplay(item.durationSec)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    ) : (
      <ModulePlaceholderPanel moduleId={activeModule} />
    );

  const sheetTitle =
    activeModule === 'ai-studio'
      ? 'AI Studio'
      : activeModule === 'media'
        ? 'Media'
        : 'Tools';

  return (
    <>
      <AnimatePresence mode="wait">
        {mediaPanelOpen && !isPhone ? (
          <motion.aside
            key={activeModule}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            className="hidden w-[var(--ve-media-w)] shrink-0 flex-col border-r border-[var(--ve-border)] bg-[var(--ve-surface)] md:flex"
          >
            {panelBody}
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <MobileBottomSheet
        open={mediaPanelOpen && isPhone}
        title={sheetTitle}
        onClose={() => setMediaPanelOpen(false)}
        visibilityClassName="md:hidden"
      >
        <div className="flex h-full min-h-0 flex-col">{panelBody}</div>
      </MobileBottomSheet>
    </>
  );
}
