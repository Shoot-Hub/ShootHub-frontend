/** Keyboard shortcut map for Photo Editor (UI + hotkeys). */
export const PHOTO_EDITOR_SHORTCUTS = {
  undo: { keys: ['mod+z', 'ctrl+z'], label: 'Ctrl+Z', description: 'Undo' },
  redo: {
    keys: ['mod+shift+z', 'ctrl+shift+z', 'mod+y', 'ctrl+y'],
    label: 'Ctrl+Shift+Z',
    description: 'Redo',
  },
  compare: { keys: ['c'], label: 'C', description: 'Before / after compare' },
  export: { keys: ['mod+e', 'ctrl+e'], label: 'Ctrl+E', description: 'Export' },
  copyEdits: {
    keys: ['mod+shift+c', 'ctrl+shift+c'],
    label: 'Ctrl+Shift+C',
    description: 'Copy edits',
  },
  pasteEdits: {
    keys: ['mod+shift+v', 'ctrl+shift+v'],
    label: 'Ctrl+Shift+V',
    description: 'Paste edits',
  },
  reset: { keys: ['mod+r', 'ctrl+r'], label: 'Ctrl+R', description: 'Reset adjustments' },
  snapshot: {
    keys: ['mod+shift+s', 'ctrl+shift+s'],
    label: 'Ctrl+Shift+S',
    description: 'Save snapshot',
  },
} as const;

export const HOTKEY_OPTS = {
  enableOnFormTags: false,
  preventDefault: true,
} as const;
