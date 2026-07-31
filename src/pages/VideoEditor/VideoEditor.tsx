import { motion } from 'framer-motion';
import {
  TopToolbar,
  LeftSidebar,
  MediaPanel,
  PreviewWindow,
  PropertiesPanel,
  Timeline,
  BottomStatusBar,
  MobileNavBar,
  ExportDialog,
  HistoryDialog,
  ShortcutsDialog,
} from './components';
import { ClipContextMenu } from './components/ContextMenu/ClipContextMenu';
import {
  useVideoEditorKeyboard,
  usePlaybackTicker,
  useFullscreenSync,
  useResponsiveEditor,
} from './hooks';
import { bindEditorStores } from './store';
import './styles/video-editor-theme.css';

bindEditorStores();

export function VideoEditor() {
  useVideoEditorKeyboard();
  usePlaybackTicker();
  useFullscreenSync();
  useResponsiveEditor();

  return (
    <div className="video-editor-root flex h-dvh max-h-dvh flex-col overflow-hidden bg-[var(--ve-bg)]">
      <TopToolbar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 min-w-0 flex-1">
          <LeftSidebar />
          <MediaPanel />

          <motion.div
            layout
            className="flex min-h-0 min-w-0 flex-1 flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <PreviewWindow />
          </motion.div>

          <PropertiesPanel />
        </div>

        <Timeline />
        <BottomStatusBar />
      </div>

      <MobileNavBar />

      <ExportDialog />
      <HistoryDialog />
      <ShortcutsDialog />
      <ClipContextMenu />
    </div>
  );
}
