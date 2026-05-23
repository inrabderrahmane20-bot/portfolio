import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { workItems } from '@/lib/content';

/*
 * 3 landscape "document" cards peek out from the top of the folder —
 * wide and short, like the reference image.  No tall portrait strips.
 */
const CARDS_D = [   /* desktop  */
  { itemIdx: 0, xPct: '2%',  rot: -7,  hoverRot: -12, z: 1 },
  { itemIdx: 2, xPct: '11%', rot:  0,  hoverRot:   0, z: 3 },
  { itemIdx: 4, xPct: '20%', rot:  7,  hoverRot:  12, z: 2 },
];
const CARDS_M = [   /* mobile   */
  { itemIdx: 0, xPct: '2%',  rot: -5,  hoverRot:  -9, z: 1 },
  { itemIdx: 2, xPct: '10%', rot:  0,  hoverRot:   0, z: 3 },
  { itemIdx: 4, xPct: '19%', rot:  5,  hoverRot:   9, z: 2 },
];

/* ── GSAP shred explosion ─────────────────────────────────────────── */
async function explodeShreds(el: HTMLElement) {
  const { gsap } = await import('gsap');
  const r   = el.getBoundingClientRect();
  const cx  = r.left + r.width  / 2;
  const cy  = r.top  + r.height / 2;

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:hidden;';
  document.body.appendChild(overlay);

  const srcs = (workItems as any[]).filter(w => w.image).map(w => w.image as string);

  for (let i = 0; i < 72; i++) {
    const d = document.createElement('div');
    const w = 18 + Math.random() * 110;
    const h = 4  + Math.random() * 24;
    const isPhoto = Math.random() > 0.40 && srcs.length > 0;

    d.style.cssText = [
      'position:absolute', `width:${w}px`, `height:${h}px`,
      `left:${cx - w / 2}px`, `top:${cy - h / 2}px`,
      'border-radius:2px', 'will-change:transform,opacity',
    ].join(';');

    if (isPhoto) {
      d.style.backgroundImage    = `url(${srcs[Math.floor(Math.random() * srcs.length)]})`;
      d.style.backgroundSize     = 'cover';
      d.style.backgroundPosition = `${Math.random()*90}% ${Math.random()*90}%`;
      d.style.border             = '1px solid rgba(255,255,255,0.15)';
    } else {
      d.style.background = `hsl(35,16%,${68 + Math.random()*26}%)`;
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

/* ── Folder icon ──────────────────────────────────────────────────── */
function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg width="26" height="20" viewBox="0 0 28 22" fill="none" aria-hidden>
      <path
        d={open
          ? 'M1 5h26v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5z'
          : 'M1 5h26v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5zM1 5V4a2 2 0 012-2h6l2 2h16v1'}
        stroke="rgba(129,140,248,0.65)" strokeWidth="1.4" fill="none"
      />
    </svg>
  );
}

/* ── Component ────────────────────────────────────────────────────── */
export default function ProjectFolder() {
  const [hovered,  setHovered]  = useState(false);
  const [popped,   setPopped]   = useState(false);
  const [flash,    setFlash]    = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const folderRef = useRef<HTMLDivElement>(null);
  const router    = useRouter();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const CARDS    = isMobile ? CARDS_M : CARDS_D;
  /* Card dimensions: WIDE and SHORT — landscape document style */
  const CARD_W   = '78%';                  /* as % of folder  */
  const CARD_H   = isMobile ? 88  : 115;  /* total px height */
  const PEEK_H   = isMobile ? 62  : 80;   /* visible above folder */
  const BODY_H   = isMobile ? 140 : 195;
  const POP_Y    = isMobile ? -220 : -300;

  const items = (workItems as any[]).filter(w => w.image);

  const handleClick = () => {
    if (popped) return;
    setPopped(true); setHovered(false);
    if (typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push('/work'); return;
    }
    if (folderRef.current) explodeShreds(folderRef.current);
    setTimeout(() => setFlash(true), 2400);
    setTimeout(() => router.push('/work'), 3000);
  };

  return (
    <>
      {/* Dark-flash before navigation */}
      {flash && (
        <motion.div className="fixed inset-0"
          style={{ backgroundColor: '#030308', zIndex: 9999, pointerEvents: 'none' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeIn' }}
        />
      )}

      <div
        ref={folderRef}
        role="button" tabIndex={0}
        aria-label="Open selected work"
        style={{
          position:    'relative',
          width:       '100%',
          maxWidth:    isMobile ? '100%' : '580px',
          margin:      '0 auto',
          cursor:      popped ? 'default' : 'pointer',
          userSelect:  'none',
          touchAction: 'manipulation',
          overflow:    'visible',
        }}
        onMouseEnter={() => !popped && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
      >
        {/* ── PEEK ZONE ─────────────────────────────────────────── */}
        <div style={{ position: 'relative', height: PEEK_H, overflow: 'visible' }}>
          {CARDS.map((cfg, i) => {
            const item = items[cfg.itemIdx];
            if (!item) return null;
            return (
              <motion.div key={cfg.itemIdx} aria-hidden
                style={{
                  position:        'absolute',
                  bottom:          0,
                  left:            cfg.xPct,
                  width:           CARD_W,
                  height:          CARD_H,
                  zIndex:          cfg.z,
                  transformOrigin: 'bottom center',
                  overflow:        'hidden',
                  borderRadius:    '6px 6px 0 0',
                  /* White/light card border — like a real document */
                  border:          '1px solid rgba(255,255,255,0.22)',
                  borderBottom:    'none',
                  boxShadow:       '0 -4px 20px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.06)',
                  willChange:      'transform,opacity',
                  background:      '#fff',   /* white card base visible while loading */
                }}
                initial={false}
                animate={{
                  rotate:  popped ? cfg.rot * 2.4 : hovered ? cfg.hoverRot : cfg.rot,
                  y:       popped ? POP_Y : hovered ? (isMobile ? -20 : -28) : 0,
                  opacity: popped ? 0 : 1,
                  scale:   popped ? 1.1 : 1,
                }}
                transition={popped
                  ? { type: 'spring', stiffness: 140, damping: 12, delay: i * 0.06 }
                  : { type: 'spring', stiffness: 190, damping: 22 }
                }
              >
                {/* Screenshot fills the card — landscape crop of the top */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    width:           '100%',
                    height:          '100%',
                    objectFit:       'cover',
                    objectPosition:  'top left',
                    display:         'block',
                    /* Keep the card slightly washed-out — paper-like */
                    filter:          'brightness(0.92) contrast(0.9)',
                  }}
                />
                {/* Project name label on the card */}
                <div style={{
                  position:   'absolute',
                  top:        8,
                  left:       10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize:   isMobile ? 9 : 10,
                  fontWeight: 700,
                  color:      'rgba(0,0,0,0.55)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                  maxWidth:   '80%',
                  overflow:   'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}>
                  {item.title}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── FOLDER BODY ───────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Tab */}
          <div style={{
            position:     'absolute',
            top:          -26,
            left:         0,
            width:        isMobile ? 116 : 155,
            height:       26,
            background:   'rgba(129,140,248,0.14)',
            border:       '1px solid rgba(129,140,248,0.24)',
            borderBottom: 'none',
            borderRadius: '7px 7px 0 0',
            display:      'flex',
            alignItems:   'center',
            paddingLeft:  '0.65rem',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      '0.55rem',
              textTransform: 'uppercase',
              letterSpacing: '0.20em',
              color:         'rgba(129,140,248,0.88)',
              whiteSpace:    'nowrap',
            }}>Selected Work</span>
          </div>

          {/* Glass body */}
          <motion.div
            style={{
              width:              '100%',
              height:             BODY_H,
              background:         'rgba(10,10,26,0.82)',
              backdropFilter:     'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border:             '1px solid rgba(255,255,255,0.09)',
              borderRadius:       '0 10px 10px 10px',
              display:            'flex',
              alignItems:         'flex-end',
              justifyContent:     'space-between',
              padding:            isMobile ? '1rem 1.1rem' : '1.2rem 1.5rem',
              willChange:         'border-color,box-shadow',
            }}
            animate={{
              borderColor: hovered ? 'rgba(129,140,248,0.42)' : 'rgba(255,255,255,0.09)',
              boxShadow:   hovered
                ? '0 20px 60px rgba(0,0,0,0.55), 0 0 36px rgba(129,140,248,0.15)'
                : '0 8px 28px rgba(0,0,0,0.40)',
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div>
              <p style={{
                fontFamily:    "'JetBrains Mono', monospace",
                fontSize:      '0.55rem',
                textTransform: 'uppercase',
                letterSpacing: '0.20em',
                color:         'rgba(255,255,255,0.28)',
                marginBottom:  '0.35rem',
              }}>
                {items.length} Projects
              </p>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize:   isMobile ? '0.72rem' : '0.80rem',
                color:      'rgba(255,255,255,0.55)',
              }}>
                {hovered ? 'Click to open →' : 'Tap to open'}
              </p>
            </div>
            <FolderIcon open={hovered} />
          </motion.div>
        </div>
      </div>
    </>
  );
}
