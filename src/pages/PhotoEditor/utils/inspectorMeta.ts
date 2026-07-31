import type { EditorTool } from '../types';
import { isAiToolId } from '../data/aiTools';

export type InspectorSheetMeta = {
  title: string;
  subtitle: string;
};

export function getInspectorSheetMeta(activeTool: EditorTool): InspectorSheetMeta {
  if (activeTool === 'batch') {
    return { title: 'Batch Edit', subtitle: 'Copy & apply across photos' };
  }
  if (activeTool === 'history') {
    return { title: 'History', subtitle: 'Undo timeline & snapshots' };
  }
  if (isAiToolId(activeTool)) {
    return { title: 'AI Editing', subtitle: 'Mock studio · no API required' };
  }
  return { title: 'Adjust', subtitle: 'Tone, presets & filters' };
}
