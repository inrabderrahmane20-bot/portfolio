import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion, useAnimation, useMotionValue, useSpring, animate,
  AnimatePresence,
} from 'framer-motion';
import { useRouter } from 'next/router';

/* ── palette (matches portfolio brand) ── */
const BODY = '#141830';
const BODH = '#1e2648'; /* body highlight */
const SH   = '#f8fafc'; /* shirt */
const TIE  = '#818cf8'; /* indigo tie */
const TIED = '#6366f1';

/* TO helper — pivot at absolute SVG viewport coords */
const TO = (x: number, y: number): React.CSSProperties => ({
  transformBox:    'view-box' as unknown as undefined,
  transformOrigin: `${x}px ${y}px`,
});

type Pose = 'pulling' | 'tripped' | 'recovering';

export default function BusinessManWidget() {
  const router   = useRouter();
  const hidden   = router.pathname === '/business-cards';
  const [pose, setPose] = useState<Pose>('pulling');

  const tripping = useRef(false);
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cardX    = useMotionValue(0);
  const shakeX   = useMotionValue(0);
  const shakeY   = useMotionValue(0);

  /* ── skeleton controls ── */
  const bodyCtrl = useAnimation(); /* whole figure */
  const headCtrl = useAnimation();
  const lUACtrl  = useAnimation(); /* left  upper-arm  (pivot: left shoulder)  */
  const lLACtrl  = useAnimation(); /* left  lower-arm  (pivot: left elbow)     */
  const rUACtrl  = useAnimation(); /* right upper-arm  (pivot: right shoulder) */
  const rLACtrl  = useAnimation(); /* right lower-arm  (pivot: right elbow)    */
  const lLegCtrl = useAnimation(); /* left  leg group  (pivot: left hip)       */
  const rLegCtrl = useAnimation(); /* right leg group  (pivot: right hip)      */

  /* ── tie spring (follows body lean) ── */
  const tieTarget = useMotionValue(14);
  const tieAngle  = useSpring(tieTarget, { stiffness: 50, damping: 6, mass: 0.4 });

  const [reduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  const after = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);
  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  /* ══════════════════════════════════════════════════
     PULLING — body leans right, right arm reaches and
     TUGS the card with a rhythmic forward-pull cycle
  ══════════════════════════════════════════════════ */
  const doIdle = useCallback(() => {
    tieTarget.set(14);

    /*
     * The "tug" cycle:
     *   0 → 0.55s  body leans to 16° (approaching card)  arm extends
     *   0.55 → 0.9s body ROCKS BACK to 24° (heels dug in, pulling hard)
     *   0.9 → 1.3s  body springs back to 16° (failed tug, try again)
     *   repeat
     */
    bodyCtrl.start({
      rotate:   [16, 24, 16, 24, 16],
      x:        [0, -6, 0, -6, 0],
      transition: {
        repeat:   Infinity,
        duration: 1.3,
        times:    [0, 0.42, 0.7, 0.85, 1],
        ease:     ['easeOut', 'easeIn', 'easeOut', 'easeIn', 'easeOut'],
      },
    });

    /* head stays roughly upright / tilts toward card */
    headCtrl.start({
      rotate: [-14, -6, -14, -6, -14],
      transition: {
        repeat:   Infinity,
        duration: 1.3,
        times:    [0, 0.42, 0.7, 0.85, 1],
        ease:     'easeInOut',
      },
    });

    /*
     * Right arm reaches FULLY to the card at the start of each cycle,
     * holds while body pulls back, then very slightly retracts before
     * next reach — visually "gripping and yanking"
     */
    rUACtrl.start({
      rotate: [-40, -36, -40, -36, -40],   /* upper arm near-horizontal */
      transition: {
        repeat:   Infinity,
        duration: 1.3,
        ease:     'easeInOut',
      },
    });
    rLACtrl.start({
      rotate: [-25, -18, -25, -18, -25],   /* forearm extends further right */
      transition: {
        repeat:   Infinity,
        duration: 1.3,
        times:    [0, 0.42, 0.7, 0.85, 1],
        ease:     'easeInOut',
        delay:    0.06,
      },
    });

    /* left arm swings back as counterbalance to the pull */
    lUACtrl.start({
      rotate: [12, 24, 12, 24, 12],
      transition: { repeat: Infinity, duration: 1.3, ease: 'easeInOut' },
    });
    lLACtrl.start({
      rotate: [8, 18, 8, 18, 8],
      transition: { repeat: Infinity, duration: 1.3, ease: 'easeInOut', delay: 0.08 },
    });

    /* slight leg tension */
    lLegCtrl.start({
      rotate: [-4, 2, -4, 2, -4],
      transition: { repeat: Infinity, duration: 1.3, ease: 'easeInOut' },
    });
    rLegCtrl.start({
      rotate: [4, -2, 4, -2, 4],
      transition: { repeat: Infinity, duration: 1.3, ease: 'easeInOut' },
    });
  }, [bodyCtrl, headCtrl, lUACtrl, lLACtrl, rUACtrl, rLACtrl,
      lLegCtrl, rLegCtrl, tieTarget]);

  /* ══════════════════════════════════════════════════
     TRIPPED
  ══════════════════════════════════════════════════ */
  const doTrip = useCallback(() => {
    tieTarget.set(-30);
    [bodyCtrl, headCtrl, lUACtrl, lLACtrl, rUACtrl, rLACtrl,
     lLegCtrl, rLegCtrl].forEach(c => c.stop());

    /* anticipation */
    bodyCtrl.start({ rotate: 8, x: 4,
      transition: { duration: 0.08, ease: 'easeIn' } });

    after(80, () => {
      /* fall */
      bodyCtrl.start({ rotate: -55, x: -10,
        transition: { duration: 0.38, ease: [0.10, 0.98, 0.36, 1.0] } });
      headCtrl.start({ rotate: 22,
        transition: { duration: 0.42, ease: [0.10, 0.98, 0.36, 1.0] } });

      lUACtrl.start({ rotate: -75,
        transition: { duration: 0.32, ease: [0.10, 0.98, 0.4, 1.0] } });
      lLACtrl.start({ rotate: -45,
        transition: { duration: 0.32, ease: [0.10, 0.98, 0.4, 1.0], delay: 0.04 } });
      rUACtrl.start({ rotate: 80,
        transition: { duration: 0.32, ease: [0.10, 0.98, 0.4, 1.0] } });
      rLACtrl.start({ rotate: 55,
        transition: { duration: 0.32, ease: [0.10, 0.98, 0.4, 1.0], delay: 0.04 } });

      lLegCtrl.start({ rotate: 38,
        transition: { duration: 0.36, ease: [0.10, 0.98, 0.38, 1.0] } });
      rLegCtrl.start({ rotate: -28,
        transition: { duration: 0.36, ease: [0.10, 0.98, 0.38, 1.0] } });

      /* impact squash */
      after(400, () => {
        /* screen shake */
        const doShake = async () => {
          for (let i = 0; i < 6; i++) {
            const m = (7 - i) * 1.3;
            await animate(shakeX, (Math.random() - 0.5) * m * 2, { duration: 0.04 });
            await animate(shakeY, (Math.random() - 0.5) * m,     { duration: 0.04 });
          }
          animate(shakeX, 0, { duration: 0.05 });
          animate(shakeY, 0, { duration: 0.05 });
        };
        doShake();
      });
    });
  }, [bodyCtrl, headCtrl, lUACtrl, lLACtrl, rUACtrl, rLACtrl,
      lLegCtrl, rLegCtrl, tieTarget, shakeX, shakeY, after]);

  /* ══════════════════════════════════════════════════
     RECOVERING
  ══════════════════════════════════════════════════ */
  const doRecover = useCallback(() => {
    tieTarget.set(18);

    const sp = (s: number, d: number, del = 0) => ({
      type: 'spring' as const, stiffness: s, damping: d, ...(del ? { delay: del } : {}),
    });

    bodyCtrl.start({ rotate: 0, x: 0, transition: sp(42, 8) });
    headCtrl.start({ rotate: 0,        transition: sp(55, 9, 0.06) });
    lUACtrl.start({ rotate: 0,         transition: sp(62, 10) });
    lLACtrl.start({ rotate: 0,         transition: sp(62, 10, 0.05) });
    rUACtrl.start({ rotate: 0,         transition: sp(62, 10) });
    rLACtrl.start({ rotate: 0,         transition: sp(62, 10, 0.05) });
    lLegCtrl.start({ rotate: 0,        transition: sp(68, 11, 0.04) });
    rLegCtrl.start({ rotate: 0,        transition: sp(68, 11, 0.04) });

    after(300, () => tieTarget.set(14));

    /* dust-off: left hand brushes jacket */
    after(700, () => {
      lUACtrl.start({ rotate: -30, transition: { duration: 0.22, ease: [0.4,0,0.2,1] } });
      lLACtrl.start({ rotate: -20, transition: { duration: 0.22, ease: [0.4,0,0.2,1] } });
      after(350, () => {
        lUACtrl.start({ rotate: 0, transition: sp(160, 18) });
        lLACtrl.start({ rotate: 0, transition: sp(160, 18, 0.04) });
      });
    });
  }, [bodyCtrl, headCtrl, lUACtrl, lLACtrl, rUACtrl, rLACtrl,
      lLegCtrl, rLegCtrl, tieTarget, after]);

  /* ── pose watcher ── */
  useEffect(() => {
    if (hidden || reduced) return;
    clearAll();
    if      (pose === 'pulling')    doIdle();
    else if (pose === 'tripped')    doTrip();
    else if (pose === 'recovering') doRecover();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose, hidden, reduced]);

  /* ── scroll trigger ── */
  useEffect(() => {
    if (reduced || hidden) return;
    const onScroll = () => {
      if (tripping.current) return;
      tripping.current = true;
      setPose('tripped');
      after(1300, () => {
        setPose('recovering');
        after(1100, () => { setPose('pulling'); tripping.current = false; });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearAll(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, hidden]);

  const onCardDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -80) router.push('/business-cards');
    else animate(cardX, 0, { type: 'spring', stiffness: 310, damping: 26 });
  };

  if (hidden) return null;

  /* ════════════════════════════════════════════════════
     SVG CHARACTER
     viewBox 0 0 100 200
     fall pivot at (50, 196)  ← midpoint between feet

     Joint reference coords (default upright):
       Left  shoulder: (22, 64)   Right shoulder: (78, 64)
       Left  elbow:    (12, 96)   Right elbow:    (98, 88)  ← right reaches right
       Left  hand:     ( 8, 116)  Right hand:     (120, 100) ← OFF viewbox
       Left  hip:      (38, 152)  Right hip:       (62, 152)
       Left  knee:     (33, 175)  Right knee:      (67, 175)
       Left  foot:     (29, 196)  Right foot:      (71, 196)
  ════════════════════════════════════════════════════ */

  return (
    <>
      {/* ── STICKMAN ── */}
      <motion.div
        aria-hidden
        style={{
          position:      'fixed',
          bottom:        0,
          right:         92,      /* stickman sits 92px from right edge */
          zIndex:        40,
          width:         160,     /* rendered width → 1.6px per SVG unit */
          pointerEvents: 'none',
          userSelect:    'none',
          x: shakeX,
          y: shakeY,
        }}
      >
        {/* FULL-BODY FALL GROUP — rotates around feet */}
        <motion.div animate={bodyCtrl} style={{ ...TO(50, 196), willChange: 'transform' }}>
          <svg
            viewBox="0 0 100 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
          >
            {/* ── SVG FILTERS ── */}
            <defs>
              <filter id="bmglow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="b"/>
                <feComposite in="SourceGraphic" in2="b" operator="over"/>
              </filter>
              <linearGradient id="bodygrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor={BODH}/>
                <stop offset="50%"  stopColor={BODY}/>
                <stop offset="100%" stopColor={BODY}/>
              </linearGradient>
            </defs>

            {/* ── GROUND SHADOW ── */}
            <motion.ellipse cx="50" cy="197" rx="26" ry="5"
              fill="rgba(0,0,0,0.30)"
              animate={{
                scaleX: pose === 'tripped' ? 1.9 : 1,
                opacity: pose === 'tripped' ? 0.15 : 0.30,
              }}
              transition={{ duration: 0.4 }}
            />

            {/* ════ LEGS ════ */}

            {/* LEFT LEG GROUP — pivot at left hip (38, 152) */}
            <motion.g animate={lLegCtrl} style={TO(38, 152)}>
              {/* upper */}
              <path d="M38 152 L33 178" stroke={BODY} strokeWidth="14" strokeLinecap="round"/>
              <path d="M37 152 L32 176" stroke={BODH} strokeWidth="4"  strokeLinecap="round" opacity="0.5"/>
              {/* lower */}
              <path d="M33 178 L29 196" stroke={BODY} strokeWidth="13" strokeLinecap="round"/>
              {/* shoe */}
              <ellipse cx="23" cy="198" rx="15" ry="6"   fill={BODY}/>
              <ellipse cx="21" cy="196" rx="8"  ry="2.8" fill={BODH} opacity="0.55"/>
            </motion.g>

            {/* RIGHT LEG GROUP — pivot at right hip (62, 152) */}
            <motion.g animate={rLegCtrl} style={TO(62, 152)}>
              {/* upper */}
              <path d="M62 152 L67 178" stroke={BODY} strokeWidth="14" strokeLinecap="round"/>
              <path d="M61 152 L65 176" stroke={BODH} strokeWidth="4"  strokeLinecap="round" opacity="0.5"/>
              {/* lower */}
              <path d="M67 178 L71 196" stroke={BODY} strokeWidth="13" strokeLinecap="round"/>
              {/* shoe */}
              <ellipse cx="77" cy="198" rx="15" ry="6"   fill={BODY}/>
              <ellipse cx="79" cy="196" rx="8"  ry="2.8" fill={BODH} opacity="0.55"/>
            </motion.g>

            {/* ════ JACKET / TORSO ════ */}
            {/* Main suit body shape — wide shoulders, slight taper */}
            <path
              d="M14 62 C10 62 8 68 8 76 L10 152 L90 152 L92 76 C92 68 90 62 86 62
                 Q72 54 50 54 Q28 54 14 62 Z"
              fill="url(#bodygrad)"
            />
            {/* jacket surface shading */}
            <path
              d="M14 62 Q28 54 50 54 Q50 54 50 152 L10 152 Z"
              fill="rgba(255,255,255,0.025)"
            />
            {/* lapel / shirt opening */}
            <path d="M41 54 L50 64 L59 54 L59 60 L50 70 L41 60 Z" fill={SH}/>
            {/* pocket square */}
            <path d="M76 80 L85 80 L85 88 L76 88 Z" fill="rgba(255,255,255,0.07)"/>
            <path d="M77 80 L80 74 L83 80"          fill={SH}/>

            {/* ── TIE (3-segment spring) ── */}
            <motion.g style={{ ...TO(50, 64), rotate: tieAngle as any }}>
              {/* knot */}
              <path d="M47 65 L50 61 L53 65 L50 70 Z" fill={TIED}/>
              {/* blade */}
              <path d="M47 65 L50 70 L52 108 L50 112 L48 108 Z" fill={TIE}/>
              {/* shine */}
              <path d="M49 70 L49.5 105"
                stroke="rgba(255,255,255,0.3)" strokeWidth="0.9" strokeLinecap="round"/>
              {/* tip */}
              <path d="M48 108 L50 112 L52 108 L50 110 Z" fill={TIED}/>
            </motion.g>

            {/* belt */}
            <rect x="8"  y="147" width="84" height="7" rx="2.5" fill="#07091a"/>
            <rect x="45" y="145" width="11" height="10" rx="2"  fill="#b8922e"/>
            <rect x="47" y="147" width="7"  height="6"  rx="1.5" fill="#d4a93a"/>

            {/* jacket buttons */}
            <circle cx="50" cy="138" r="2"   fill="rgba(255,255,255,0.2)"/>
            <circle cx="50" cy="124" r="2"   fill="rgba(255,255,255,0.2)"/>
            <circle cx="50.8" cy="137.3" r="0.8" fill="rgba(255,255,255,0.55)"/>

            {/* ════ ARMS ════ */}

            {/* LEFT UPPER ARM — pivot at left shoulder (22, 64) */}
            <motion.g animate={lUACtrl} style={TO(22, 64)}>
              <path d="M22 64 L10 96"  stroke={BODY} strokeWidth="13" strokeLinecap="round"/>
              <path d="M21 64 L9.5 94" stroke={BODH} strokeWidth="3.5" strokeLinecap="round" opacity="0.45"/>
              {/* LEFT LOWER ARM — pivot at left elbow (10, 96) */}
              <motion.g animate={lLACtrl} style={TO(10, 96)}>
                <path d="M10 96 L6 116"  stroke={BODY} strokeWidth="11" strokeLinecap="round"/>
                <path d="M6 114 L5 122"  stroke={SH}   strokeWidth="8"  strokeLinecap="round"/>
                {/* hand */}
                <circle cx="4" cy="126" r="8" fill={BODY}/>
              </motion.g>
            </motion.g>

            {/* RIGHT UPPER ARM — pivot at right shoulder (78, 64) */}
            {/* DEFAULT POSE: arm already angled right-forward to reach card */}
            <motion.g animate={rUACtrl} style={TO(78, 64)}>
              <path d="M78 64 L98 90"   stroke={BODY} strokeWidth="13" strokeLinecap="round"/>
              <path d="M77 64 L96.5 88" stroke={BODH} strokeWidth="3.5" strokeLinecap="round" opacity="0.45"/>
              {/* RIGHT LOWER ARM — pivot at right elbow (98, 90) */}
              <motion.g animate={rLACtrl} style={TO(98, 90)}>
                <path d="M98 90 L116 104"  stroke={BODY} strokeWidth="11" strokeLinecap="round"/>
                <path d="M116 102 L118 110" stroke={SH}   strokeWidth="8"  strokeLinecap="round"/>
                {/* reaching hand — slightly open, visually grabs card */}
                <circle cx="120" cy="114" r="8" fill={BODY}/>
                {/* finger hints */}
                <path d="M114 117 L113 123" stroke={BODY} strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M118 119 L118 125" stroke={BODY} strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M122 118 L123 124" stroke={BODY} strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M125 116 L126 122" stroke={BODY} strokeWidth="3"   strokeLinecap="round"/>
              </motion.g>
            </motion.g>

            {/* ════ HEAD — pivot at (50, 32) ════ */}
            <motion.g animate={headCtrl} style={TO(50, 32)}>
              {/* neck */}
              <rect x="46" y="52" width="8" height="10" rx="3" fill={BODY}/>

              {/* head (slightly taller oval for suit-icon look) */}
              <ellipse cx="50" cy="32" rx="20" ry="21" fill={BODY}/>
              {/* subtle top highlight */}
              <path d="M34 24 Q50 16 66 24" fill="rgba(255,255,255,0.08)"/>
            </motion.g>

          </svg>
        </motion.div>
      </motion.div>

      {/* ── BUSINESS CARD ──
          Positioned so the visible left edge aligns with the reaching hand.
          right: -32 → 32px off screen; card width: 84 → 52px visible.
          Hand at SVG x≈120 * 1.6px/unit = 192px from stickman div left,
          stickman div left = screen.width - 92 - 160 = screen.width - 252
          → hand screen x ≈ screen.width - 252 + 192 = screen.width - 60
          Card left visible at screen.width - 32 - 84 = screen.width - 116...
          nudge card to right: -52 so left edge = screen.width - 84 + 52 = screen.width - 32
          Actually: right:-52 → right edge at screen.width+52, left at screen.width+52-84=screen.width-32
          keeping right:-30 which gives left = screen.width - 54; hand reaches to ~screen.width-60 ✓
      ── */}
      <div style={{
        position:      'fixed',
        bottom:        68,
        right:         -30,
        zIndex:        40,
        pointerEvents: 'auto',
        userSelect:    'none',
      }}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -230, right: 0 }}
          dragElastic={{ left: 0.07, right: 0.02 }}
          style={{ x: cardX, cursor: 'grab' }}
          whileDrag={{ cursor: 'grabbing', scale: 1.05, rotate: -4 }}
          onDragEnd={onCardDragEnd}
        >
          <div style={{
            width:          84,
            height:         52,
            borderRadius:   7,
            background:     'linear-gradient(135deg,#0c1226 0%,#1a1f3c 60%,#0f172a 100%)',
            border:         '1px solid rgba(129,140,248,0.44)',
            boxShadow:      '0 6px 28px rgba(0,0,0,0.65),0 0 18px rgba(129,140,248,0.18),inset 0 1px 0 rgba(255,255,255,0.07)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            4,
            overflow:       'hidden',
            position:       'relative',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
              background: 'linear-gradient(to bottom,rgba(255,255,255,0.06),transparent)',
              borderRadius: '7px 7px 0 0', pointerEvents: 'none',
            }}/>
            <span style={{
              fontFamily:           "'Space Grotesk','Segoe UI',sans-serif",
              fontSize:             17,
              fontWeight:           900,
              background:           'linear-gradient(135deg,#818cf8,#38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              letterSpacing:        '-0.02em',
              lineHeight:           1,
            }}>AC</span>
            <span style={{
              fontFamily:    "'JetBrains Mono','Courier New',monospace",
              fontSize:      5.5,
              color:         'rgba(255,255,255,0.35)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>Business Card</span>
          </div>

          {/* pull-hint arrow */}
          <motion.div
            animate={{ x: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
            style={{
              position:      'absolute',
              left:          -22,
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
