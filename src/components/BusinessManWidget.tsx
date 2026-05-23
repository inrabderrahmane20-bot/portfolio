import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useRouter } from 'next/router';

type Pose = 'pulling' | 'tripped' | 'recovering';

const SKIN   = '#f2bb9a';
const JACKET = '#1a1f3c';
const LAPEL  = '#12152a';
const SHIRT  = '#f1f5f9';
const TIE    = '#818cf8';
const TIE2   = '#6366f1';
const PANTS  = '#0f1629';
const SHOE   = '#1e293b';

export default function BusinessManWidget() {
  const router          = useRouter();
  const [pose, setPose] = useState<Pose>('pulling');
  const [reduced]       = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const tripping = useRef(false);
  const timer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardX    = useMotionValue(0);
  const hidden   = router.pathname === '/business-cards';

  /* ── scroll → trip → recover ── */
  useEffect(() => {
    if (reduced || hidden) return;

    const onScroll = () => {
      if (tripping.current) return;
      tripping.current = true;
      setPose('tripped');
      timer.current = setTimeout(() => {
        setPose('recovering');
        setTimeout(() => {
          setPose('pulling');
          tripping.current = false;
        }, 660);
      }, 1050);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [reduced, hidden]);

  const onCardDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -80) {
      router.push('/business-cards');
    } else {
      animate(cardX, 0, { type: 'spring', stiffness: 310, damping: 26 });
    }
  };

  if (hidden) return null;

  /* ── per-pose animation objects ── */
  const bodyAnim =
    pose === 'pulling'
      ? { rotate: 0,   x: 0,  transition: { type: 'spring' as const, stiffness: 180, damping: 22 } }
      : pose === 'tripped'
      ? { rotate: -50, x: -7, transition: { type: 'spring' as const, stiffness: 130, damping: 11 } }
      : { rotate: 4,   x: 1,  transition: { type: 'spring' as const, stiffness: 220, damping: 16 } };

  const leftArmAnim =
    pose === 'pulling'
      ? { rotate: 0,   transition: { type: 'spring' as const, stiffness: 180, damping: 22 } }
      : pose === 'tripped'
      ? { rotate: -58, transition: { type: 'spring' as const, stiffness: 130, damping: 11 } }
      : { rotate: 14,  transition: { type: 'spring' as const, stiffness: 200, damping: 18 } };

  const rightArmAnim =
    pose === 'pulling'
      ? { rotate: [0, -6, 2, -6, 0], transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' as const } }
      : pose === 'tripped'
      ? { rotate: 58,  transition: { type: 'spring' as const, stiffness: 130, damping: 11 } }
      : { rotate: -8,  transition: { type: 'spring' as const, stiffness: 200, damping: 18 } };

  return (
    <>
      {/* ─────────────── STICKMAN ─────────────── */}
      <div
        aria-hidden
        style={{
          position:      'fixed',
          bottom:        0,
          right:         92,
          zIndex:        40,
          width:         90,
          pointerEvents: 'none',
          userSelect:    'none',
        }}
      >
        {/* Whole body rotates around feet (93% down) when tripping */}
        <motion.div
          animate={bodyAnim}
          style={{ transformOrigin: '50% 93%', willChange: 'transform' }}
        >
          <svg
            viewBox="0 0 90 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
          >
            {/* ── Dazed stars (visible while tripped) ── */}
            {pose === 'tripped' && (
              <motion.g
                style={{ transformOrigin: '45px 15px' }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.0, ease: 'linear' }}
              >
                <text x="27" y="1"  fontSize="9"  fill="#fbbf24" fontFamily="sans-serif">★</text>
                <text x="55" y="6"  fontSize="7"  fill="#818cf8" fontFamily="sans-serif">★</text>
                <text x="41" y="-3" fontSize="8"  fill="#38bdf8" fontFamily="sans-serif">★</text>
              </motion.g>
            )}

            {/* ── HEAD ── */}
            <circle cx="45" cy="15" r="12" fill={SKIN} />
            {/* Hair */}
            <path
              d="M33 12 Q35 2 45 1 Q55 2 57 12"
              stroke="#5c3319" strokeWidth="4.5" fill="none" strokeLinecap="round"
            />
            {/* Face — determined when pulling, wide-eyed when tripped */}
            {pose === 'tripped' ? (
              <>
                <circle cx="41" cy="14" r="2.5" fill="#1a1a2e" />
                <circle cx="49" cy="14" r="2.5" fill="#1a1a2e" />
                {/* sweat drop */}
                <path d="M57 10 Q59.5 6 57 3 Q54.5 6 57 10" fill="#38bdf8" opacity="0.85" />
                {/* open mouth */}
                <path d="M40 22 Q45 18.5 50 22" stroke="#8b5c3c" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="41" cy="14" r="1.9" fill="#1a1a2e" />
                <circle cx="49" cy="14" r="1.9" fill="#1a1a2e" />
                {/* determined brows */}
                <path d="M38 10 L44 12"   stroke="#5c3319" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M46 12 L52 10"   stroke="#5c3319" strokeWidth="1.8" strokeLinecap="round" />
                {/* slight smirk */}
                <path d="M40 21 Q45 24 50 21" stroke="#8b5c3c" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </>
            )}

            {/* ── NECK ── */}
            <rect x="42" y="27" width="6" height="8" rx="2" fill={SKIN} />

            {/* ── JACKET BODY ── */}
            <path d="M14 36 L16 93 L74 93 L76 36 L62 27 L45 30 L28 27 Z" fill={JACKET} />
            {/* White shirt V */}
            <path d="M34 27 L45 30 L56 27 L54 63 L45 67 L36 63 Z" fill={SHIRT} />
            {/* Lapels */}
            <path d="M28 27 L45 30 L14 36 L19 55 L33 45 Z" fill={LAPEL} />
            <path d="M62 27 L45 30 L76 36 L71 55 L57 45 Z" fill={LAPEL} />

            {/* ── TIE ── */}
            <path d="M42.5 32 L45 28.5 L47.5 32 L45 36 Z"        fill={TIE2} />
            <path d="M42.5 32 L45 36 L47 70 L45 74 L43 70 Z"      fill={TIE} />
            <path d="M44.5 36 L45 68" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" strokeLinecap="round" />

            {/* Pocket square */}
            <path d="M65 44 L71 44 L71 50 L65 50 Z"    fill="rgba(255,255,255,0.08)" />
            <path d="M65.5 44 L67.5 39.5 L69.5 44"     fill={SHIRT} />

            {/* ── LEFT ARM ── (down, relaxed) */}
            <motion.g
              style={{ transformOrigin: '18px 46px' }}
              animate={leftArmAnim}
            >
              <path d="M18 46 L7 68"  stroke={JACKET} strokeWidth="10" strokeLinecap="round" />
              <path d="M7 68 L3 86"   stroke={JACKET} strokeWidth="9"  strokeLinecap="round" />
              <path d="M3 84 L2 91"   stroke={SHIRT}  strokeWidth="7"  strokeLinecap="round" />
              <circle cx="2" cy="93" r="5.5" fill={SKIN} />
            </motion.g>

            {/* ── RIGHT ARM ── (reaching right toward card, oscillates) */}
            <motion.g
              style={{ transformOrigin: '72px 46px' }}
              animate={rightArmAnim}
            >
              <path d="M72 46 L82 62"   stroke={JACKET} strokeWidth="10" strokeLinecap="round" />
              <path d="M82 62 L89 78"   stroke={JACKET} strokeWidth="9"  strokeLinecap="round" />
              <path d="M88 76 L90 83"   stroke={SHIRT}  strokeWidth="7"  strokeLinecap="round" />
              <circle cx="91" cy="85" r="5.5" fill={SKIN} />
            </motion.g>

            {/* ── BELT ── */}
            <rect x="16" y="91" width="58" height="5"   rx="2"   fill="#090d1a" />
            <rect x="41" y="90" width="8"  height="7"   rx="1.5" fill="#c4a040" />

            {/* ── LEGS ── */}
            <path d="M26 95 L22 142" stroke={PANTS} strokeWidth="12" strokeLinecap="round" />
            <path d="M64 95 L68 142" stroke={PANTS} strokeWidth="12" strokeLinecap="round" />

            {/* ── SHOES ── */}
            <ellipse cx="18" cy="145" rx="14" ry="5.5" fill={SHOE} />
            <ellipse cx="72" cy="145" rx="14" ry="5.5" fill={SHOE} />
          </svg>
        </motion.div>
      </div>

      {/* ─────────────── BUSINESS CARD (peeking from right edge) ─────────────── */}
      <div
        style={{
          position:      'fixed',
          bottom:        62,
          right:         -28,   /* 28 px of card hidden off-screen right */
          zIndex:        40,
          pointerEvents: 'auto',
          userSelect:    'none',
        }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -220, right: 0 }}
          dragElastic={{ left: 0.06, right: 0.02 }}
          style={{ x: cardX, cursor: 'grab' }}
          whileDrag={{ cursor: 'grabbing', scale: 1.04 }}
          onDragEnd={onCardDragEnd}
        >
          {/* Card face */}
          <div
            style={{
              width:          84,
              height:         52,
              borderRadius:   7,
              background:     'linear-gradient(135deg, #0c1226 0%, #1a1f3c 60%, #0f172a 100%)',
              border:         '1px solid rgba(129,140,248,0.44)',
              boxShadow:      '0 6px 28px rgba(0,0,0,0.65), 0 0 18px rgba(129,140,248,0.18), inset 0 1px 0 rgba(255,255,255,0.07)',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            4,
              overflow:       'hidden',
              position:       'relative',
            }}
          >
            {/* Gloss */}
            <div style={{
              position:     'absolute', top: 0, left: 0, right: 0, height: '45%',
              background:   'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)',
              borderRadius: '7px 7px 0 0',
              pointerEvents:'none',
            }} />
            <span style={{
              fontFamily:           "'Space Grotesk', 'Segoe UI', sans-serif",
              fontSize:             17,
              fontWeight:           900,
              background:           'linear-gradient(135deg, #818cf8, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              letterSpacing:        '-0.02em',
              lineHeight:           1,
            }}>AC</span>
            <span style={{
              fontFamily:    "'JetBrains Mono', 'Courier New', monospace",
              fontSize:      5.5,
              color:         'rgba(255,255,255,0.35)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>Business Card</span>
          </div>

          {/* Animated pull-hint arrow */}
          <motion.div
            animate={reduced ? undefined : { x: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
            style={{
              position:      'absolute',
              left:          -20,
              top:           '50%',
              marginTop:     -8,
              fontSize:      14,
              color:         'rgba(129,140,248,0.72)',
              pointerEvents: 'none',
            }}
          >←</motion.div>
        </motion.div>
      </div>
    </>
  );
}
