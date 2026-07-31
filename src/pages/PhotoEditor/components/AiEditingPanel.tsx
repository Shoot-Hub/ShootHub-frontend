import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles,
  Smile,
  ImageOff,
  Eraser,
  CloudSun,
  UserRound,
  Heart,
  ScanFace,
  Loader2,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AI_TOOLS, getAiTool, isAiToolId } from '../data';
import type { AiToolId } from '../types';
import { usePhotoEditorStore } from '../store';
import { EmptyState } from './ui';
import '../styles/ai.css';

const ICONS: Record<AiToolId, typeof Sparkles> = {
  'ai-enhance': Sparkles,
  'skin-retouch': Smile,
  'remove-bg': ImageOff,
  'remove-object': Eraser,
  'sky-replace': CloudSun,
  'portrait-enhance': UserRound,
  beauty: Heart,
  'face-detect': ScanFace,
};

export function AiEditingPanel() {
  const photo = usePhotoEditorStore((s) => s.getActivePhoto());
  const activeTool = usePhotoEditorStore((s) => s.activeTool);
  const aiJob = usePhotoEditorStore((s) => s.aiJob);
  const aiResult = usePhotoEditorStore((s) => s.aiResult);
  const runAiTool = usePhotoEditorStore((s) => s.runAiTool);
  const cancelAiTool = usePhotoEditorStore((s) => s.cancelAiTool);
  const applyAiResult = usePhotoEditorStore((s) => s.applyAiResult);
  const discardAiResult = usePhotoEditorStore((s) => s.discardAiResult);
  const setActiveTool = usePhotoEditorStore((s) => s.setActiveTool);

  const running = aiJob?.status === 'running';
  const selectedId = isAiToolId(activeTool) ? activeTool : null;
  const resultTool = aiResult ? getAiTool(aiResult.toolId) : null;

  if (!photo) {
    return (
      <EmptyState
        icon={<Sparkles className="h-5 w-5" />}
        title="No photo selected"
        description="Select a photo to run AI editing tools."
        className="m-3"
      />
    );
  }

  const onRun = async (id: AiToolId) => {
    setActiveTool(id);
    await runAiTool(id);
  };

  return (
    <div className="pe-ai">
      <div className="pe-ai__scroll pe-scrollbar">
        <div className="pe-ai__intro">
          <p className="pe-ai__intro-title">AI Studio</p>
          <p className="pe-ai__intro-sub">
            Frontend mock tools with realistic processing — no API required. Run a
            tool, preview the result, then apply or discard.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {running && aiJob ? (
            <motion.div
              key="job"
              className="pe-ai__job"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <div className="pe-ai__job-head">
                <p className="pe-ai__job-title">
                  {getAiTool(aiJob.toolId)?.name ?? 'AI Tool'}
                </p>
                <Loader2 className="h-4 w-4 animate-spin text-[var(--pe-primary)]" />
              </div>
              <p className="pe-ai__job-stage">{aiJob.stage}</p>
              <div
                className="pe-ai__bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={aiJob.progress}
              >
                <div
                  className="pe-ai__bar-fill"
                  style={{ width: `${aiJob.progress}%` }}
                />
              </div>
              <div className="pe-ai__job-meta">
                <span>
                  Stage {aiJob.stageIndex + 1}/{aiJob.stageCount}
                </span>
                <span>{aiJob.progress}%</span>
              </div>
              <button
                type="button"
                className="pe-ai__btn pe-ai__cancel"
                onClick={cancelAiTool}
              >
                Cancel
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {aiResult && resultTool && !running ? (
            <motion.div
              key="preview"
              className="pe-ai__preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="pe-ai__preview-head">
                <p className="pe-ai__preview-title">
                  {aiResult.applied ? 'Applied' : 'Mock preview'} · {resultTool.name}
                </p>
                {aiResult.applied ? (
                  <Check className="h-4 w-4 text-[var(--pe-primary)]" />
                ) : null}
              </div>

              <div
                className="pe-ai__preview-frame"
                data-mode={aiResult.previewMode}
              >
                <div className="pe-ai__compare">
                  <span className="pe-ai__pill">After</span>
                </div>
                <img src={photo.thumb || photo.src} alt="" draggable={false} />

                {aiResult.previewMode === 'sky' ? <div className="pe-ai__sky" /> : null}

                {aiResult.previewMode === 'object' ? (
                  <div
                    className="pe-ai__object-mark"
                    style={{ left: '58%', top: '28%', width: '22%', height: '18%' }}
                  />
                ) : null}

                {aiResult.previewMode === 'faces'
                  ? aiResult.faceBoxes.map((box) => (
                      <div
                        key={box.id}
                        className="pe-ai__face"
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.w}%`,
                          height: `${box.h}%`,
                        }}
                      >
                        <span className="pe-ai__face-label">
                          {box.label} · {Math.round(box.confidence * 100)}%
                        </span>
                      </div>
                    ))
                  : null}
              </div>

              <div className="pe-ai__actions">
                <button
                  type="button"
                  className="pe-ai__btn"
                  onClick={() => {
                    discardAiResult();
                    toast('Preview discarded');
                  }}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="pe-ai__btn"
                  data-primary="true"
                  disabled={aiResult.applied}
                  onClick={() => {
                    applyAiResult();
                    toast.success(
                      aiResult.toolId === 'face-detect'
                        ? 'Faces labeled'
                        : `${resultTool.name} applied`,
                    );
                  }}
                >
                  {aiResult.toolId === 'face-detect' ? 'Keep labels' : 'Apply result'}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="pe-ai__grid">
          {AI_TOOLS.map((tool, i) => {
            const Icon = ICONS[tool.id];
            const isRunningThis = running && aiJob?.toolId === tool.id;
            const isActive = selectedId === tool.id;
            return (
              <AiToolButton
                key={tool.id}
                icon={<Icon className="h-4 w-4" />}
                name={tool.name}
                description={tool.description}
                badge={tool.badge}
                active={isActive}
                running={isRunningThis}
                disabled={running}
                delay={i * 0.03}
                onClick={() => void onRun(tool.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AiToolButton({
  icon,
  name,
  description,
  badge,
  active,
  running,
  disabled,
  delay,
  onClick,
}: {
  icon: ReactNode;
  name: string;
  description: string;
  badge?: string;
  active: boolean;
  running: boolean;
  disabled: boolean;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      className="pe-ai-tool"
      data-active={active}
      data-running={running}
      disabled={disabled}
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
    >
      <span className="pe-ai-tool__shine" aria-hidden />
      <span className="pe-ai-tool__icon">{icon}</span>
      <span className="pe-ai-tool__body">
        <span className="pe-ai-tool__name">
          {name}
          {badge ? <span className="pe-ai-tool__badge">{badge}</span> : null}
        </span>
        <span className="pe-ai-tool__desc">{description}</span>
      </span>
      {running ? (
        <Loader2 className="pe-ai-tool__status animate-spin" />
      ) : active && !disabled ? (
        <Sparkles className="pe-ai-tool__status h-4 w-4" />
      ) : null}
    </motion.button>
  );
}
