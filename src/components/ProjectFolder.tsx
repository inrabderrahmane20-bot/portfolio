import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { workItems } from '@/lib/content';

/* ─── Per-screenshot layout config ───────────────────────────────────── */
const SLOTS = [
  { left: '2%',  rot: -11, zBase: 1, hoverRot: -16 },
  { left: '20%', rot:  -5, zBase: 2, hoverRot:  -7 },
  { left: '38%', rot:   0, zBase: 3, hoverRot:   0 },
  { left: '56%', rot:   5, zBase: 2, hoverRot:   7 },
  { left: '73%', rot:  11, zBase: 1, hoverRot:  16 },
];

/* ─── GSAP shred explosion (client-side only) ────────────────────────── */
async function explodeShreds(folderEl: HTMLElement) {
  const { gsap } = await import('gsap');
  const rect = folderEl.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;

  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:hidden;';
  document.body.appendChild(overlay);

  const srcs = (workItems as any[])
    .filter(w => w.image)
    .map(w => w.image as string);

  for (let i = 0; i < 72; i++) {
    const el = document.createElement('div');
    const w  = 22 + Math.random() * 115;
    const h  = 5  + Math.random() * 26;
    const isPhoto = Math.random() > 0.40;

    el.style.cssText = [
      'position:absolute',
      `width:${w}px`,
      `height:${h}px`,
      `left:${cx - w / 2}px`,
      `top:${cy - h / 2}px`,
      'border-radius:2px',
      'will-change:transform,opacity',
    ].join(';');

    if (isPhoto) {
      const src = srcs[Math.floor(Math.random() * srcs.length)];
      el.style.backgroundImage   = `url(${src})`;
      el.style.backgroundSize    = 'cover';
      el.style.backgroundPosition = `${Math.random() * 90}% ${Math.random() * 90}%`;
      el.style.border            = '1px solid rgba(255,255,255,0.18)';
    } else {
      const l = 68 + Math.random() * 26;
      el.style.background = `hsl(35,18%,${l}%)`;
    }

    overlay.appendChild(el);

    gsap.to(el, {
      x:        (Math.random() - 0.5) * window.innerWidth  * 1.7,
      y:        (Math.random() - 0.5) * window.innerHeight * 1.7,
      rotation: Math.random() * 980 - 490,
      scaleX:   0.15 + Math.random() * 0.6,
      opacity:  0,
      duration: 1.3 + Math.random() * 1.1,
      delay:    Math.random() * 0.55,
      ease:     'power2.out',
    });
  }

  setTimeout(() => {
    if (document.body.contains(overlay)) document.body.removeChild(overlay);
  }, 3600);
}

/* ─── Folder SVG icon ────────────────────────────────────────────────── */
function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden>
      <path
        d={open
          ? 'M1 5h26v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5z'
          : 'M1 5h26v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5zM1 5V4a2 2 0 012-2h6l2 2h15v1'}
        stroke="rgba(129,140,248,0.65)"
        strokeWidth="1.4"
        fill="none"
      />
    </svg>
  );
}

/* ─── Component ──────────────────────────────────────────────────────── */
export default function ProjectFolder() {
  const [hovered, setHovered]  = useState(false);
  const [popped,  setPopped]   = useState(false);
  const [flash,   setFlash]    = useState(false);
  const folderRef = useRef<HTMLDivElement>(null);
  const router    = useRouter();

  const items = (workItems as any[]).filter(w => w.image).slice(0, 5);

  const handleClick = () => {
    if (popped) return;
    setPopped(true);
    setHovered(false);

    /* Respect prefers-reduced-motion */
    const reduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      router.push('/work');
      return;
    }

    if (folderRef.current) explodeShreds(folderRef.current);

    /* Fade-to-dark overlay then navigate */
    setTimeout(() => setFlash(true), 2400);
    setTimeout(() => router.push('/work'), 3000);
  };

  return (
    <>
      {/* ── Full-screen dark flash before navigate ── */}
      {flash && (
        <motion.div
          className="fixed inset-0"
          style={{ backgroundColor: '#030308', zIndex: 9999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeIn' }}
        />
      )}

      {/* ── Folder wrapper ── */}
      <div
        ref={folderRef}
        role="button"
        tabIndex={0}
        aria-label="Open selected work"
        style={{
          position:    'relative',
          width:       '100%',
          maxWidth:    'clamp(320px, 85vw, 640px)',
          margin:      '0 auto',
          cursor:      popped ? 'default' : 'pointer',
          userSelect:  'none',
          touchAction: 'manipulation',
        }}
        onMouseEnter={() => !popped && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
      >
        {/* ── PEEK ZONE: screenshots above the folder ── */}
        <div style={{ position: 'relative', height: 'clamp(80px, 14vw, 130px)' }}>
          {items.map((item, i) => {
            const cfg = SLOTS[i] ?? SLOTS[2];
            return (
              <motion.div
                key={item.slug}
                aria-hidden
                style={{
                  position:      'absolute',
                  bottom:        0,
                  left:          cfg.left,
                  width:         'clamp(72px, 17%, 122px)',
                  height:        'clamp(170px, 32vw, 310px)',
                  zIndex:        cfg.zBase,
                  transformOrigin: 'bottom center',
                  overflow:      'hidden',
                  borderRadius:  '5px 5px 0 0',
                  border:        '1px solid rgba(255,255,255,0.14)',
                  borderBottom:  'none',
                  boxShadow:     '0 -6px 24px rgba(0,0,0,0.45)',
                  willChange:    'transform,opacity',
                }}
                initial={false}
                animate={{
                  rotate:  popped ? cfg.rot * 2.2 : hovered ? cfg.hoverRot : cfg.rot,
                  y:       popped ? -340 : hovered ? -34 : 0,
                  opacity: popped ? 0 : 1,
                  scale:   popped ? 1.18 : 1,
                }}
                transition={
                  popped
                    ? { type: 'spring', stiffness: 160, damping: 14, delay: i * 0.045 }
                    : { type: 'spring', stiffness: 220, damping: 22 }
                }
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  loading="lazy"
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── FOLDER BODY ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Tab */}
          <div
            style={{
              position:       'absolute',
              top:            'clamp(-26px, -4vw, -28px)',
              left:            0,
              width:           'clamp(130px, 24vw, 170px)',
              height:         'clamp(24px, 4vw, 28px)',
              background:      'rgba(129,140,248,0.13)',
              border:          '1px solid rgba(129,140,248,0.22)',
              borderBottom:    'none',
              borderRadius:    '7px 7px 0 0',
              display:         'flex',
              alignItems:      'center',
              paddingLeft:     '0.75rem',
              backdropFilter:  'blur(8px)',
            }}
          >
            <span
              style={{
                fontFamily:    "'JetBrains Mono', monospace",
                fontSize:      'clamp(0.52rem, 1.1vw, 0.60rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color:         'rgba(129,140,248,0.85)',
                whiteSpace:    'nowrap',
              }}
            >
              Selected Work
            </span>
          </div>

          {/* Glass body */}
          <motion.div
            style={{
              width:            '100%',
              height:           'clamp(140px, 22vw, 210px)',
              background:       'rgba(255,255,255,0.04)',
              backdropFilter:   'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border:           '1px solid rgba(255,255,255,0.09)',
              borderRadius:     '0 10px 10px 10px',
              display:          'flex',
              alignItems:       'flex-end',
              justifyContent:   'space-between',
              padding:          'clamp(0.9rem, 2vw, 1.4rem) clamp(1rem, 2.5vw, 1.6rem)',
              willChange:       'border-color,box-shadow',
            }}
            animate={{
              borderColor: hovered
                ? 'rgba(129,140,248,0.38)'
                : 'rgba(255,255,255,0.09)',
              boxShadow:   hovered
                ? '0 24px 64px rgba(0,0,0,0.45), 0 0 40px rgba(129,140,248,0.14)'
                : '0 10px 32px rgba(0,0,0,0.28)',
            }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {/* Left info */}
            <div>
              <p
                style={{
                  fontFamily:    "'JetBrains Mono', monospace",
                  fontSize:      'clamp(0.52rem, 1.1vw, 0.60rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.20em',
                  color:         'rgba(255,255,255,0.28)',
                  marginBottom:  '0.4rem',
                }}
              >
                {items.length} Projects
              </p>
              <motion.p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize:   'clamp(0.68rem, 1.4vw, 0.80rem)',
                  color:      'rgba(255,255,255,0.50)',
                }}
                animate={{ opacity: popped ? 0 : 1 }}
              >
                {hovered ? 'Click to open the folder →' : 'Hover to preview'}
              </motion.p>
            </div>

            {/* Right icon */}
            <FolderIcon open={hovered} />
          </motion.div>
        </div>
      </div>
    </>
  );
}
