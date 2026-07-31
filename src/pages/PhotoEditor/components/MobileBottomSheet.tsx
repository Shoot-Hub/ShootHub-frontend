import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useDragControls, type PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import '../styles/responsive.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function MobileBottomSheet({ open, onOpenChange, title, subtitle, children }: Props) {
  const controls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 800) {
      onOpenChange(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close panel"
            className="pe-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            ref={sheetRef}
            className="pe-sheet photo-editor-root"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pe-sheet-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.04, bottom: 0.55 }}
            onDragEnd={onDragEnd}
          >
            <div
              className="pe-sheet__handle-wrap"
              onPointerDown={(e) => controls.start(e)}
            >
              <div className="pe-sheet__handle" />
            </div>
            <div className="pe-sheet__header">
              <div className="min-w-0 flex-1">
                <h3 id="pe-sheet-title" className="pe-sheet__title">
                  {title}
                </h3>
                {subtitle ? <p className="pe-sheet__sub">{subtitle}</p> : null}
              </div>
              <button
                type="button"
                className="pe-sheet__close"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="pe-sheet__body pe-scrollbar">{children}</div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
