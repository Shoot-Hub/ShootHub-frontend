import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EDITOR_MODULES } from '../data';
import { useUiStore } from '../store';

export function LeftSidebar() {
  const activeModule = useUiStore((s) => s.activeModule);
  const setActiveModule = useUiStore((s) => s.setActiveModule);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebarCollapsed = useUiStore((s) => s.toggleSidebarCollapsed);

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-[var(--ve-border)] bg-[var(--ve-surface)] transition-[width] duration-200 md:flex',
        sidebarCollapsed ? 'w-[var(--ve-sidebar-w)]' : 'w-[var(--ve-sidebar-w)] xl:w-[72px]',
      )}
    >
      <div className="ve-scrollbar flex-1 overflow-y-auto overflow-x-hidden py-2">
        <nav className="flex flex-col items-center gap-0.5 px-1.5">
          {EDITOR_MODULES.map((mod) => {
            const active = activeModule === mod.id;
            return (
              <motion.button
                key={mod.id}
                type="button"
                title={mod.label}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveModule(mod.id)}
                className={cn(
                  'relative flex w-full flex-col items-center gap-1 rounded-[var(--ve-radius-sm)] px-1 py-2 transition-colors',
                  active
                    ? 'bg-[var(--ve-primary-soft)] text-[var(--ve-primary)]'
                    : 'text-[var(--ve-ink-soft)] hover:bg-[var(--ve-elevated)] hover:text-[var(--ve-ink)]',
                )}
              >
                {active ? (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--ve-primary)]" />
                ) : null}
                <span
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-[12px]',
                    active
                      ? 'bg-[var(--ve-primary)] text-white shadow-[0_4px_14px_var(--ve-primary-glow)]'
                      : 'bg-[var(--ve-card)]',
                  )}
                >
                  <mod.icon className="h-[17px] w-[17px]" />
                  {mod.badge ? (
                    <span className="ve-badge-new absolute -right-1.5 -top-1.5">{mod.badge}</span>
                  ) : null}
                </span>
                <span className="max-w-full truncate text-[9px] font-semibold leading-tight">
                  {mod.label}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={toggleSidebarCollapsed}
        className="mx-auto mb-2 hidden h-8 w-8 items-center justify-center rounded-[10px] text-[var(--ve-ink-muted)] transition-colors hover:bg-[var(--ve-elevated)] hover:text-[var(--ve-ink)] xl:flex"
        aria-label="Collapse sidebar"
      >
        {sidebarCollapsed ? (
          <ChevronsRight className="h-4 w-4" />
        ) : (
          <ChevronsLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
