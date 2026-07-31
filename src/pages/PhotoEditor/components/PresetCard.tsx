import { AnimatePresence, motion } from 'framer-motion';
import { Check, Heart } from 'lucide-react';
import type { PresetDefinition } from '../types';

type PresetCardProps = {
  preset: PresetDefinition;
  active: boolean;
  favorite: boolean;
  previewing: boolean;
  applying: boolean;
  onApply: () => void;
  onPreviewStart: () => void;
  onPreviewEnd: () => void;
  onToggleFavorite: () => void;
};

export function PresetCard({
  preset,
  active,
  favorite,
  previewing,
  applying,
  onApply,
  onPreviewStart,
  onPreviewEnd,
  onToggleFavorite,
}: PresetCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: 1,
        scale: applying ? [1, 1.04, 1] : 1,
      }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        layout: { duration: 0.2 },
        scale: applying ? { duration: 0.55, times: [0, 0.35, 1] } : { duration: 0.2 },
      }}
      className="pe-preset-card"
      data-active={active}
      data-previewing={previewing}
      onPointerEnter={onPreviewStart}
      onPointerLeave={onPreviewEnd}
    >
      <button
        type="button"
        className="absolute inset-0 z-[1] cursor-pointer border-0 bg-transparent p-0"
        onClick={onApply}
        aria-pressed={active}
        aria-label={`Apply ${preset.name} preset`}
      />

      <div className="pe-preset-card__thumb pointer-events-none">
        <img src={preset.thumbnail} alt="" loading="lazy" draggable={false} />
        <div className="pe-preset-card__shade" />
        <span className="pe-preset-card__badge">
          {preset.category === 'bw' ? 'B&W' : preset.category}
        </span>

        {active ? (
          <span className="pe-preset-card__check" aria-hidden>
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        ) : null}

        <AnimatePresence>
          {applying ? (
            <motion.span
              key="flash"
              className="pe-preset-card__flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, times: [0, 0.3, 1] }}
            />
          ) : null}
        </AnimatePresence>
      </div>

      <button
        type="button"
        className="pe-preset-card__fav"
        data-on={favorite}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        <Heart
          className="h-3.5 w-3.5"
          fill={favorite ? 'currentColor' : 'none'}
          strokeWidth={2.25}
        />
      </button>

      <div className="pe-preset-card__body pointer-events-none relative z-[1]">
        <p className="pe-preset-card__name">{preset.name}</p>
        <p className="pe-preset-card__desc">{preset.description}</p>
      </div>
    </motion.div>
  );
}
