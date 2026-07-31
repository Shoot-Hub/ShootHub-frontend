import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { AI_TOOLS } from '../../data';
import { useUiStore } from '../../store';
import { cn } from '@/lib/utils';

export function AiStudioPanel() {
  const runAiTool = useUiStore((s) => s.runAiTool);
  const aiStatuses = useUiStore((s) => s.aiStatuses);
  const aiProgress = useUiStore((s) => s.aiProgress);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-[var(--ve-border)] px-3 py-3">
        <h2 className="text-[13px] font-bold text-[var(--ve-ink)]">AI Studio</h2>
        <p className="mt-0.5 text-[11px] text-[var(--ve-ink-soft)]">
          Wedding-first AI tools for filmmakers
        </p>
      </div>
      <div className="ve-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {AI_TOOLS.map((tool, i) => {
          const status = aiStatuses[tool.id] ?? 'idle';
          const progress = aiProgress[tool.id] ?? 0;
          const processing = status === 'processing';
          const done = status === 'done';

          return (
            <motion.button
              key={tool.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: processing ? 1 : 1.015 }}
              whileTap={{ scale: processing ? 1 : 0.985 }}
              disabled={processing}
              onClick={() => runAiTool(tool.id)}
              className={cn(
                'relative w-full overflow-hidden rounded-[var(--ve-radius-md)] border p-3 text-left transition-colors',
                done
                  ? 'border-[var(--ve-success)]/40 bg-[var(--ve-success)]/10'
                  : processing
                    ? 'border-[var(--ve-primary)]/40 bg-[var(--ve-primary-soft)]'
                    : 'border-[var(--ve-border)] bg-[var(--ve-card)] hover:border-[var(--ve-primary)]/35',
              )}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]',
                    done
                      ? 'bg-[var(--ve-success)] text-white'
                      : 'bg-gradient-to-br from-[var(--ve-primary)] to-[var(--ve-accent)] text-white',
                  )}
                >
                  {done ? (
                    <Check className="h-4 w-4" />
                  ) : processing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <tool.icon className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[12px] font-bold text-[var(--ve-ink)]">
                      {tool.title}
                    </p>
                    {tool.badge ? <span className="ve-badge-new">{tool.badge}</span> : null}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-snug text-[var(--ve-ink-soft)]">
                    {tool.description}
                  </p>
                  {processing ? (
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--ve-track)]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--ve-primary)] to-[var(--ve-accent)]"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
