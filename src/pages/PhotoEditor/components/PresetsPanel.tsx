import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { EDITOR_PRESETS, PRESET_CATEGORIES, filterPresets } from '../data';
import { usePhotoEditorStore } from '../store';
import { EmptyState } from './ui';
import { PresetCard } from './PresetCard';
import '../styles/presets.css';

export function PresetsPanel() {
  const photo = usePhotoEditorStore((s) => s.getActivePhoto());
  const favoritePresetIds = usePhotoEditorStore((s) => s.favoritePresetIds);
  const presetQuery = usePhotoEditorStore((s) => s.presetQuery);
  const presetCategory = usePhotoEditorStore((s) => s.presetCategory);
  const presetPreviewId = usePhotoEditorStore((s) => s.presetPreviewId);
  const applyingPresetId = usePhotoEditorStore((s) => s.applyingPresetId);
  const applyPreset = usePhotoEditorStore((s) => s.applyPreset);
  const beginPresetPreview = usePhotoEditorStore((s) => s.beginPresetPreview);
  const endPresetPreview = usePhotoEditorStore((s) => s.endPresetPreview);
  const toggleFavoritePreset = usePhotoEditorStore((s) => s.toggleFavoritePreset);
  const setPresetQuery = usePhotoEditorStore((s) => s.setPresetQuery);
  const setPresetCategory = usePhotoEditorStore((s) => s.setPresetCategory);

  const filtered = useMemo(
    () =>
      filterPresets(EDITOR_PRESETS, {
        query: presetQuery,
        category: presetCategory,
        favorites: favoritePresetIds,
      }),
    [presetQuery, presetCategory, favoritePresetIds],
  );

  if (!photo) {
    return (
      <EmptyState
        icon={<Sparkles className="h-5 w-5" />}
        title="No photo selected"
        description="Select a photo to browse and apply presets."
        className="m-3"
      />
    );
  }

  return (
    <div className="pe-presets" onPointerLeave={endPresetPreview}>
      <div className="pe-presets__toolbar">
        <div className="pe-presets__search">
          <Search className="pe-presets__search-icon h-3.5 w-3.5" />
          <input
            type="search"
            value={presetQuery}
            onChange={(e) => setPresetQuery(e.target.value)}
            placeholder="Search presets…"
            className="pe-presets__search-input"
            aria-label="Search presets"
          />
        </div>

        <div className="pe-presets__cats" role="tablist" aria-label="Preset categories">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={presetCategory === cat.id}
              data-active={presetCategory === cat.id}
              className="pe-presets__cat"
              onClick={() => setPresetCategory(cat.id)}
            >
              {cat.label}
              {cat.id === 'favorites' && favoritePresetIds.length > 0
                ? ` (${favoritePresetIds.length})`
                : null}
            </button>
          ))}
        </div>
      </div>

      <div className="pe-presets__meta">
        <span className="pe-presets__count">
          {filtered.length} preset{filtered.length === 1 ? '' : 's'}
        </span>
        <span className="pe-presets__hint">Hover to preview</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-5 w-5" />}
          title="No presets found"
          description={
            presetCategory === 'favorites'
              ? 'Star presets to save them here.'
              : 'Try another search or category.'
          }
          className="m-3"
        />
      ) : (
        <div className="pe-presets__grid pe-scrollbar">
          <AnimatePresence mode="popLayout">
            {filtered.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                active={photo.presetId === preset.id && !presetPreviewId}
                favorite={favoritePresetIds.includes(preset.id)}
                previewing={presetPreviewId === preset.id}
                applying={applyingPresetId === preset.id}
                onApply={() => applyPreset(preset.id)}
                onPreviewStart={() => beginPresetPreview(preset.id)}
                onPreviewEnd={endPresetPreview}
                onToggleFavorite={() => toggleFavoritePreset(preset.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
