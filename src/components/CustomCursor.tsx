import { useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

type CursorMode = 'default' | 'pointer' | 'text' | 'hidden';

/**
 * ShootHub camera cursor — clear camera icon, spins, shutter on click.
 * Desktop / fine-pointer only.
 */
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!fine.matches || reduceMotion.matches) return;

    const root = rootRef.current;
    const flash = flashRef.current;
    if (!root || !flash) return;

    document.documentElement.classList.add('camera-cursor');

    let raf = 0;
    let visible = false;
    let pressed = false;
    let mode: CursorMode = 'default';

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };

    const INTERACTIVE =
      'a, button, [role="button"], [role="link"], summary, label[for], [data-cursor="pointer"], .cursor-pointer';
    const TEXT =
      'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="color"]):not([type="range"]), textarea, [contenteditable="true"], [contenteditable=""], .cursor-text';
    const HIDE =
      'iframe, video, canvas, [data-cursor="native"], [data-cursor="none"]';

    const resolveMode = (el: Element | null): CursorMode => {
      if (!el) return 'default';
      if (el.closest(HIDE)) return 'hidden';
      if (el.closest(TEXT)) return 'text';
      if (el.closest(INTERACTIVE)) return 'pointer';
      return 'default';
    };

    const applyMode = (next: CursorMode) => {
      if (mode === next) return;
      mode = next;
      root.dataset.mode = next;
      if (next === 'text' || next === 'hidden') {
        document.documentElement.classList.add('camera-cursor-native');
      } else {
        document.documentElement.classList.remove('camera-cursor-native');
      }
    };

    const setVisible = (v: boolean) => {
      visible = v;
      root.style.opacity = v ? '1' : '0';
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) setVisible(true);
      applyMode(resolveMode(e.target as Element | null));
    };

    const onDown = (e: MouseEvent) => {
      if (mode === 'text' || mode === 'hidden') return;
      pressed = true;
      root.dataset.pressed = 'true';
      flash.classList.remove('cursor-shutter-flash');
      void flash.offsetWidth;
      flash.classList.add('cursor-shutter-flash');
      applyMode(resolveMode(e.target as Element | null));
    };

    const onUp = () => {
      pressed = false;
      root.dataset.pressed = 'false';
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const tick = () => {
      const lerp = pressed ? 0.55 : mode === 'pointer' ? 0.4 : 0.32;
      pos.x += (mouse.x - pos.x) * lerp;
      pos.y += (mouse.y - pos.y) * lerp;
      root.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    const onScroll = () => {
      applyMode(resolveMode(document.elementFromPoint(mouse.x, mouse.y)));
    };
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('camera-cursor', 'camera-cursor-native');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="shoothub-cursor pointer-events-none fixed left-0 top-0 z-[99999]"
      data-mode="default"
      data-pressed="false"
      style={{ opacity: 0, transform: 'translate3d(-100px, -100px, 0)' }}
    >
      <div className="cursor-glow" />

      <div className="cursor-ring">
        <span className="cursor-ring-dash" />
      </div>

      {/* Camera icon badge */}
      <div className="cursor-badge">
        <Camera className="cursor-camera-icon" strokeWidth={2.5} absoluteStrokeWidth />
      </div>

      <div ref={flashRef} className="cursor-flash" />
    </div>
  );
}
