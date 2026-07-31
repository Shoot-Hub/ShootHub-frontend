import { useAuth } from '@/store';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Undo2,
  Redo2,
  History,
  Keyboard,
  Cloud,
  ChevronDown,
  Sparkles,
  Upload,
} from 'lucide-react';
import shoothubLogo from '@/assets/landing/shoothub-logo-mark.png';
import { useHistoryStore, useUiStore } from '../store';
import { IconButton } from './ui';

export function TopToolbar() {
  const { user } = useAuth();
  const projectName = useUiStore((s) => s.projectName);
  const autoSaveLabel = useUiStore((s) => s.autoSaveLabel);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const history = useHistoryStore((s) => s.history);
  const historyIndex = useHistoryStore((s) => s.historyIndex);
  const setHistoryOpen = useUiStore((s) => s.setHistoryOpen);
  const setShortcutsOpen = useUiStore((s) => s.setShortcutsOpen);
  const setExportOpen = useUiStore((s) => s.setExportOpen);
  const setActiveModule = useUiStore((s) => s.setActiveModule);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const userName =
    user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Creator';
  const initials = userName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const avatar = user?.avatar?.url;

  return (
    <header className="flex h-12 shrink-0 items-center gap-1.5 border-b border-[var(--ve-border)] bg-[var(--ve-surface)] px-2 sm:h-14 sm:gap-3 sm:px-4">
      <Link to="/creator" className="flex shrink-0 items-center gap-2">
        <img
          src={shoothubLogo}
          alt="ShootHub"
          className="h-7 w-auto object-contain brightness-110"
        />
        <span className="hidden text-[13px] font-bold tracking-tight text-[var(--ve-ink)] lg:inline">
          Studio
        </span>
      </Link>

      <div className="hidden h-5 w-px bg-[var(--ve-border-strong)] sm:block" />

      <button
        type="button"
        className="flex min-w-0 max-w-[120px] items-center gap-1.5 rounded-[var(--ve-radius-sm)] px-1.5 py-1.5 text-left transition-colors hover:bg-[var(--ve-elevated)] sm:max-w-[220px] sm:px-2"
      >
        <span className="truncate text-[12px] font-semibold text-[var(--ve-ink)] sm:text-[13px]">
          {projectName}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--ve-ink-muted)]" />
      </button>

      <div className="hidden items-center gap-1.5 text-[11px] font-medium text-[var(--ve-success)] md:flex">
        <Cloud className="h-3.5 w-3.5" />
        <span className="text-[var(--ve-ink-soft)]">{autoSaveLabel}</span>
      </div>

      <div className="mx-auto flex items-center gap-0.5 rounded-[var(--ve-radius-md)] bg-[var(--ve-card)] p-1">
        <IconButton
          compact
          icon={<Undo2 className="h-4 w-4" />}
          aria-label="Undo"
          disabled={!canUndo}
          onClick={undo}
        />
        <IconButton
          compact
          icon={<Redo2 className="h-4 w-4" />}
          aria-label="Redo"
          disabled={!canRedo}
          onClick={redo}
        />
        <div className="mx-0.5 hidden h-4 w-px bg-[var(--ve-border-strong)] sm:block" />
        <IconButton
          compact
          icon={<History className="h-4 w-4" />}
          aria-label="History"
          label="History"
          onClick={() => setHistoryOpen(true)}
          className="!hidden !w-auto px-2.5 sm:!inline-flex"
        />
        <IconButton
          compact
          icon={<Keyboard className="h-4 w-4" />}
          aria-label="Shortcuts"
          label="Shortcuts"
          onClick={() => setShortcutsOpen(true)}
          className="!hidden !w-auto px-2.5 md:!inline-flex"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setActiveModule('ai-studio');
          }}
          className="relative inline-flex items-center gap-1.5 rounded-[12px] bg-gradient-to-r from-[var(--ve-primary)] to-[var(--ve-accent)] px-2.5 py-2 text-xs font-bold text-white shadow-[0_4px_16px_var(--ve-accent-glow)] sm:px-3"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI Assistant</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setExportOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-[12px] bg-[var(--ve-primary)] px-2.5 py-2 text-xs font-bold text-white shadow-[0_4px_16px_var(--ve-primary-glow)] transition-colors hover:bg-[var(--ve-primary-hover)] sm:px-3"
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </motion.button>

        <div className="hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--ve-primary)] to-[var(--ve-accent)] text-[10px] font-bold text-white ring-2 ring-[var(--ve-border-strong)] sm:flex">
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </div>
    </header>
  );
}
