import type { ReactNode } from 'react';
import {
  Copy,
  ClipboardPaste,
  Layers,
  Eye,
  Undo2,
  CheckSquare,
  Square,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { usePhotoEditorStore } from '../store';
import '../styles/batch.css';

const THUMB_LIMIT = 8;

export function BatchPanel() {
  const selectedIds = usePhotoEditorStore((s) => s.selectedIds);
  const photos = usePhotoEditorStore((s) => s.photos);
  const activePhotoId = usePhotoEditorStore((s) => s.activePhotoId);
  const clipboard = usePhotoEditorStore((s) => s.clipboard);
  const batchBusy = usePhotoEditorStore((s) => s.batchBusy);
  const batchPreviewActive = usePhotoEditorStore((s) => s.batchPreviewActive);
  const batchUndoStack = usePhotoEditorStore((s) => s.batchUndoStack);
  const copyEdits = usePhotoEditorStore((s) => s.copyEdits);
  const pasteEdits = usePhotoEditorStore((s) => s.pasteEdits);
  const runBatchApply = usePhotoEditorStore((s) => s.runBatchApply);
  const setBatchPreview = usePhotoEditorStore((s) => s.setBatchPreview);
  const undoBatchEdit = usePhotoEditorStore((s) => s.undoBatchEdit);
  const selectAll = usePhotoEditorStore((s) => s.selectAll);
  const deselectAll = usePhotoEditorStore((s) => s.deselectAll);
  const setActivePhoto = usePhotoEditorStore((s) => s.setActivePhoto);
  const toggleSelect = usePhotoEditorStore((s) => s.toggleSelect);

  const selectedPhotos = photos.filter((p) => selectedIds.includes(p.id));
  const visibleThumbs = selectedPhotos.slice(0, THUMB_LIMIT);
  const overflow = Math.max(0, selectedPhotos.length - THUMB_LIMIT);
  const canPreview = selectedIds.length > 1;
  const canUndo = batchUndoStack.length > 0 && !batchBusy;

  return (
    <div className="pe-batch">
      <div className="pe-batch__scroll pe-scrollbar">
        <div className="pe-batch__card">
          <p className="pe-batch__label">Selection</p>
          <p className="pe-batch__count">
            {selectedIds.length}{' '}
            <span>of {photos.length} photos</span>
          </p>

          {visibleThumbs.length > 0 ? (
            <div className="pe-batch__thumbs">
              {visibleThumbs.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  className="pe-batch__thumb"
                  data-active={photo.id === activePhotoId}
                  title={photo.name}
                  onClick={() => {
                    setActivePhoto(photo.id);
                    if (!selectedIds.includes(photo.id)) toggleSelect(photo.id);
                  }}
                >
                  <img src={photo.thumb || photo.src} alt="" loading="lazy" />
                </button>
              ))}
              {overflow > 0 ? (
                <div className="pe-batch__thumb-more">+{overflow}</div>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-[var(--pe-ink-muted)]">
              Select photos in the film strip to batch edit.
            </p>
          )}

          <div className="pe-batch__actions">
            <button type="button" className="pe-batch__chip" onClick={selectAll}>
              <span className="inline-flex items-center justify-center gap-1">
                <CheckSquare className="h-3 w-3" /> All
              </span>
            </button>
            <button
              type="button"
              className="pe-batch__chip"
              onClick={() => {
                if (batchPreviewActive) setBatchPreview(false);
                deselectAll();
              }}
              disabled={!selectedIds.length}
            >
              <span className="inline-flex items-center justify-center gap-1">
                <Square className="h-3 w-3" /> None
              </span>
            </button>
          </div>
        </div>

        {batchPreviewActive ? (
          <div className="pe-batch__preview-banner">
            <span className="pe-batch__preview-dot" />
            Previewing active edits on selected photos
          </div>
        ) : null}

        <ActionButton
          icon={batchBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
          title="Copy Settings"
          description="Copy active photo edits"
          disabled={batchBusy}
          onClick={() => {
            copyEdits();
            toast.success('Settings copied');
          }}
        />

        <ActionButton
          icon={<ClipboardPaste className="h-4 w-4" />}
          title="Paste Settings"
          description={
            clipboard
              ? selectedIds.length > 1
                ? `Paste to ${selectedIds.length} selected`
                : 'Paste onto active photo'
              : 'Copy settings first'
          }
          disabled={!clipboard || batchBusy}
          onClick={async () => {
            if (selectedIds.length > 1) {
              await runBatchApply('clipboard-selected');
            } else {
              pasteEdits();
              toast.success('Settings pasted');
            }
          }}
        />

        <ActionButton
          icon={<Layers className="h-4 w-4" />}
          title="Apply to Selected"
          description={`Apply active edits to ${selectedIds.length || 0} photos`}
          primary
          disabled={!selectedIds.length || batchBusy}
          onClick={() => void runBatchApply('selected')}
        />

        <ActionButton
          icon={<Layers className="h-4 w-4" />}
          title="Apply to All"
          description={`Apply active edits to all ${photos.length} photos`}
          disabled={!photos.length || batchBusy}
          onClick={() => void runBatchApply('all')}
        />

        <ActionButton
          icon={<Eye className="h-4 w-4" />}
          title={batchPreviewActive ? 'Exit Preview' : 'Preview Changes'}
          description={
            canPreview
              ? batchPreviewActive
                ? 'Restore previous edits'
                : 'Live-preview on selected'
              : 'Select 2+ photos to preview'
          }
          active={batchPreviewActive}
          disabled={!canPreview || batchBusy}
          onClick={() => setBatchPreview(!batchPreviewActive)}
        />

        <ActionButton
          icon={<Undo2 className="h-4 w-4" />}
          title="Undo Batch Edit"
          description={
            canUndo
              ? batchUndoStack[batchUndoStack.length - 1]?.label ?? 'Undo last batch'
              : 'No batch edits yet'
          }
          disabled={!canUndo}
          onClick={() => {
            undoBatchEdit();
            toast.success('Batch edit undone');
          }}
        />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  title,
  description,
  onClick,
  disabled,
  primary,
  active,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  active?: boolean;
}) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className="pe-batch__action"
      data-primary={primary || undefined}
      data-active={active || undefined}
    >
      <span className="pe-batch__action-icon">{icon}</span>
      <span className="min-w-0">
        <span className="pe-batch__action-title">{title}</span>
        <span className="pe-batch__action-desc">{description}</span>
      </span>
    </motion.button>
  );
}
