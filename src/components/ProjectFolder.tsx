import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { workItems } from '@/lib/content';

/* Rotation + position config per screenshot.
   Mobile uses smaller angles to avoid horizontal overflow. */
const SLOTS_D = [  /* desktop */
  { left: '2%',  rot: -11, hoverRot: -16, z: 1 },
  { left: '20%', rot:  -5, hoverRot:  -7, z: 2 },
  { left: '38%', rot:   0, hoverRot:   0, z: 3 },
  { left: '56%', rot:   5, hoverRot:   7, z: 2 },
  { left: '73%', rot:  11, hoverRot:  16, z: 1 },
];
const SLOTS_M = [  /* mobile */
  { left: '1%',  rot:  -7, hoverRot: -10, z: 1 },
  { left: '20%', rot:  -3, hoverRot:  -5, z: 2 },
  { left: '39%', rot:   0, hoverRot:   0, z: 3 },
  { left: '58%', rot:   3, hoverRot:   5, z: 2 },
  { left: '76%', rot:   7, hoverRot:  10, z: 1 },
];

/* GSAP shred explosion */
async function explodeShreds(el: HTMLElement) {
  const { gsap } = await import('gsap');
  const rect = el.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;

  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:hidden;';
  document.body.appendChild(overlay);

  const srcs = (workItems as any[]).filter(w => w.image).map(w => w.image as string);

  for (let i = 0; i < 70; i++) {
    const d = document.createElement('div');
    const w = 18 + Math.random() * 100;
    const h = 4  + Math.random() * 22;
    const isPhoto = Math.random() > 0.42;

    d.style.cssText = [
      'position:absolute', `width:${w}px`, `height:${h}px`,
      `left:${cx - w / 2}px`, `top:${cy - h / 2}px`,
      'border-radius:2px', 'will-change:transform,opacity',
    ].join(';');

    if (isPhoto && srcs.length) {
      const src = srcs[Math.floor(Math.random() * srcs.length)];
      d.style.backgroundImage   = `url(${src})`;
      d.style.backgroundSize    = 'cover';
      d.style.backgroundPosition = `${Math.random() * 90}% ${Math.random() * 90}%`;
      d.style.border            = '1px solid rgba(255,255,255,0.15)';
    } else {
      d.style.background = `hsl(35,18%,${68 + Math.random() * 26}%)`;
    }

    overlay.appendChild(d);
    gsap.to(d, {
      x:        (Math.random() - 0.5) * window.innerWidth  * 1.8,
      y:        (Math.random() - 0.5) * window.innerHeight * 1.8,
      rotation: Math.random() * 960 - 480,
      scaleX:   0.1 + Math.random() * 0.55,
      opacity:  0,
      duration: 1.2 + Math.random() * 1.1,
      delay:    Math.random() * 0.55,
      ease:     'power2.out',
    });
  }
  setTimeout(() => { if (document.body.contains(overlay)) document.body.removeChild(overlay); }, 3800);
}

/* SVG folder icon */
function FolderSVG({ open }: { open: boolean }) {
  return (
    <svg width="26" height="20" viewBox="0 0 28 22" fill="none" aria-hidden>
      <path d={open
        ? 'M1 5h26v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5z'
        : 'M1 5h26v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5zM1 5V4a2 2 0 012-2h6l2 2h16v1'}
        stroke="rgba(129,140,248,0.65)" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

export default function ProjectFolder() {
  const [hovered, setHovered] = useState(false);
  const [popped,  setPopped]  = useState(false);
  const [flash,   setFlash]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const folderRef = useRef<HTMLDivElement>(null);
  const router    = useRouter();

  /* Detect mobile once on mount */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const SLOTS    = isMobile ? SLOTS_M : SLOTS_D;
  const PEEK_H   = isMobile ? 72  : 128;   /* px visible above folder */
  const BODY_H   = isMobile ? 130 : 210;   /* px folder body height   */
  const IMG_W    = isMobile ? 'clamp(52px,16%,96px)'  : 'clamp(80px,17%,122px)';
  const IMG_H    = isMobile ? 170 : 300;   /* total screenshot height  */
  const POP_Y    = isMobile ? -260 : -380; /* pop distance on click   */

  const items = (workItems as any[]).filter(w => w.image).slice(0, 5);

  const handleClick = () => {
    if (popped) return;
    setPopped(true);
    setHovered(false);

    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) { router.push('/work'); return; }

    if (folderRef.current) explodeShreds(folderRef.current);
    setTimeout(() => setFlash(true), 2400);
    setTimeout(() => router.push('/work'), 3000);
  };

  return (
    <>
      {/* Dark flash before navigate */}
      {flash && (
        <motion.div className="fixed inset-0"
          style={{ backgroundColor: '#030308', zIndex: 9999, pointerEvents: 'none' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeIn' }} />
      )}

      {/* Folder wrapper */}
      <div
        ref={folderRef}
        role="button" tabIndex={0}
        aria-label="Open selected work — folder"
        style={{
          position:    'relative',
          width:       '100%',
          maxWidth:    isMobile ? '100%' : '640px',
          margin:      '0 auto',
          cursor:      popped ? 'default' : 'pointer',
          userSelect:  'none',
          touchAction: 'manipulation',
          overflow:    'visible',   /* screenshots can peek above */
        }}
        onMouseEnter={() => !popped && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
      >
        {/* ── PEEK ZONE ── screenshots anchor bottom=0, grow upward ── */}
        <div style={{
          position: 'relative',
          height:   PEEK_H,
          overflow: 'visible',   /* screenshots extend upward freely */
        }}>
          {items.map((item, i) => {
            const cfg = SLOTS[i] ?? SLOTS[2];
            return (
              <motion.div key={item.slug} aria-hidden
                style={{
                  position:      'absolute',
                  bottom:        0,
                  left:          cfg.left,
                  width:         IMG_W,
                  height:        IMG_H,
                  zIndex:        cfg.z,
                  transformOrigin: 'bottom center',
                  overflow:      'hidden',
                  borderRadius:  '4px 4px 0 0',
                  border:        '1px solid rgba(255,255,255,0.13)',
                  borderBottom:  'none',
                  boxShadow:     '0 -4px 18px rgba(0,0,0,0.40)',
                  willChange:    'transform,opacity',
                }}
                initial={false}
                animate={{
                  rotate:  popped ? cfg.rot * 2.2 : hovered ? cfg.hoverRot : cfg.rot,
                  y:       popped ? POP_Y : hovered ? (isMobile ? -24 : -34) : 0,
                  opacity: popped ? 0 : 1,
                  scale:   popped ? 1.14 : 1,
                }}
                transition={popped
                  ? { type: 'spring', stiffness: 150, damping: 13, delay: i * 0.04 }
                  : { type: 'spring', stiffness: 200, damping: 22 }
                }
              >
                <img src={item.image} alt={item.title} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
              </motion.div>
            );
          })}
        </div>

        {/* ── FOLDER BODY ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Tab */}
          <div style={{
            position:      'absolute',
            top:           -26,
            left:          0,
            width:         isMobile ? 120 : 162,
            height:        26,
            background:    'rgba(129,140,248,0.13)',
            border:        '1px solid rgba(129,140,248,0.22)',
            borderBottom:  'none',
            borderRadius:  '7px 7px 0 0',
            display:       'flex',
            alignItems:    'center',
            paddingLeft:   '0.7rem',
            backdropFilter:'blur(8px)',
          }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.55rem',
              textTransform:'uppercase', letterSpacing:'0.20em',
              color:'rgba(129,140,248,0.85)', whiteSpace:'nowrap' }}>
              Selected Work
            </span>
          </div>

          {/* Glass body */}
          <motion.div
            style={{
              width:           '100%',
              height:          BODY_H,
              background:      'rgba(255,255,255,0.04)',
              backdropFilter:  'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border:          '1px solid rgba(255,255,255,0.09)',
              borderRadius:    '0 10px 10px 10px',
              display:         'flex',
              alignItems:      'flex-end',
              justifyContent:  'space-between',
              padding:         isMobile ? '1rem 1.1rem' : '1.25rem 1.5rem',
              willChange:      'border-color,box-shadow',
            }}
            animate={{
              borderColor: hovered ? 'rgba(129,140,248,0.38)' : 'rgba(255,255,255,0.09)',
              boxShadow:   hovered
                ? '0 24px 60px rgba(0,0,0,0.45), 0 0 36px rgba(129,140,248,0.13)'
                : '0 10px 30px rgba(0,0,0,0.28)',
            }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
          >
            <div>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.55rem',
                textTransform:'uppercase', letterSpacing:'0.20em',
                color:'rgba(255,255,255,0.28)', marginBottom:'0.35rem' }}>
                {items.length} Projects
              </p>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif",
                fontSize: isMobile ? '0.72rem' : '0.80rem',
                color:'rgba(255,255,255,0.52)' }}>
                {hovered ? 'Click to open →' : 'Hover to preview'}
              </p>
            </div>
            <FolderSVG open={hovered} />
          </motion.div>
        </div>
      </div>
    </>
  );
}
