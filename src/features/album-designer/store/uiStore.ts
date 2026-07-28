import { create } from 'zustand';
import type { TemplateCategoryId } from '../data';

export type LeftPanelId =
  | 'templates'
  | 'layouts'
  | 'frames'
  | 'uploads'
  | 'photos'
  | 'text'
  | 'elements'
  | 'icons'
  | 'shapes'
  | 'stickers'
  | 'background'
  | 'brand'
  | 'qr'
  | 'ai';

export type RightPanelId =
  | 'properties'
  | 'layers'
  | 'history'
  | 'position'
  | 'effects'
  | 'typography';

type EditorUiState = {
  leftPanel: LeftPanelId;
  rightPanel: RightPanelId;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  zoom: number;
  showGrid: boolean;
  showGuides: boolean;
  showSafeArea: boolean;
  showBleed: boolean;
  showRulers: boolean;
  showPrintMargin: boolean;
  spacePanning: boolean;
  templateCategory: TemplateCategoryId | 'all';
  templateQuery: string;
  exportMenuOpen: boolean;
  setLeftPanel: (id: LeftPanelId) => void;
  setRightPanel: (id: RightPanelId) => void;
  toggleLeft: () => void;
  toggleRight: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  toggleGrid: () => void;
  toggleGuides: () => void;
  toggleSafeArea: () => void;
  toggleBleed: () => void;
  toggleRulers: () => void;
  togglePrintMargin: () => void;
  setSpacePanning: (v: boolean) => void;
  setTemplateCategory: (c: TemplateCategoryId | 'all') => void;
  setTemplateQuery: (q: string) => void;
  setExportMenuOpen: (v: boolean) => void;
};

const clampZoom = (z: number) => Math.min(300, Math.max(25, Math.round(z)));

export const useEditorUiStore = create<EditorUiState>((set, get) => ({
  leftPanel: 'templates',
  rightPanel: 'properties',
  leftCollapsed: false,
  rightCollapsed: false,
  zoom: 100,
  showGrid: false,
  showGuides: true,
  showSafeArea: true,
  showBleed: false,
  showRulers: true,
  showPrintMargin: false,
  spacePanning: false,
  templateCategory: 'wedding',
  templateQuery: '',
  exportMenuOpen: false,

  setLeftPanel: (id) => set({ leftPanel: id, leftCollapsed: false }),
  setRightPanel: (id) => set({ rightPanel: id, rightCollapsed: false }),
  toggleLeft: () => set((s) => ({ leftCollapsed: !s.leftCollapsed })),
  toggleRight: () => set((s) => ({ rightCollapsed: !s.rightCollapsed })),
  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
  zoomIn: () => set({ zoom: clampZoom(get().zoom + 10) }),
  zoomOut: () => set({ zoom: clampZoom(get().zoom - 10) }),
  resetZoom: () => set({ zoom: 100 }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleGuides: () => set((s) => ({ showGuides: !s.showGuides })),
  toggleSafeArea: () => set((s) => ({ showSafeArea: !s.showSafeArea })),
  toggleBleed: () => set((s) => ({ showBleed: !s.showBleed })),
  toggleRulers: () => set((s) => ({ showRulers: !s.showRulers })),
  togglePrintMargin: () => set((s) => ({ showPrintMargin: !s.showPrintMargin })),
  setSpacePanning: (v) => set({ spacePanning: v }),
  setTemplateCategory: (c) => set({ templateCategory: c }),
  setTemplateQuery: (q) => set({ templateQuery: q }),
  setExportMenuOpen: (v) => set({ exportMenuOpen: v }),
}));
