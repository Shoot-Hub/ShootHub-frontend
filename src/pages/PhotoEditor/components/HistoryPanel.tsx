import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Camera,
  Clock3,
  Redo2,
  RotateCcw,
  Undo2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usePhotoEditorStore } from '../store';
import type { HistoryEntry } from '../types';
import { EmptyState } from './ui';
import '../styles/history.css';

type HistoryFilter = 'all' | 'edits' | 'snapshots';

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function HistoryPanel() {
  const history = usePhotoEditorStore((s) => s.history);
  const historyIndex = usePhotoEditorStore((s) => s.historyIndex);
  const restoreHistory = usePhotoEditorStore((s) => s.restoreHistory);
  const clearHistory = usePhotoEditorStore((s) => s.clearHistory);
  const addSnapshot = usePhotoEditorStore((s) => s.addSnapshot);
  const undo = usePhotoEditorStore((s) => s.undo);
  const redo = usePhotoEditorStore((s) => s.redo);
  const resetActiveAdjustments = usePhotoEditorStore((s) => s.resetActiveAdjustments);
  const photo = usePhotoEditorStore((s) => s.getActivePhoto());

  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [snapLabel, setSnapLabel] = useState('');

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  const visible = useMemo(() => {
    const indexed = history.map((entry, index) => ({ entry, index }));
    const filtered =
      filter === 'snapshots'
        ? indexed.filter(({ entry }) => entry.isSnapshot)
        : filter === 'edits'
          ? indexed.filter(({ entry }) => !entry.isSnapshot)
          : indexed;
    return [...filtered].reverse();
  }, [history, filter]);

  const snapshotCount = history.filter((h) => h.isSnapshot).length;

  const handleRestore = (entry: HistoryEntry) => {
    restoreHistory(entry.id);
    toast.success(entry.isSnapshot ? 'Snapshot restored' : 'History restored');
  };

  const handleSnapshot = () => {
    if (!photo) {
      toast.error('Select a photo first');
      return;
    }
    const label = snapLabel.trim() || undefined;
    addSnapshot(label);
    setSnapLabel('');
    toast.success('Snapshot saved');
  };

  return (
    <div className="pe-history">
      <div className="pe-history__toolbar">
        <motion.button
          type="button"
          className="pe-history__btn"
          disabled={!canUndo}
          whileTap={canUndo ? { scale: 0.97 } : undefined}
          onClick={undo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-3.5 w-3.5" aria-hidden />
          Undo
        </motion.button>
        <motion.button
          type="button"
          className="pe-history__btn"
          disabled={!canRedo}
          whileTap={canRedo ? { scale: 0.97 } : undefined}
          onClick={redo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-3.5 w-3.5" aria-hidden />
          Redo
        </motion.button>
      </div>

      <div className="pe-history__snap-row">
        <input
          type="text"
          value={snapLabel}
          onChange={(e) => setSnapLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSnapshot();
            }
          }}
          placeholder="Snapshot name (optional)"
          className="pe-history__snap-input"
          aria-label="Snapshot name"
        />
        <motion.button
          type="button"
          className="pe-history__btn"
          data-primary="true"
          style={{ width: 96, flexShrink: 0 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSnapshot}
          disabled={!photo}
        >
          <Camera className="h-3.5 w-3.5" />
          Save
        </motion.button>
      </div>

      <div className="pe-history__filters" role="tablist" aria-label="History filters">
        {(
          [
            { id: 'all', label: 'Timeline' },
            { id: 'edits', label: 'Edits' },
            { id: 'snapshots', label: `Snapshots${snapshotCount ? ` (${snapshotCount})` : ''}` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            className="pe-history__filter"
            data-active={filter === tab.id}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pe-history__meta">
        <span className="pe-history__count">
          {visible.length} entr{visible.length === 1 ? 'y' : 'ies'}
          {historyIndex >= 0 ? ` · step ${historyIndex + 1}/${history.length}` : ''}
        </span>
        <button
          type="button"
          className="pe-history__btn"
          style={{ height: 26, padding: '0 8px', width: 'auto' }}
          onClick={() => {
            resetActiveAdjustments();
            toast.success('Adjustments reset');
          }}
          disabled={!photo}
          title="Reset adjustments"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="pe-history__scroll pe-scrollbar">
        {!history.length ? (
          <EmptyState
            icon={<Clock3 className="h-5 w-5" />}
            title="No history yet"
            description="Edits and snapshots will appear on the timeline."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Camera className="h-5 w-5" />}
            title={filter === 'snapshots' ? 'No snapshots' : 'No edits'}
            description={
              filter === 'snapshots'
                ? 'Save a snapshot to pin a restore point.'
                : 'Make an edit to fill the timeline.'
            }
          />
        ) : (
          <ul className="pe-history__timeline">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map(({ entry, index }) => {
                const active = index === historyIndex;
                const future = index > historyIndex;
                return (
                  <motion.li
                    key={entry.id}
                    layout
                    className="pe-history__item"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 32,
                      mass: 0.7,
                    }}
                  >
                    <div
                      className="pe-history__item-btn"
                      data-active={active}
                      data-future={future}
                      data-snapshot={Boolean(entry.isSnapshot)}
                      data-pulse={active}
                      role="button"
                      tabIndex={0}
                      aria-current={active ? 'step' : undefined}
                      onClick={() => handleRestore(entry)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRestore(entry);
                        }
                      }}
                    >
                      <span className="pe-history__dot" aria-hidden>
                        {entry.isSnapshot ? (
                          <Camera className="h-3.5 w-3.5" />
                        ) : (
                          <Clock3 className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="pe-history__label">{entry.label}</span>
                        <span className="pe-history__time">{formatTime(entry.timestamp)}</span>
                        {entry.isSnapshot ? (
                          <span className="pe-history__badge">Snapshot</span>
                        ) : active ? (
                          <span className="pe-history__badge">Current</span>
                        ) : future ? (
                          <span className="pe-history__badge">Redo stack</span>
                        ) : null}
                      </span>
                      {!active ? (
                        <button
                          type="button"
                          className="pe-history__restore"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(entry);
                          }}
                        >
                          Restore
                        </button>
                      ) : null}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <div className="pe-history__footer">
        <div className="pe-history__shortcuts">
          <div className="pe-history__shortcut">
            <span>Undo</span>
            <span className="pe-history__kbd">Ctrl+Z</span>
          </div>
          <div className="pe-history__shortcut">
            <span>Redo</span>
            <span className="pe-history__kbd">Ctrl+Shift+Z</span>
          </div>
        </div>
        {history.length > 0 ? (
          <button
            type="button"
            className="pe-history__clear"
            onClick={() => {
              clearHistory();
              toast.success('History cleared');
            }}
          >
            Clear history
          </button>
        ) : null}
      </div>
    </div>
  );
}
