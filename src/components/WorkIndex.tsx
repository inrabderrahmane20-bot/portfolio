import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { workItems } from '@/lib/content';
import { useLanguage } from '@/contexts/LanguageContext';

type Item = (typeof workItems)[number];

/**
 * Editorial project ledger. Desktop: hovering a row summons a floating
 * preview plate that lerps after the cursor and shears with velocity.
 * Touch: rows carry an inline plate instead.
 */
export default function WorkIndex({ items = workItems }: { items?: Item[] }) {
  const { t } = useLanguage();
  const wrapRef    = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;

  /* Floating preview physics — position lerp + velocity shear */
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const wrap = wrapRef.current, prev = previewRef.current;
    if (!wrap || !prev) return;

    const pos = { x: 0, y: 0, tx: 0, ty: 0, vx: 0 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      pos.tx = e.clientX - r.left;
      pos.ty = e.clientY - r.top;
    };

    const loop = () => {
      const nx = pos.x + (pos.tx - pos.x) * 0.11;
      pos.vx = nx - pos.x;
      pos.x = nx;
      pos.y = pos.y + (pos.ty - pos.y) * 0.11;
      const shear = Math.max(-9, Math.min(9, pos.vx * 0.55));
      const on = activeRef.current !== null;
      prev.style.transform =
        `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) rotate(${shear}deg) scale(${on ? 1 : 0.72})`;
      prev.style.opacity = on ? '1' : '0';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    wrap.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}
      onMouseLeave={() => setActive(null)}>

      {/* Ledger rows */}
      <div className="reveal-group" style={{ borderTop: '1px solid var(--line)' }}>
        {items.map((item, i) => (
          <Link key={item.slug} href={`/work/${item.slug}`} data-cursor={t('ui.open')}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className="idx-row reveal-item group grid-cols-1 md:grid-cols-[minmax(3rem,6rem)_1fr_minmax(0,20rem)_minmax(3.5rem,5rem)] items-center gap-x-6"
            style={{ padding: 'clamp(1.4rem, 3vw, 2.4rem) clamp(0.25rem, 1vw, 1rem)' }}>

            {/* № */}
            <span className="idx-num font-mono hidden md:block"
              style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--mut)', transition: 'color 0.35s ease' }}>
              {String(i + 1).padStart(3, '0')}
            </span>

            {/* Title */}
            <span className="font-serif"
              style={{ fontSize: 'clamp(1.7rem, 4.6vw, 4.2rem)', fontWeight: 420,
                lineHeight: 1.02, letterSpacing: '-0.02em' }}>
              {t(item.titleKey)}
            </span>

            {/* Meta */}
            <span className="idx-mut hidden md:flex flex-col gap-1"
              style={{ transition: 'color 0.35s ease, opacity 0.35s ease' }}>
              <span className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase' }}>
                {t(item.categoryKey)}
              </span>
              <span className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.12em', opacity: 0.65 }}>
                {item.stack.join(' · ')}
              </span>
            </span>

            {/* Year */}
            <span className="idx-mut font-mono md:text-right"
              style={{ fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--mut)',
                transition: 'color 0.35s ease', marginTop: '0.4rem' }}>
              {item.year}
            </span>

            {/* Inline plate — touch layouts only */}
            <span className="block md:hidden mt-4 overflow-hidden" style={{ border: '1px solid var(--line)' }}>
              <img src={item.image} alt="" loading="lazy"
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'top' }} />
            </span>
          </Link>
        ))}
      </div>

      {/* Floating preview plate — desktop */}
      <div ref={previewRef} aria-hidden className="hidden md:block"
        style={{
          position: 'absolute', top: 0, left: 0, zIndex: 5,
          width: 'clamp(300px, 26vw, 420px)', pointerEvents: 'none',
          opacity: 0, willChange: 'transform',
          transition: 'opacity 0.3s ease',
        }}>
        <div style={{ position: 'relative', background: 'var(--ink)', padding: 10,
          boxShadow: '0 30px 80px rgba(23,19,16,0.35)' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
            {items.map((item, i) => (
              <img key={item.slug} src={item.image} alt=""
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'top',
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? 'scale(1)' : 'scale(1.08)',
                  transition: 'opacity 0.25s ease, transform 0.6s cubic-bezier(0.19,1,0.22,1)',
                }} />
            ))}
          </div>
          <span className="font-mono"
            style={{
              position: 'absolute', top: -1, right: -1, zIndex: 2,
              background: 'var(--verm)', color: '#FFF7F2',
              fontSize: '0.56rem', letterSpacing: '0.26em', padding: '0.45rem 0.8rem',
            }}>
            {active !== null ? String(active + 1).padStart(3, '0') : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
