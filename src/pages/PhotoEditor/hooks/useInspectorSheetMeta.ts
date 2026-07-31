import { usePhotoEditorStore } from '../store';
import { getInspectorSheetMeta } from '../utils/inspectorMeta';

export function useInspectorSheetMeta() {
  const activeTool = usePhotoEditorStore((s) => s.activeTool);
  return getInspectorSheetMeta(activeTool);
}
