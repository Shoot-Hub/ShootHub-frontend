import { RotateCcw } from 'lucide-react';
import {
  useSelectionStore,
  useTimelineStore,
  useUiStore,
  useHistoryStore,
} from '../store';
import { useMatchMedia } from '../hooks';
import {
  PanelSection,
  SliderField,
  TabBar,
  ToggleSwitch,
} from './ui';
import { MobileBottomSheet } from './MobileBottomSheet';
import type { BlendMode, PropertiesTab, VideoSubTab } from '../types';

const PROP_TABS: { id: PropertiesTab; label: string }[] = [
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio' },
  { id: 'speed', label: 'Speed' },
  { id: 'animation', label: 'Animation' },
  { id: 'ai', label: 'AI' },
];

const VIDEO_SUB: { id: VideoSubTab; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'cutout', label: 'Cutout' },
  { id: 'mask', label: 'Mask' },
  { id: 'enhance', label: 'Enhance' },
];

const BLEND_MODES: BlendMode[] = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'soft-light',
];

export function PropertiesPanel() {
  const propertiesOpen = useUiStore((s) => s.propertiesOpen);
  const propertiesTab = useUiStore((s) => s.propertiesTab);
  const setPropertiesTab = useUiStore((s) => s.setPropertiesTab);
  const videoSubTab = useUiStore((s) => s.videoSubTab);
  const setVideoSubTab = useUiStore((s) => s.setVideoSubTab);
  const transform = useUiStore((s) => s.transform);
  const setTransform = useUiStore((s) => s.setTransform);
  const audioProps = useUiStore((s) => s.audioProps);
  const setAudioProps = useUiStore((s) => s.setAudioProps);
  const speedProps = useUiStore((s) => s.speedProps);
  const setSpeedProps = useUiStore((s) => s.setSpeedProps);
  const textProps = useUiStore((s) => s.textProps);
  const setTextProps = useUiStore((s) => s.setTextProps);
  const videoFeatures = useUiStore((s) => s.videoFeatures);
  const setVideoFeatures = useUiStore((s) => s.setVideoFeatures);
  const resetAllProperties = useUiStore((s) => s.resetAllProperties);
  const pushHistory = useHistoryStore((s) => s.pushLabel);
  const selectedClipId = useSelectionStore((s) => s.selectedClipId);
  const clips = useTimelineStore((s) => s.clips);

  const selectedClip = clips.find((c) => c.id === selectedClipId);
  const setPropertiesOpen = useUiStore((s) => s.setPropertiesOpen);
  const isCompact = useMatchMedia('(max-width: 1023px)');

  const panelBody = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-[var(--ve-border)] p-3">
        <TabBar tabs={PROP_TABS} value={propertiesTab} onChange={setPropertiesTab} />
        <p className="mt-2 truncate text-[11px] text-[var(--ve-ink-soft)]">
          {selectedClip ? selectedClip.name : 'No clip selected'}
        </p>
      </div>

      <div className="ve-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
        {propertiesTab === 'video' ? (
          <>
            <div className="mb-3">
              <TabBar tabs={VIDEO_SUB} value={videoSubTab} onChange={setVideoSubTab} />
            </div>

            {videoSubTab === 'basic' ? (
              <>
                <PanelSection title="Transform">
                  <SliderField
                    label="Scale"
                    value={transform.scale}
                    min={10}
                    max={400}
                    displayValue={`${transform.scale}%`}
                    showInput
                    onChange={(v) => setTransform({ scale: v })}
                    onCommit={() => pushHistory('Scale')}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="space-y-1">
                      <span className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">
                        Position X
                      </span>
                      <input
                        type="number"
                        value={transform.positionX}
                        onChange={(e) =>
                          setTransform({ positionX: Number(e.target.value) })
                        }
                        className="h-8 w-full rounded-[8px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-2 text-[12px] font-bold text-[var(--ve-ink)] outline-none focus:border-[var(--ve-primary)]"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">
                        Position Y
                      </span>
                      <input
                        type="number"
                        value={transform.positionY}
                        onChange={(e) =>
                          setTransform({ positionY: Number(e.target.value) })
                        }
                        className="h-8 w-full rounded-[8px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-2 text-[12px] font-bold text-[var(--ve-ink)] outline-none focus:border-[var(--ve-primary)]"
                      />
                    </label>
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="min-w-0 flex-1 space-y-1">
                      <span className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">
                        Rotate
                      </span>
                      <input
                        type="number"
                        value={transform.rotation}
                        onChange={(e) =>
                          setTransform({ rotation: Number(e.target.value) })
                        }
                        className="h-8 w-full rounded-[8px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-2 text-[12px] font-bold text-[var(--ve-ink)] outline-none focus:border-[var(--ve-primary)]"
                      />
                    </label>
                    <button
                      type="button"
                      aria-label="Reset rotation"
                      onClick={() => setTransform({ rotation: 0 })}
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--ve-border)] text-[var(--ve-ink-muted)] hover:text-[var(--ve-ink)]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <SliderField
                    label="Corner Radius"
                    value={transform.cornerRadius}
                    min={0}
                    max={48}
                    onChange={(v) => setTransform({ cornerRadius: v })}
                  />
                  <SliderField
                    label="Shadow"
                    value={transform.shadow}
                    min={0}
                    max={100}
                    onChange={(v) => setTransform({ shadow: v })}
                  />
                </PanelSection>

                <PanelSection title="Blend">
                  <label className="block space-y-1">
                    <span className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">
                      Mode
                    </span>
                    <select
                      value={transform.blendMode}
                      onChange={(e) =>
                        setTransform({ blendMode: e.target.value as BlendMode })
                      }
                      className="h-8 w-full rounded-[8px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-2 text-[12px] font-semibold capitalize text-[var(--ve-ink)] outline-none"
                    >
                      {BLEND_MODES.map((m) => (
                        <option key={m} value={m}>
                          {m.replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </label>
                  <SliderField
                    label="Opacity"
                    value={transform.opacity}
                    min={0}
                    max={100}
                    displayValue={`${transform.opacity}%`}
                    onChange={(v) => setTransform({ opacity: v })}
                    onCommit={() => pushHistory('Opacity')}
                  />
                </PanelSection>

                <PanelSection title="Video">
                  <ToggleSwitch
                    label="Stabilization"
                    checked={videoFeatures.stabilization}
                    onChange={(v) => setVideoFeatures({ stabilization: v })}
                  />
                  <ToggleSwitch
                    label="Lens Correction"
                    checked={videoFeatures.lensCorrection}
                    onChange={(v) => setVideoFeatures({ lensCorrection: v })}
                  />
                  <ToggleSwitch
                    label="Noise Reduction"
                    checked={videoFeatures.noiseReduction}
                    onChange={(v) => setVideoFeatures({ noiseReduction: v })}
                  />
                  <ToggleSwitch
                    label="Relight"
                    badge="NEW"
                    checked={videoFeatures.relight}
                    onChange={(v) => setVideoFeatures({ relight: v })}
                  />
                </PanelSection>
              </>
            ) : (
              <div className="rounded-[var(--ve-radius-md)] border border-[var(--ve-border)] bg-[var(--ve-card)] p-4 text-center">
                <p className="text-[12px] font-semibold text-[var(--ve-ink)]">
                  {VIDEO_SUB.find((t) => t.id === videoSubTab)?.label}
                </p>
                <p className="mt-1 text-[11px] text-[var(--ve-ink-soft)]">
                  Advanced {videoSubTab} tools ready for your footage.
                </p>
              </div>
            )}
          </>
        ) : null}

        {propertiesTab === 'audio' ? (
          <PanelSection title="Audio">
            <SliderField
              label="Volume"
              value={audioProps.volume}
              displayValue={`${audioProps.volume}%`}
              onChange={(v) => setAudioProps({ volume: v })}
            />
            <SliderField
              label="Fade In"
              value={audioProps.fadeIn}
              max={5}
              step={0.1}
              displayValue={`${audioProps.fadeIn}s`}
              onChange={(v) => setAudioProps({ fadeIn: v })}
            />
            <SliderField
              label="Fade Out"
              value={audioProps.fadeOut}
              max={5}
              step={0.1}
              displayValue={`${audioProps.fadeOut}s`}
              onChange={(v) => setAudioProps({ fadeOut: v })}
            />
            <ToggleSwitch
              label="Noise Reduction"
              checked={audioProps.noiseReduction}
              onChange={(v) => setAudioProps({ noiseReduction: v })}
            />
            <SliderField
              label="EQ Bass"
              value={audioProps.eqBass}
              min={-12}
              max={12}
              onChange={(v) => setAudioProps({ eqBass: v })}
            />
            <SliderField
              label="EQ Mid"
              value={audioProps.eqMid}
              min={-12}
              max={12}
              onChange={(v) => setAudioProps({ eqMid: v })}
            />
            <SliderField
              label="EQ Treble"
              value={audioProps.eqTreble}
              min={-12}
              max={12}
              onChange={(v) => setAudioProps({ eqTreble: v })}
            />
          </PanelSection>
        ) : null}

        {propertiesTab === 'speed' ? (
          <PanelSection title="Speed">
            <SliderField
              label="Speed"
              value={speedProps.speed}
              min={0.1}
              max={4}
              step={0.1}
              displayValue={`${speedProps.speed}×`}
              onChange={(v) => setSpeedProps({ speed: v })}
            />
            <ToggleSwitch
              label="Reverse"
              checked={speedProps.reverse}
              onChange={(v) => setSpeedProps({ reverse: v })}
            />
            <ToggleSwitch
              label="Curve Speed"
              checked={speedProps.curveEnabled}
              onChange={(v) => setSpeedProps({ curveEnabled: v })}
            />
          </PanelSection>
        ) : null}

        {propertiesTab === 'animation' ? (
          <PanelSection title="Text & Animation">
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">Content</span>
              <input
                value={textProps.content}
                onChange={(e) => setTextProps({ content: e.target.value })}
                className="h-8 w-full rounded-[8px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-2 text-[12px] font-semibold text-[var(--ve-ink)] outline-none"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">Font</span>
              <select
                value={textProps.fontFamily}
                onChange={(e) => setTextProps({ fontFamily: e.target.value })}
                className="h-8 w-full rounded-[8px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-2 text-[12px] font-semibold text-[var(--ve-ink)] outline-none"
              >
                <option>Plus Jakarta Sans</option>
                <option>Inter</option>
                <option>Playfair Display</option>
                <option>Space Grotesk</option>
              </select>
            </label>
            <SliderField
              label="Font Size"
              value={textProps.fontSize}
              min={12}
              max={120}
              onChange={(v) => setTextProps({ fontSize: v })}
            />
            <SliderField
              label="Weight"
              value={textProps.fontWeight}
              min={300}
              max={900}
              step={100}
              onChange={(v) => setTextProps({ fontWeight: v })}
            />
            <SliderField
              label="Spacing"
              value={textProps.letterSpacing}
              min={-4}
              max={20}
              onChange={(v) => setTextProps({ letterSpacing: v })}
            />
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => setTextProps({ alignment: align })}
                  className={`flex-1 rounded-[8px] py-1.5 text-[11px] font-bold capitalize ${
                    textProps.alignment === align
                      ? 'bg-[var(--ve-primary-soft)] text-[var(--ve-primary)]'
                      : 'bg-[var(--ve-card)] text-[var(--ve-ink-muted)]'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
            <SliderField
              label="Stroke"
              value={textProps.stroke}
              max={12}
              onChange={(v) => setTextProps({ stroke: v })}
            />
            <SliderField
              label="Glow"
              value={textProps.glow}
              max={40}
              onChange={(v) => setTextProps({ glow: v })}
            />
          </PanelSection>
        ) : null}

        {propertiesTab === 'ai' ? (
          <div className="rounded-[var(--ve-radius-md)] border border-[var(--ve-border)] bg-gradient-to-br from-[var(--ve-primary-soft)] to-[var(--ve-card)] p-4">
            <p className="text-[13px] font-bold text-[var(--ve-ink)]">Clip AI Tools</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--ve-ink-soft)]">
              Open AI Studio from the left rail to run reel generation, captions, smart cut,
              and wedding highlight tools on this selection.
            </p>
          </div>
        ) : null}
      </div>

      <div className="border-t border-[var(--ve-border)] p-3">
        <button
          type="button"
          onClick={resetAllProperties}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] py-2.5 text-[12px] font-bold text-[var(--ve-ink-soft)] transition-colors hover:border-[var(--ve-danger)]/40 hover:text-[var(--ve-danger)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All
        </button>
      </div>
    </div>
  );

  return (
    <>
      {propertiesOpen && !isCompact ? (
        <aside className="hidden w-[var(--ve-props-w)] shrink-0 flex-col border-l border-[var(--ve-border)] bg-[var(--ve-surface)] lg:flex">
          {panelBody}
        </aside>
      ) : null}

      <MobileBottomSheet
        open={Boolean(propertiesOpen && isCompact)}
        title="Properties"
        onClose={() => setPropertiesOpen(false)}
        visibilityClassName="lg:hidden"
      >
        {panelBody}
      </MobileBottomSheet>
    </>
  );
}
