import { useAuth } from '@/store';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Undo2,
  Redo2,
  FlipHorizontal2,
  Sparkles,
  Save,
  Upload,
  Menu,
  SlidersHorizontal,
  PanelRightClose,
  PanelRightOpen,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';
import shoothubLogo from '@/assets/landing/shoothub-logo-mark.png';
import { usePhotoEditorStore } from '../store';
import { useHistoryControls, useEditorLayout } from '../hooks';
import { IconButton } from './ui';

export function TopToolbar() {
  const { user } = useAuth();
  const activePhoto = usePhotoEditorStore((s) => s.getActivePhoto());
  const { undo, redo, canUndo, canRedo } = useHistoryControls();
  const compareMode = usePhotoEditorStore((s) => s.compareMode);
  const toggleCompareMode = usePhotoEditorStore((s) => s.toggleCompareMode);
  const runAiEnhance = usePhotoEditorStore((s) => s.runAiEnhance);
  const setExportOpen = usePhotoEditorStore((s) => s.setExportOpen);
  const {
    isCompact,
    rightCollapsed,
    rightSheetOpen,
    setLeftDrawerOpen,
    setRightSheetOpen,
    toggleRightCollapsed,
    openInspector,
  } = useEditorLayout();

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
    <header
      className="pe-topbar flex h-14 shrink-0 items-center gap-1.5 border-b border-[var(--pe-border)] bg-[var(--pe-surface)] px-2 sm:gap-2 sm:px-3 lg:gap-3 lg:px-4"
      role="banner"
    >      {isCompact ? (
        <IconButton
          compact
          icon={<Menu className="h-4 w-4" />}
          aria-label="Open tools"
          onClick={() => setLeftDrawerOpen(true)}
        />
      ) : (
        <Link to="/creator" className="hidden items-center gap-2 lg:flex">
          <img
            src={shoothubLogo}
            alt="ShootHub"
            className="h-7 w-auto object-contain brightness-110"
          />
        </Link>
      )}

      {isCompact ? (
        <Link
          to="/creator"
          className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] text-[var(--pe-ink-soft)] hover:bg-[var(--pe-elevated)]"
          aria-label="Back to creator"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      ) : null}

      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        <span className="hidden items-center gap-1.5 rounded-full bg-[var(--pe-elevated)] px-2.5 py-1 text-[11px] font-semibold text-[var(--pe-ink-soft)] md:inline-flex">
          Photo Editor
        </span>
        <span className="hidden text-[var(--pe-ink-muted)] md:inline">·</span>
        <span className="truncate font-semibold text-[var(--pe-ink)] max-w-[42vw] sm:max-w-[180px] md:max-w-[220px]">
          {activePhoto?.name ?? 'No photo'}
        </span>
      </div>

      <div className="flex items-center gap-0.5 rounded-[14px] bg-[var(--pe-elevated)] p-1">
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
        <div className="mx-0.5 hidden h-4 w-px bg-[var(--pe-border-strong)] sm:block" />
        <IconButton
          compact
          active={compareMode}
          icon={<FlipHorizontal2 className="h-4 w-4" />}
          aria-label="Compare"
          label="Compare"
          onClick={toggleCompareMode}
          className="!w-auto px-2 hidden sm:inline-flex"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
        {isCompact ? (
          <IconButton
            compact
            active={rightSheetOpen}
            icon={<SlidersHorizontal className="h-4 w-4" />}
            aria-label="Open adjust panel"
            onClick={() => {
              if (rightSheetOpen) setRightSheetOpen(false);
              else openInspector();
            }}
          />
        ) : (
          <IconButton
            compact
            icon={
              rightCollapsed ? (
                <PanelRightOpen className="h-4 w-4" />
              ) : (
                <PanelRightClose className="h-4 w-4" />
              )
            }
            aria-label={rightCollapsed ? 'Show panel' : 'Hide panel'}
            onClick={toggleRightCollapsed}
            className="hidden md:inline-flex"
          />
        )}

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            runAiEnhance();
            toast.success('AI Enhance started');
          }}
          className="relative hidden items-center gap-1.5 rounded-[12px] bg-[var(--pe-primary)] px-2.5 py-2 text-xs font-bold text-white shadow-[0_4px_16px_var(--pe-primary-glow)] md:inline-flex lg:px-3"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">AI Enhance</span>
        </motion.button>

        <button
          type="button"
          onClick={() => toast.success('Draft saved')}
          className="hidden items-center gap-1.5 rounded-[12px] border border-[var(--pe-border-strong)] bg-[var(--pe-elevated)] px-3 py-2 text-xs font-semibold text-[var(--pe-ink-soft)] transition-colors hover:border-[var(--pe-primary)]/40 hover:text-[var(--pe-ink)] lg:inline-flex"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setExportOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-[12px] bg-[var(--pe-primary)] px-2.5 py-2 text-xs font-bold text-white shadow-[0_4px_16px_var(--pe-primary-glow)] sm:px-3"
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </motion.button>

        <div className="hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--pe-primary)] to-[#8a7aff] text-[10px] font-bold text-white ring-2 ring-[var(--pe-border-strong)] sm:flex">
          {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : initials}
        </div>
      </div>
    </header>
  );
}
