import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorTool } from '../types';
import { EDITOR_TOOLS, MOBILE_TOOL_IDS, isAiToolId, type EditorToolDefinition } from '../data';
import { usePhotoEditorStore } from '../store';
import '../styles/responsive.css';

function ToolButton({
  tool,
  active,
  expanded,
  onClick,
}: {
  tool: EditorToolDefinition;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title={tool.label}
      aria-pressed={active}
      aria-label={tool.label}
      className={cn(
        'relative flex w-full items-center gap-2.5 rounded-[14px] px-2 py-2.5 text-left transition-colors',
        active
          ? 'bg-[var(--pe-primary-soft)] text-[var(--pe-primary)]'
          : 'text-[var(--pe-ink-soft)] hover:bg-[var(--pe-elevated)] hover:text-[var(--pe-ink)]',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]',
          active
            ? 'bg-[var(--pe-primary)] text-white shadow-[0_4px_14px_var(--pe-primary-glow)]'
            : 'bg-[var(--pe-elevated)]',
        )}
      >
        <tool.icon className="h-[17px] w-[17px]" aria-hidden />
      </span>
      {expanded ? (
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold">{tool.label}</span>
      ) : null}
      {tool.badge && expanded ? (
        <span className="pe-badge-new absolute right-1.5 top-1.5">{tool.badge}</span>
      ) : null}
    </motion.button>
  );
}

export function LeftSidebar() {
  const activeTool = usePhotoEditorStore((s) => s.activeTool);
  const setActiveTool = usePhotoEditorStore((s) => s.setActiveTool);
  const runAiTool = usePhotoEditorStore((s) => s.runAiTool);
  const leftCollapsed = usePhotoEditorStore((s) => s.leftCollapsed);
  const leftDrawerOpen = usePhotoEditorStore((s) => s.leftDrawerOpen);
  const breakpoint = usePhotoEditorStore((s) => s.breakpoint);
  const toggleLeftCollapsed = usePhotoEditorStore((s) => s.toggleLeftCollapsed);
  const setLeftDrawerOpen = usePhotoEditorStore((s) => s.setLeftDrawerOpen);

  const isMobile = breakpoint === 'mobile';
  const expanded = isMobile ? true : !leftCollapsed;
  const showRail = isMobile ? leftDrawerOpen : true;

  const main = EDITOR_TOOLS.filter((t) => t.group === 'main');
  const ai = EDITOR_TOOLS.filter((t) => t.group === 'ai');
  const secondary = EDITOR_TOOLS.filter((t) => t.group === 'secondary');

  const onSelect = (id: EditorTool) => {
    setActiveTool(id);
    if (isAiToolId(id)) void runAiTool(id);
    if (isMobile) setLeftDrawerOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && leftDrawerOpen ? (
          <motion.button
            type="button"
            key="backdrop"
            className="pe-rail-backdrop"
            aria-label="Close tools"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLeftDrawerOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showRail ? (
          <motion.aside
            key="rail"
            className="pe-left-rail"
            data-expanded={expanded}
            data-mobile={isMobile}
            aria-label="Editing tools"
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : undefined}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <button
              type="button"
              className="pe-left-rail__collapse"
              onClick={toggleLeftCollapsed}
              aria-label={leftCollapsed ? 'Expand tools' : 'Collapse tools'}
            >
              {leftCollapsed ? (
                <PanelLeftOpen className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <PanelLeftClose className="h-3.5 w-3.5" aria-hidden />
              )}
              {expanded ? <span>Collapse</span> : null}
            </button>

            <div className="pe-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-2">
              <nav className="space-y-0.5" aria-label="Primary tools">
                {main.map((tool) => (
                  <ToolButton
                    key={tool.id}
                    tool={tool}
                    expanded={expanded}
                    active={activeTool === tool.id}
                    onClick={() => setActiveTool(tool.id)}
                  />
                ))}
              </nav>

              {expanded ? (
                <p className="mb-1 mt-3 px-2 text-[10px] font-extrabold uppercase tracking-wider text-[var(--pe-ink-muted)]">
                  AI Tools
                </p>
              ) : (
                <div className="my-3 h-px bg-[var(--pe-border)]" />
              )}

              <nav className="space-y-0.5" aria-label="AI tools">
                {ai.map((tool) => (
                  <ToolButton
                    key={tool.id}
                    tool={tool}
                    expanded={expanded}
                    active={isAiToolId(activeTool) && activeTool === tool.id}
                    onClick={() => onSelect(tool.id)}
                  />
                ))}
              </nav>

              <div className="my-3 h-px bg-[var(--pe-border)]" />

              <nav className="space-y-0.5" aria-label="Workflow tools">
                {secondary.map((tool) => (
                  <ToolButton
                    key={tool.id}
                    tool={tool}
                    expanded={expanded}
                    active={activeTool === tool.id}
                    onClick={() => onSelect(tool.id)}
                  />
                ))}
              </nav>
            </div>

            {expanded && !isMobile ? (
              <div className="shrink-0 p-2.5">
                <div className="overflow-hidden rounded-[var(--pe-radius)] border border-[var(--pe-primary)]/20 bg-gradient-to-br from-[var(--pe-primary-soft)] via-[var(--pe-surface-2)] to-[var(--pe-elevated)] p-3.5">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--pe-primary)] text-white">
                    <Wand2 className="h-4 w-4" aria-hidden />
                  </div>
                  <p className="text-[13px] font-bold text-[var(--pe-ink)]">AI Magic</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--pe-ink-muted)]">
                    One-click enhance for wedding photography.
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelect('ai-enhance')}
                    className="mt-3 w-full rounded-[12px] bg-[var(--pe-primary)] py-2 text-[11px] font-bold text-white"
                  >
                    Try AI Enhance
                  </button>
                </div>
              </div>
            ) : null}
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function MobileToolRail() {
  const activeTool = usePhotoEditorStore((s) => s.activeTool);
  const setActiveTool = usePhotoEditorStore((s) => s.setActiveTool);
  const runAiTool = usePhotoEditorStore((s) => s.runAiTool);
  const breakpoint = usePhotoEditorStore((s) => s.breakpoint);

  if (breakpoint !== 'mobile') return null;

  const essentials = EDITOR_TOOLS.filter((t) => MOBILE_TOOL_IDS.includes(t.id));

  return (
    <div className="pe-mobile-tools" role="toolbar" aria-label="Quick tools">
      {essentials.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className="pe-mobile-tool"
          data-active={activeTool === tool.id}
          aria-pressed={activeTool === tool.id}
          onClick={() => {
            setActiveTool(tool.id);
            if (isAiToolId(tool.id)) void runAiTool(tool.id);
          }}
        >
          <span className="pe-mobile-tool__icon">
            <tool.icon className="h-4 w-4" aria-hidden />
          </span>
          {tool.short}
        </button>
      ))}
    </div>
  );
}
