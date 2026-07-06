import { useEffect, useRef, useState } from 'react';
import { identity } from '@/lib/content';

/**
 * Boot sequence — mono manifest lines + serif counter, then an ink wipe.
 * Full run on first visit per session; skipped afterwards.
 */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const [pct, setPct]       = useState(0);
  const [leaving, setLeave] = useState(false);
  const [gone, setGone]     = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('ac-booted');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = seen || reduced ? 350 : 1900;

    document.documentElement.style.overflow = 'hidden';
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // ease with plateaus so the counter feels mechanical, not linear
      const eased = p < 0.7 ? p * 1.18 : 0.826 + (p - 0.7) * 0.58;
      setPct(Math.min(100, Math.floor(eased * 100)));
      if (p < 1) { raf = requestAnimationFrame(tick); return; }
      if (doneRef.current) return;
      doneRef.current = true;
      sessionStorage.setItem('ac-booted', '1');
      setPct(100);
      setLeave(true);
      setTimeout(() => {
        document.documentElement.style.overflow = '';
        setGone(true);
        onDone?.();
      }, 750);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.documentElement.style.overflow = ''; };
  }, [onDone]);

  if (gone) return null;

  const manifest = [
    ['FILE', 'PORTFOLIO — ÉDITION 2026'],
    ['SUBJ', identity.name.toUpperCase()],
    ['ROLE', identity.role.toUpperCase()],
    ['GEO ', identity.coords],
  ];

  return (
    <div className="preloader" aria-hidden
      style={{
        transform: leaving ? 'translateY(-101%)' : 'translateY(0)',
        transition: 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)',
      }}>
      {/* Manifest */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', position: 'relative' }}>
        {manifest.map(([k, v], i) => (
          <p key={k} className="font-mono"
            style={{
              fontSize: '0.62rem', letterSpacing: '0.26em',
              color: 'rgba(238,241,255,0.55)',
              opacity: pct > i * 12 ? 1 : 0.12,
              transition: 'opacity 0.3s ease',
            }}>
            <span style={{ color: '#38BDF8' }}>{k}</span>
            {'  //  '}{v}
          </p>
        ))}
      </div>

      {/* Counter */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', position: 'relative' }}>
        <p className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.3em', color: 'rgba(238,241,255,0.4)' }}>
          LOADING&nbsp;ASSETS
        </p>
        <span className="font-serif"
          style={{
            fontSize: 'clamp(5rem, 18vw, 13rem)', lineHeight: 0.8,
            fontWeight: 800, fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.04em',
          }}>
          {pct}
          <span className="text-gradient" style={{ fontSize: '0.22em' }}>%</span>
        </span>
      </div>
    </div>
  );
}
