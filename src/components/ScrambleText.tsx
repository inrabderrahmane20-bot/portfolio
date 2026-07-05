import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/\\*+·—';

/**
 * Mono label that decodes into place — scrambles once when it enters
 * the viewport, and again on hover if `rescramble` is set.
 */
export default function ScrambleText({
  text,
  className,
  rescramble = false,
  speed = 28,
}: {
  text: string;
  className?: string;
  rescramble?: boolean;
  speed?: number;
}) {
  const [display, setDisplay] = useState(text);
  const ref     = useRef<HTMLSpanElement>(null);
  const rafRef  = useRef(0);
  const played  = useRef(false);

  const run = () => {
    cancelAnimationFrame(rafRef.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    const start = performance.now();
    const total = text.length * speed;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      const settled = Math.floor(p * text.length);
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i++) {
        out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true;
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={rescramble ? run : undefined}
      aria-label={text}
    >
      {display}
    </span>
  );
}
