import { motion } from 'framer-motion';
import { Check, Images } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PremiumTemplate } from '../../data';

type Props = {
  template: PremiumTemplate;
  active?: boolean;
  onSelect: () => void;
};

export function TemplateCard({ template, active, onSelect }: Props) {
  return (
    <motion.button
      type="button"
      layout
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-[16px] border-2 text-left transition-shadow',
        active
          ? 'border-[var(--ad-primary)] shadow-[0_8px_24px_-8px_var(--ad-primary-glow)]'
          : 'border-[var(--ad-border-soft)] hover:border-[#C9B8FF] hover:shadow-[var(--ad-shadow-soft)]',
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden" style={{ background: template.previewGradient }}>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>
        <div className="flex h-full flex-col justify-end gap-1.5 p-2.5">
          <div className="h-11 rounded-[10px]" style={{ background: `${template.accent}55` }} />
          <div className="h-1.5 w-3/4 rounded-full" style={{ background: template.textColor, opacity: 0.4 }} />
          <div className="h-1 w-1/2 rounded-full" style={{ background: template.textColor, opacity: 0.25 }} />
        </div>
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-[var(--ad-ink)] shadow-sm backdrop-blur">
          <Images className="h-2.5 w-2.5 text-[var(--ad-primary)]" />
          {template.imageSlots}
        </div>
        <div className="absolute bottom-2 right-2 rounded-full bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur">
          {template.aspectRatio}
        </div>
      </div>
      <div className="border-t border-[var(--ad-border-soft)] bg-white px-2.5 py-2">
        <p className="truncate text-[11px] font-bold text-[var(--ad-ink)]">{template.name}</p>
        <p className="truncate text-[10px] font-medium text-[var(--ad-ink-muted)]">{template.style}</p>
      </div>
      {active ? (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--ad-primary)] text-white shadow">
          <Check className="h-3 w-3" />
        </span>
      ) : null}
    </motion.button>
  );
}
