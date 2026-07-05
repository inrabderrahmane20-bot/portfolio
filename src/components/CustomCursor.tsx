import { useEffect, useRef, useState } from 'react';

/**
 * Drafting-table cursor: full-viewport crosshair hairlines + vermilion dot.
 * Elements with a `data-cursor="LABEL"` attribute show a mono tag beside it.
 * Fine pointers only — CSS hides everything on touch.
 */
export default function CustomCursor() {
  const vRef   = useRef<HTMLDivElement>(null);
  const hRef   = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lblRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const labelRef = useRef<string | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (vRef.current)   vRef.current.style.transform   = `translateX(${x}px)`;
      if (hRef.current)   hRef.current.style.transform   = `translateY(${y}px)`;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      if (lblRef.current) lblRef.current.style.transform = `translate(${x + 18}px, ${y + 18}px)`;

      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      const next = target?.getAttribute('data-cursor') ?? null;
      if (next !== labelRef.current) {
        labelRef.current = next;
        setLabel(next);
      }
    };

    const onLeave = () => {
      [vRef, hRef, dotRef, lblRef].forEach(r => { if (r.current) r.current.style.opacity = '0'; });
    };
    const onEnter = () => {
      [vRef, hRef, dotRef].forEach(r => { if (r.current) r.current.style.opacity = ''; });
      if (lblRef.current) lblRef.current.style.opacity = labelRef.current ? '1' : '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <>
      <div ref={vRef}   className="xh-v"   aria-hidden style={{ transition: 'opacity 0.3s ease' }} />
      <div ref={hRef}   className="xh-h"   aria-hidden style={{ transition: 'opacity 0.3s ease' }} />
      <div ref={dotRef} className="xh-dot" aria-hidden
        style={{ transition: 'opacity 0.3s ease, width 0.25s ease, height 0.25s ease',
          width: label ? 10 : 6, height: label ? 10 : 6 }} />
      <div ref={lblRef} className="xh-label" aria-hidden
        style={{ opacity: label ? 1 : 0, transition: 'opacity 0.22s ease' }}>
        {label}
      </div>
    </>
  );
}
