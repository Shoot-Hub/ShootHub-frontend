export const EDITOR_SHORTCUTS = [
  { keys: 'Ctrl/⌘ + Z', action: 'Undo' },
  { keys: 'Ctrl/⌘ + Shift + Z', action: 'Redo' },
  { keys: 'Delete / Backspace', action: 'Delete selected' },
  { keys: 'Ctrl/⌘ + D', action: 'Duplicate element' },
  { keys: 'Arrow keys', action: 'Nudge 1%' },
  { keys: 'Shift + Arrow', action: 'Nudge 5%' },
  { keys: 'Ctrl/⌘ + A', action: 'Select all on page' },
  { keys: 'Escape', action: 'Deselect' },
] as const;
