import { Check } from 'lucide-react';
import { ALBUM_TEMPLATES } from '../../constants';
import { useWizardStore } from '../../store';
import { cn } from '@/lib/utils';

export function StepChooseTemplate() {
  const { templateId, setTemplate } = useWizardStore();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#2D3436]">Choose Template</h2>
        <p className="text-sm text-[#A0A4B0]">
          Pick a style — you can refine every page in the editor.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ALBUM_TEMPLATES.map((t) => {
          const active = templateId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border-2 text-left transition-all',
                active
                  ? 'border-[#6B46FE] shadow-md shadow-[#6B46FE]/15'
                  : 'border-[#EEF0F4] hover:border-[#6B46FE]/40',
              )}
            >
              <div
                className="aspect-[3/4] transition-transform group-hover:scale-[1.02]"
                style={{ background: t.previewGradient }}
              >
                <div className="flex h-full flex-col justify-end p-3">
                  <div
                    className="mb-2 h-16 rounded-md opacity-80"
                    style={{ background: `${t.accent}33` }}
                  />
                  <div
                    className="h-2 w-2/3 rounded"
                    style={{ background: t.textColor, opacity: 0.5 }}
                  />
                </div>
              </div>
              <div className="border-t border-[#EEF0F4] bg-white p-3">
                <p className="text-sm font-bold text-[#2D3436]">{t.name}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-[#A0A4B0]">
                  {t.description}
                </p>
              </div>
              {active && (
                <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#6B46FE] text-white shadow">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
