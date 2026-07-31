import { EDITOR_MODULES } from '../../data';
import type { EditorModule } from '../../types';

type Props = {
  moduleId: EditorModule;
};

const PLACEHOLDER_ITEMS: Record<string, string[]> = {
  templates: ['Cinematic Wedding', 'Reel Vertical', 'Teaser 30s', 'Reception Glow'],
  text: ['Title Card', 'Lower Third', 'Credits', 'Quote Overlay'],
  captions: ['Auto Caption Style A', 'Karaoke Pop', 'Minimal Line', 'Bold Center'],
  audio: ['Room Tone', 'Applause Soft', 'Crowd Ambience'],
  music: ['Golden Hour', 'First Dance', 'Celebration'],
  voice: ['Narration Soft', 'Warm VO', 'Documentary'],
  effects: ['Light Leak', 'Film Grain', 'Vignette Soft', 'Glow Bloom'],
  transitions: ['Cross Dissolve', 'Whip Pan', 'Fade to Black', 'Match Cut'],
  filters: ['Warm Film', 'Teal Orange', 'Noir Soft', 'Pastel Matte'],
  overlay: ['Light Dust', 'Bokeh Soft', 'Film Burn'],
  stickers: ['Heart Burst', 'Date Badge', 'Location Pin'],
  elements: ['Shape Frame', 'Divider Line', 'Arrow Soft'],
  animation: ['Fade Up', 'Scale In', 'Slide Soft', 'Typewriter'],
  speed: ['0.5× Slow', '1× Normal', '2× Fast', 'Ramp In'],
  color: ['Wedding Warm', 'Golden Hour', 'Cool Night', 'Neutral Log'],
  export: ['Instagram Reel', 'YouTube 1080p', 'TikTok Vertical'],
};

export function ModulePlaceholderPanel({ moduleId }: Props) {
  const mod = EDITOR_MODULES.find((m) => m.id === moduleId);
  const items = PLACEHOLDER_ITEMS[moduleId] ?? ['Coming soon'];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-[var(--ve-border)] px-3 py-3">
        <div className="flex items-center gap-2">
          {mod ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--ve-primary-soft)] text-[var(--ve-primary)]">
              <mod.icon className="h-4 w-4" />
            </span>
          ) : null}
          <div>
            <h2 className="text-[13px] font-bold text-[var(--ve-ink)]">{mod?.label ?? 'Panel'}</h2>
            <p className="text-[11px] text-[var(--ve-ink-soft)]">Browse & apply to timeline</p>
          </div>
        </div>
      </div>
      <div className="ve-scrollbar min-h-0 flex-1 space-y-1.5 overflow-y-auto p-3">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="flex w-full items-center rounded-[12px] border border-[var(--ve-border)] bg-[var(--ve-card)] px-3 py-2.5 text-left text-[12px] font-semibold text-[var(--ve-ink-soft)] transition-colors hover:border-[var(--ve-primary)]/35 hover:text-[var(--ve-ink)]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
