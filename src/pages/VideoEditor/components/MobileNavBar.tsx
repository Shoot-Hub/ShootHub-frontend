import { motion } from 'framer-motion';
import {
  Film,
  LayoutGrid,
  SlidersHorizontal,
  Upload,
  PanelBottom,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EDITOR_MODULES } from '../data';
import { useUiStore } from '../store';
import { MobileBottomSheet } from './MobileBottomSheet';

export function MobileNavBar() {
  const mediaPanelOpen = useUiStore((s) => s.mediaPanelOpen);
  const propertiesOpen = useUiStore((s) => s.propertiesOpen);
  const timelineExpanded = useUiStore((s) => s.timelineExpanded);
  const mobileModulesOpen = useUiStore((s) => s.mobileModulesOpen);
  const activeModule = useUiStore((s) => s.activeModule);
  const setMediaPanelOpen = useUiStore((s) => s.setMediaPanelOpen);
  const setPropertiesOpen = useUiStore((s) => s.setPropertiesOpen);
  const setMobileModulesOpen = useUiStore((s) => s.setMobileModulesOpen);
  const toggleTimelineExpanded = useUiStore((s) => s.toggleTimelineExpanded);
  const setActiveModule = useUiStore((s) => s.setActiveModule);
  const setExportOpen = useUiStore((s) => s.setExportOpen);

  const toggleMedia = () => {
    if (mediaPanelOpen) {
      setMediaPanelOpen(false);
      return;
    }
    setPropertiesOpen(false);
    setMobileModulesOpen(false);
    setMediaPanelOpen(true);
  };

  const toggleProps = () => {
    if (propertiesOpen) {
      setPropertiesOpen(false);
      return;
    }
    setMediaPanelOpen(false);
    setMobileModulesOpen(false);
    setPropertiesOpen(true);
  };

  const toggleModules = () => {
    if (mobileModulesOpen) {
      setMobileModulesOpen(false);
      return;
    }
    setMediaPanelOpen(false);
    setPropertiesOpen(false);
    setMobileModulesOpen(true);
  };

  const items = [
    {
      id: 'media',
      label: 'Media',
      icon: Film,
      active: mediaPanelOpen,
      onClick: toggleMedia,
      className: undefined as string | undefined,
    },
    {
      id: 'modules',
      label: 'Tools',
      icon: LayoutGrid,
      active: mobileModulesOpen,
      onClick: toggleModules,
      className: 'md:hidden',
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: PanelBottom,
      active: timelineExpanded,
      onClick: toggleTimelineExpanded,
      className: undefined,
    },
    {
      id: 'props',
      label: 'Props',
      icon: SlidersHorizontal,
      active: propertiesOpen,
      onClick: toggleProps,
      className: undefined,
    },
    {
      id: 'export',
      label: 'Export',
      icon: Upload,
      active: false,
      onClick: () => setExportOpen(true),
      className: undefined,
    },
  ];

  return (
    <>
      <nav
        className="ve-mobile-nav flex shrink-0 items-stretch border-t border-[var(--ve-border)] bg-[var(--ve-surface)] lg:hidden"
        aria-label="Editor mobile navigation"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[9px] font-bold transition-colors',
              item.active
                ? 'text-[var(--ve-primary)]'
                : 'text-[var(--ve-ink-muted)] active:text-[var(--ve-ink)]',
              item.className,
            )}
          >
            <item.icon
              className={cn('h-5 w-5', item.active && 'drop-shadow-[0_0_8px_var(--ve-primary-glow)]')}
            />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <MobileBottomSheet
        open={mobileModulesOpen}
        title="Editor tools"
        onClose={() => setMobileModulesOpen(false)}
        visibilityClassName="md:hidden"
        heightClassName="h-[min(58dvh,440px)]"
      >
        <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
          {EDITOR_MODULES.map((mod) => {
            const active = activeModule === mod.id;
            return (
              <motion.button
                key={mod.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setActiveModule(mod.id);
                  if (mod.id === 'export') {
                    setExportOpen(true);
                    setMobileModulesOpen(false);
                    return;
                  }
                  setMobileModulesOpen(false);
                  setMediaPanelOpen(true);
                }}
                className={cn(
                  'relative flex flex-col items-center gap-2 rounded-[14px] border px-2 py-3 transition-colors',
                  active
                    ? 'border-[var(--ve-primary)]/50 bg-[var(--ve-primary-soft)] text-[var(--ve-primary)]'
                    : 'border-[var(--ve-border)] bg-[var(--ve-card)] text-[var(--ve-ink-soft)]',
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-[12px]',
                    active
                      ? 'bg-[var(--ve-primary)] text-white'
                      : 'bg-[var(--ve-elevated)]',
                  )}
                >
                  <mod.icon className="h-4 w-4" />
                </span>
                <span className="text-center text-[10px] font-semibold leading-tight">
                  {mod.label}
                </span>
                {mod.badge ? (
                  <span className="ve-badge-new absolute right-1.5 top-1.5">{mod.badge}</span>
                ) : null}
              </motion.button>
            );
          })}
        </div>
      </MobileBottomSheet>
    </>
  );
}
