import { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TopToolbar,
  LeftSidebar,
  RightSidebar,
  ImageCanvas,
  FilmStrip,
  BottomToolbar,
  MobileBottomSheet,
  MobileToolRail,
} from './components';
import { PanelSkeleton } from './components/ui';
import {
  usePhotoEditorKeyboard,
  useFullscreenSync,
  usePhotoEditorBreakpoint,
  useEditorLayout,
  useInspectorSheetMeta,
} from './hooks';
import './styles/photo-editor-theme.css';
import './styles/responsive.css';

const ExportDialog = lazy(() =>
  import('./components/ExportDialog').then((m) => ({ default: m.ExportDialog })),
);
const BatchProgressDialog = lazy(() =>
  import('./components/BatchProgressDialog').then((m) => ({
    default: m.BatchProgressDialog,
  })),
);

export function PhotoEditor() {
  usePhotoEditorKeyboard();
  useFullscreenSync();
  usePhotoEditorBreakpoint();

  const { isCompact, showDockedRight, rightSheetOpen, setRightSheetOpen } = useEditorLayout();
  const sheetMeta = useInspectorSheetMeta();

  return (
    <div
      className="photo-editor-root pe-layout bg-[var(--pe-bg)]"
      role="application"
      aria-label="ShootHub Photo Editor"
    >
      <a
        href="#pe-canvas-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-2 focus:rounded-lg focus:bg-[var(--pe-primary)] focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to canvas
      </a>

      <TopToolbar />

      <div className="pe-layout__body">
        <LeftSidebar />

        <motion.div
          layout
          id="pe-canvas-main"
          className="pe-layout__stage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          tabIndex={-1}
        >
          <ImageCanvas />
          <BottomToolbar />
          <FilmStrip />
          <MobileToolRail />
        </motion.div>

        <AnimatePresence mode="wait">
          {showDockedRight ? (
            <motion.div
              key="right-dock"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="hidden h-full min-h-0 md:flex"
              aria-label="Inspector"
            >
              <Suspense fallback={<PanelSkeleton className="w-[300px]" label="Loading panel…" />}>
                <RightSidebar />
              </Suspense>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {isCompact ? (
        <MobileBottomSheet
          open={rightSheetOpen}
          onOpenChange={setRightSheetOpen}
          title={sheetMeta.title}
          subtitle={sheetMeta.subtitle}
        >
          <RightSidebar embedded />
        </MobileBottomSheet>
      ) : null}

      <Suspense fallback={null}>
        <ExportDialog />
        <BatchProgressDialog />
      </Suspense>
    </div>
  );
}
