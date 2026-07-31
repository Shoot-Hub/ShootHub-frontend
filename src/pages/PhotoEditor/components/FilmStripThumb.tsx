import { forwardRef, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { Check } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PhotoItem } from '../types';

type Props = {
  photo: PhotoItem;
  index: number;
  size: number;
  left: number;
  active: boolean;
  selected: boolean;
  onActivate: (e: MouseEvent) => void;
  onToggleSelect: (e: MouseEvent) => void;
  onContextMenu: (e: MouseEvent) => void;
};

export const FilmStripThumb = forwardRef<HTMLDivElement, Props>(function FilmStripThumb(
  { photo, index, size, left, active, selected, onActivate, onToggleSelect, onContextMenu },
  _ref,
) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });
  const elRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.style.setProperty('--pe-thumb-size', `${size}px`);
  }, [size]);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const root = el.closest('.pe-filmstrip-scroller');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { root: root instanceof Element ? root : null, rootMargin: '160px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = {
    left,
    transform: CSS.Transform.toString(transform) || undefined,
    transition,
  };

  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    elRef.current = node;
    if (typeof _ref === 'function') _ref(node);
    else if (_ref) _ref.current = node;
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className="pe-film-thumb"
      data-active={active ? '1' : '0'}
      data-selected={selected ? '1' : '0'}
      data-dragging={isDragging ? '1' : '0'}
      onContextMenu={onContextMenu}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label={`${photo.name}${selected ? ', selected' : ''}`}
        aria-pressed={active}
        onClick={onActivate}
      >
        {!loaded ? <span className="pe-film-thumb-skeleton" /> : null}
        {inView ? (
          <img
            src={photo.thumb}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="pe-film-thumb-img"
            data-loaded={loaded ? '1' : '0'}
            onLoad={() => setLoaded(true)}
          />
        ) : null}
      </button>

      <button
        type="button"
        className="pe-film-check"
        data-on={selected ? '1' : '0'}
        aria-label={selected ? 'Deselect photo' : 'Select photo'}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(e);
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Check className="h-3 w-3" />
      </button>

      <span className="pe-film-index">{index + 1}</span>
    </div>
  );
});
