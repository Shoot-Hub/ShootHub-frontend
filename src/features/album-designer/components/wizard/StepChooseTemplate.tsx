import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWizardStore } from '../../store';
import { TEMPLATE_CATEGORIES, searchTemplates, type TemplateCategoryId } from '../../data';
import { cn } from '@/lib/utils';

export function StepChooseTemplate() {
  const { templateId, setTemplate } = useWizardStore();
  const [category, setCategory] = useState<TemplateCategoryId | 'all'>('wedding');
  const templates = useMemo(() => searchTemplates('', category, 24), [category]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0A0A0B]">Choose Template</h2>
        <p className="text-sm text-[#8B93A1]">
          100+ premium layouts per category — refine everything in the editor.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {TEMPLATE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition',
              category === c.id
                ? 'bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/25'
                : 'bg-[#F3F4F7] text-[#5B6472] hover:bg-[#F3EEFF]',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {templates.map((t) => {
          const active = templateId === t.baseTemplateId;
          return (
            <motion.button
              key={t.id}
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => setTemplate(t.baseTemplateId)}
              className={cn(
                'group relative overflow-hidden rounded-[20px] border-2 text-left transition-all',
                active
                  ? 'border-[#6B46FE] shadow-md shadow-[#6B46FE]/15'
                  : 'border-[#EEF0F4] hover:border-[#6B46FE]/40',
              )}
            >
              <div className="aspect-[3/4]" style={{ background: t.previewGradient }}>
                <div className="flex h-full flex-col justify-end gap-1.5 p-3">
                  <div className="h-14 rounded-[10px]" style={{ background: `${t.accent}44` }} />
                  <div className="h-1.5 w-2/3 rounded-full" style={{ background: t.textColor, opacity: 0.45 }} />
                </div>
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold">
                  {t.imageSlots} imgs · {t.aspectRatio}
                </span>
              </div>
              <div className="border-t border-[#EEF0F4] bg-white p-3">
                <p className="truncate text-sm font-bold text-[#0A0A0B]">{t.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-[#8B93A1]">{t.style}</p>
              </div>
              {active ? (
                <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#6B46FE] text-white shadow">
                  <Check className="h-4 w-4" />
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
