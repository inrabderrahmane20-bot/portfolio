import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion, useAnimation, useMotionValue, useSpring, animate,
  AnimatePresence,
} from 'framer-motion';
import { useRouter } from 'next/router';

/* ════════════════════════════════════════════════════════
   PALETTE
════════════════════════════════════════════════════════ */
const SK  = '#f5c6a0';
const SKD = '#d4956a';
const HR  = '#2e1505';
const JK  = '#141831';
const JKH = '#202746';
const LP  = '#09091d';
const SH  = '#f8fafc';
const TL  = '#818cf8';
const TD  = '#6366f1';
const TDK = '#4338ca';
const PT  = '#0b0e22';
const PTH = '#161c38';
const SO  = '#141830';
const SOH = '#222d50';

/* ════════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════════ */
type Pose = 'pulling' | 'tripped' | 'recovering';
type Face = 'determined' | 'shocked' | 'tired' | 'straining';

interface Ptcl {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number;
  r: number; g: number; b: number;
}
interface Ring {
  x: number; y: number; rad: number; maxRad: number;
  life: number; max: number; r: number; g: number; b: number;
}

/* helper: SVG transform-origin at absolute viewport coordinates */
const TO = (x: number, y: number): React.CSSProperties => ({
  transformBox:    'view-box' as unknown as undefined,
  transformOrigin: `${x}px ${y}px`,
});

/* ════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════ */
export default function BusinessManWidget() {
  const router = useRouter();
  const hidden = router.pathname === '/business-cards';

  const [pose,    setPose]    = useState<Pose>('pulling');
  const [face,    setFace]    = useState<Face>('determined');
  const [blink,   setBlink]   = useState(false);
  const [flash,   setFlash]   = useState(false);
  const [shake,   setShake]   = useState(false);
  const [shout,   setShout]   = useState(false);  // "!!" text
  const [aura,    setAura]    = useState(false);
  const [speedLn, setSpeedLn] = useState(false);
  const [sweatN,  setSweatN]  = useState(0);       // # of simultaneous drops
  const [stars,   setStars]   = useState(false);
  const [vein,    setVein]    = useState(false);

  const tripping  = useRef(false);
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ptcls     = useRef<Ptcl[]>([]);
  const rings     = useRef<Ring[]>([]);
  const rafId     = useRef(-1);
  const cardX     = useMotionValue(0);
  const shakeX    = useMotionValue(0);
  const shakeY    = useMotionValue(0);

  /* ── skeleton animation controls ── */
  const bodyCtrl  = useAnimation();
  const torsoCtrl = useAnimation();
  const headCtrl  = useAnimation();
  const lUACtrl   = useAnimation();
  const lLACtrl   = useAnimation();
  const rUACtrl   = useAnimation();
  const rLACtrl   = useAnimation();
  const lULCtrl   = useAnimation();
  const lLLCtrl   = useAnimation();
  const rULCtrl   = useAnimation();
  const rLLCtrl   = useAnimation();

  /* ── secondary physics (3-segment tie + hair) ── */
  const tie0T = useMotionValue(4);
  const tie1T = useMotionValue(4);
  const tie2T = useMotionValue(4);
  const tie0  = useSpring(tie0T, { stiffness: 60,  damping:  7, mass: 0.3  });
  const tie1  = useSpring(tie1T, { stiffness: 35,  damping:  5, mass: 0.55 });
  const tie2  = useSpring(tie2T, { stiffness: 20,  damping:  4, mass: 0.9  });
  const hair0T = useMotionValue(0);
  const hair0  = useSpring(hair0T, { stiffness: 90, damping: 5, mass: 0.15 });

  const [reduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  /* ── timers ── */
  const after = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);
  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  /* ════════════════════════════════════════════════════════
     CANVAS PARTICLE SYSTEM
  ════════════════════════════════════════════════════════ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let last = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* particles */
      for (let i = ptcls.current.length - 1; i >= 0; i--) {
        const p = ptcls.current[i];
        p.life -= dt;
        if (p.life <= 0) { ptcls.current.splice(i, 1); continue; }
        p.vx *= 0.92;
        p.vy += 220 * dt;
        p.x  += p.vx * dt;
        p.y  += p.vy * dt;
        const a = Math.max(0, p.life / p.max);
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * a + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      /* impact rings */
      for (let i = rings.current.length - 1; i >= 0; i--) {
        const rng = rings.current[i];
        rng.life -= dt;
        if (rng.life <= 0) { rings.current.splice(i, 1); continue; }
        const t = 1 - rng.life / rng.max;
        rng.rad = rng.maxRad * t;
        const a = Math.max(0, rng.life / rng.max) * 0.85;
        ctx.globalAlpha = a;
        ctx.strokeStyle = `rgb(${rng.r},${rng.g},${rng.b})`;
        ctx.lineWidth   = 3 * (1 - t) + 0.5;
        ctx.beginPath();
        ctx.ellipse(rng.x, rng.y, rng.rad, rng.rad * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* canvas helpers — emit from character coords */
  const charBase = useCallback(() => {
    const r = stickyRef.current?.getBoundingClientRect();
    return r ? { x: r.left, y: r.top } : { x: 0, y: 0 };
  }, []);

  const emitSparks = useCallback((count = 10) => {
    const { x, y } = charBase();
    const scale = (stickyRef.current?.offsetWidth ?? 150) / 150;
    // right hand approx position in rendered pixels
    const hx = x + 123 * scale;
    const hy = y + 136 * scale;
    for (let i = 0; i < count; i++) {
      ptcls.current.push({
        x: hx + (Math.random() - 0.5) * 12,
        y: hy + (Math.random() - 0.5) * 12,
        vx: 60 + Math.random() * 100,
        vy: -80 + Math.random() * 160,
        life: 0.4 + Math.random() * 0.4,
        max:  0.8,
        size: 2.5 + Math.random() * 3,
        r: 129 + Math.floor(Math.random() * 80),
        g: 140 + Math.floor(Math.random() * 80),
        b: 248,
      });
    }
  }, [charBase]);

  const emitDust = useCallback(() => {
    const { x, y } = charBase();
    const scale = (stickyRef.current?.offsetWidth ?? 150) / 150;
    const fx = x + 65 * scale;
    const fy = y + 218 * scale;
    for (let i = 0; i < 28; i++) {
      const ang = Math.PI + (Math.random() - 0.5) * 1.6;
      const spd = 60 + Math.random() * 180;
      ptcls.current.push({
        x: fx + (Math.random() - 0.5) * 40,
        y: fy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 40,
        life: 0.5 + Math.random() * 0.6,
        max:  1.1,
        size: 5 + Math.random() * 8,
        r: 160 + Math.floor(Math.random() * 60),
        g: 155 + Math.floor(Math.random() * 60),
        b: 180 + Math.floor(Math.random() * 60),
      });
    }
    rings.current.push({
      x: fx, y: fy,
      rad: 0, maxRad: 90,
      life: 0.5, max: 0.5,
      r: 200, g: 195, b: 220,
    });
    rings.current.push({
      x: fx, y: fy,
      rad: 0, maxRad: 55,
      life: 0.35, max: 0.35,
      r: 129, g: 140, b: 248,
    });
  }, [charBase]);

  const emitImpactStars = useCallback(() => {
    const { x, y } = charBase();
    const scale = (stickyRef.current?.offsetWidth ?? 150) / 150;
    const hx = x + 65 * scale;
    const hy = y + 42 * scale;
    for (let i = 0; i < 22; i++) {
      const ang = (i / 22) * Math.PI * 2;
      const spd = 80 + Math.random() * 140;
      ptcls.current.push({
        x: hx, y: hy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0.6 + Math.random() * 0.5,
        max:  1.1,
        size: 3 + Math.random() * 4,
        r: [251,129,56][i % 3],
        g: [191,140,189][i % 3],
        b: [36, 248,248][i % 3],
      });
    }
  }, [charBase]);

  /* ════════════════════════════════════════════════════════
     SCREEN SHAKE
  ════════════════════════════════════════════════════════ */
  const doShake = useCallback(() => {
    setShake(true);
    const seq = async () => {
      for (let i = 0; i < 7; i++) {
        const mag = (8 - i) * 1.2;
        await animate(shakeX, (Math.random() - 0.5) * mag * 2,
          { duration: 0.04, ease: 'linear' });
        await animate(shakeY, (Math.random() - 0.5) * mag,
          { duration: 0.04, ease: 'linear' });
      }
      await animate(shakeX, 0, { duration: 0.05 });
      await animate(shakeY, 0, { duration: 0.05 });
      setShake(false);
    };
    seq();
  }, [shakeX, shakeY]);

  /* ════════════════════════════════════════════════════════
     IDLE / PULLING
  ════════════════════════════════════════════════════════ */
  const doIdle = useCallback(() => {
    setFace('determined');
    setStars(false);
    setSpeedLn(false);
    setShout(false);
    setSweatN(0);
    setAura(true);

    tie0T.set(4); tie1T.set(5); tie2T.set(6);
    hair0T.set(0);

    /* body: lean toward card + breathe */
    bodyCtrl.start({
      rotate: [2, 4.5, 2.5, 4.5, 2],
      x:      [0,  2,   0.5, 2,   0],
      transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
    });
    torsoCtrl.start({
      scaleY: [1, 1.018, 1, 1.018, 1],
      transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
    });
    headCtrl.start({
      rotate: [-1, 2.5, -1, 2.5, -1],
      y:      [0, -1.5,  0, -1.5,  0],
      transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
    });

    /* right arm — straining, reaching oscillation */
    rUACtrl.start({
      rotate: [0, -14, 4, -14, 0],
      transition: { repeat: Infinity, duration: 1.65, ease: [0.37,0,0.63,1] },
    });
    rLACtrl.start({
      rotate: [0, -10, 3, -10, 0],
      transition: { repeat: Infinity, duration: 1.65, ease: [0.37,0,0.63,1], delay: 0.09 },
    });

    /* left arm — relaxed pendulum */
    lUACtrl.start({
      rotate: [0, -6, 2, -6, 0],
      transition: { repeat: Infinity, duration: 2.7, ease: 'easeInOut', delay: 0.5 },
    });
    lLACtrl.start({
      rotate: [0, -9, 3, -9, 0],
      transition: { repeat: Infinity, duration: 2.7, ease: 'easeInOut', delay: 0.65 },
    });

    /* legs — weight shift */
    lULCtrl.start({
      rotate: [-1.5, 1, -1.5],
      transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
    });
    rULCtrl.start({
      rotate: [1.5, -1, 1.5],
      transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
    });
    lLLCtrl.start({ rotate: 0 });
    rLLCtrl.start({ rotate: 0 });

    /* effort sparks every 2s */
    const sparkLoop = () => {
      setFace('straining');
      setVein(true);
      emitSparks(14);
      after(300, () => setVein(false));
      after(500, () => setFace('determined'));
      after(2200, sparkLoop);
    };
    after(1200, sparkLoop);

    /* occasional extra sweat drop */
    const sweatLoop = () => {
      setSweatN(1 + Math.floor(Math.random() * 2));
      after(1400, () => setSweatN(0));
      after(5000 + Math.random() * 3000, sweatLoop);
    };
    after(3000, sweatLoop);
  }, [bodyCtrl, torsoCtrl, headCtrl, lUACtrl, lLACtrl, rUACtrl, rLACtrl,
      lULCtrl, lLLCtrl, rULCtrl, rLLCtrl, tie0T, tie1T, tie2T, hair0T,
      emitSparks, after]);

  /* ════════════════════════════════════════════════════════
     TRIPPED
  ════════════════════════════════════════════════════════ */
  const doTrip = useCallback(() => {
    setFace('shocked');
    setAura(false);
    setVein(false);
    setSweatN(0);
    [bodyCtrl, torsoCtrl, headCtrl, lUACtrl, lLACtrl, rUACtrl, rLACtrl,
     lULCtrl, lLLCtrl, rULCtrl, rLLCtrl].forEach(c => c.stop());

    tie0T.set(-26); tie1T.set(-35); tie2T.set(-44);
    hair0T.set(-12);

    /* ── Phase 0: ANTICIPATION 90ms ── */
    bodyCtrl.start({
      rotate: -7, x: 4, scaleX: 1.04,
      transition: { duration: 0.09, ease: 'easeIn' },
    });
    rUACtrl.start({ rotate: 8, transition: { duration: 0.09 } });
    lUACtrl.start({ rotate: 8, transition: { duration: 0.09 } });

    after(90, () => {
      /* ── Phase 1: FALL ── */
      setFlash(true);
      setSpeedLn(true);
      after(130, () => { setFlash(false); setShout(true); });
      after(520, () => { setSpeedLn(false); });

      bodyCtrl.start({
        rotate: -58, x: -12, scaleX: 1,
        scaleY: [1, 1.06, 1],
        transition: { duration: 0.40, ease: [0.10, 0.98, 0.36, 1.02] },
      });
      torsoCtrl.start({
        scaleY: [1.0, 0.88, 1.0],
        transition: { duration: 0.40, ease: [0.10, 0.98, 0.36, 1.0] },
      });
      headCtrl.start({
        rotate: -22, y: 6,
        transition: { duration: 0.46, ease: [0.10, 0.98, 0.36, 1.0] },
      });

      lUACtrl.start({
        rotate: -88,
        transition: { duration: 0.32, ease: [0.10, 0.98, 0.4, 1.0] },
      });
      lLACtrl.start({
        rotate: -60,
        transition: { duration: 0.32, ease: [0.10, 0.98, 0.4, 1.0], delay: 0.04 },
      });
      rUACtrl.start({
        rotate: 92,
        transition: { duration: 0.32, ease: [0.10, 0.98, 0.4, 1.0] },
      });
      rLACtrl.start({
        rotate: 68,
        transition: { duration: 0.32, ease: [0.10, 0.98, 0.4, 1.0], delay: 0.04 },
      });

      lULCtrl.start({
        rotate: 42,
        transition: { duration: 0.36, ease: [0.10, 0.98, 0.38, 1.0] },
      });
      lLLCtrl.start({
        rotate: 55,
        transition: { duration: 0.36, ease: [0.10, 0.98, 0.38, 1.0], delay: 0.06 },
      });
      rULCtrl.start({
        rotate: -32,
        transition: { duration: 0.36, ease: [0.10, 0.98, 0.38, 1.0] },
      });
      rLLCtrl.start({
        rotate: -20,
        transition: { duration: 0.36, ease: [0.10, 0.98, 0.38, 1.0], delay: 0.05 },
      });

      /* ── Phase 2: IMPACT ── */
      after(410, () => {
        doShake();
        emitDust();
        emitImpactStars();

        /* squash on impact */
        bodyCtrl.start({
          scaleX: 1.08, scaleY: 0.90,
          transition: { duration: 0.07 },
        });
        after(70, () => {
          bodyCtrl.start({
            scaleX: 1, scaleY: 1,
            transition: { type: 'spring', stiffness: 380, damping: 20 },
          });
        });

        setSweatN(3);
        after(1000, () => {
          setSweatN(0);
          setStars(true);
          after(200, () => setShout(false));
        });
      });
    });
  }, [bodyCtrl, torsoCtrl, headCtrl, lUACtrl, lLACtrl, rUACtrl, rLACtrl,
      lULCtrl, lLLCtrl, rULCtrl, rLLCtrl, tie0T, tie1T, tie2T, hair0T,
      doShake, emitDust, emitImpactStars, after]);

  /* ════════════════════════════════════════════════════════
     RECOVERING
  ════════════════════════════════════════════════════════ */
  const doRecover = useCallback(() => {
    setFace('tired');
    setStars(false);
    setSweatN(2);
    setSpeedLn(false);
    setShout(false);

    tie0T.set(12); tie1T.set(16); tie2T.set(20);
    hair0T.set(6);

    const sp = (s: number, d: number, del = 0) => ({
      type: 'spring' as const, stiffness: s, damping: d, ...(del ? { delay: del } : {}),
    });

    /* slow pained rise with overshoot */
    bodyCtrl.start({ rotate: 0, x: 0, scaleX: 1, scaleY: 1,
      transition: sp(45, 8, 0) });
    torsoCtrl.start({ scaleY: 1,
      transition: sp(60, 10, 0.05) });
    headCtrl.start({ rotate: 0, y: 0,
      transition: sp(55, 9, 0.08) });

    lUACtrl.start({ rotate: 0, transition: sp(65, 10) });
    lLACtrl.start({ rotate: 0, transition: sp(65, 10, 0.05) });
    rUACtrl.start({ rotate: 0, transition: sp(65, 10) });
    rLACtrl.start({ rotate: 0, transition: sp(65, 10, 0.05) });
    lULCtrl.start({ rotate: 0, transition: sp(70, 11, 0.04) });
    lLLCtrl.start({ rotate: 0, transition: sp(70, 11, 0.10) });
    rULCtrl.start({ rotate: 0, transition: sp(70, 11, 0.04) });
    rLLCtrl.start({ rotate: 0, transition: sp(70, 11, 0.10) });

    /* tie settles */
    after(300,  () => { tie0T.set(4); tie1T.set(5); tie2T.set(6); });
    after(400,  () => { hair0T.set(0); setSweatN(0); });

    /* collar-adjust gesture */
    after(750, () => {
      rUACtrl.start({ rotate: -32, transition: { duration: 0.22, ease: [0.4,0,0.2,1] } });
      rLACtrl.start({ rotate: -22, transition: { duration: 0.22, ease: [0.4,0,0.2,1] } });
      after(380, () => {
        rUACtrl.start({ rotate: 0, transition: sp(175, 18) });
        rLACtrl.start({ rotate: 0, transition: sp(175, 18, 0.04) });
      });
    });
  }, [bodyCtrl, torsoCtrl, headCtrl, lUACtrl, lLACtrl, rUACtrl, rLACtrl,
      lULCtrl, lLLCtrl, rULCtrl, rLLCtrl, tie0T, tie1T, tie2T, hair0T, after]);

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
      after(1350, () => {
        setPose('recovering');
        after(1150, () => {
          setPose('pulling');
          tripping.current = false;
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearAll(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, hidden]);

  /* ── blink loop ── */
  useEffect(() => {
    if (reduced || hidden) return;
    let id: ReturnType<typeof setTimeout>;
    const loop = () => {
      setBlink(true);
      id = setTimeout(() => {
        setBlink(false);
        id = setTimeout(loop, 2200 + Math.random() * 3000);
      }, 100);
    };
    id = setTimeout(loop, 2000);
    return () => clearTimeout(id);
  }, [reduced, hidden]);

  /* ── card drag ── */
  const onCardDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -80) router.push('/business-cards');
    else animate(cardX, 0, { type: 'spring', stiffness: 310, damping: 26 });
  };

  if (hidden) return null;

  /* ════════════════════════════════════════════════════════
     SVG DEFINITIONS FOR FILTERS
  ════════════════════════════════════════════════════════ */
  const defs = (
    <defs>
      {/* Glow filter */}
      <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3.5" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      {/* Strong glow for aura */}
      <filter id="aura" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="6" result="b1"/>
        <feGaussianBlur stdDeviation="12" result="b2"/>
        <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      {/* Soft shadow */}
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.5"/>
      </filter>
      {/* Rim light gradient for jacket */}
      <linearGradient id="rimL" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.25"/>
        <stop offset="100%" stopColor="#818cf8" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="rimR" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0"/>
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.22"/>
      </linearGradient>
    </defs>
  );

  /* ════════════════════════════════════════════════════════
     SPEED LINES (SVG radial streaks behind falling body)
  ════════════════════════════════════════════════════════ */
  const speedLines = speedLn && (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.8, 0] }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {Array.from({ length: 18 }, (_, i) => {
        const ang  = (i / 18) * Math.PI * 2;
        const r0   = 28, r1 = 80 + Math.random() * 50;
        return (
          <line key={i}
            x1={65 + Math.cos(ang) * r0} y1={120 + Math.sin(ang) * r0}
            x2={65 + Math.cos(ang) * r1} y2={120 + Math.sin(ang) * r1}
            stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round"
          />
        );
      })}
    </motion.g>
  );

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── IMPACT FLASH ── */}
      <AnimatePresence>
        {flash && (
          <motion.div key="flash"
            initial={{ opacity: 0.65 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.13 }}
            style={{ position:'fixed', inset:0, zIndex:39, background:'white', pointerEvents:'none' }}
          />
        )}
      </AnimatePresence>

      {/* ── CANVAS PARTICLES ── */}
      <canvas ref={canvasRef} style={{
        position:'fixed', inset:0, zIndex:38, pointerEvents:'none',
        width:'100%', height:'100%',
      }}/>

      {/* ── STICKMAN ── */}
      <motion.div
        ref={stickyRef}
        style={{ position:'fixed', bottom:0, right:85, zIndex:40,
          width:150, pointerEvents:'none', userSelect:'none',
          x: shakeX, y: shakeY }}
      >
        {/* BODY GROUP — whole-body fall rotates around feet (75, 220) */}
        <motion.div animate={bodyCtrl} style={{ ...TO(75, 220), willChange:'transform' }}>
          <motion.div animate={torsoCtrl} style={{ transformOrigin:'50% 55%' }}>
          <svg viewBox="0 0 150 230" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ width:'100%', height:'auto', overflow:'visible', display:'block' }}>

            {defs}

            {/* ── GROUND SHADOW ── */}
            <motion.ellipse cx="75" cy="222" rx="36" ry="7"
              fill="rgba(0,0,0,0.38)"
              animate={{ scaleX: pose==='tripped' ? 1.8 : 1, opacity: pose==='tripped' ? 0.2 : 0.38 }}
              transition={{ duration: 0.4 }}
            />

            {/* ── ENERGY AURA ── */}
            <AnimatePresence>
              {aura && (
                <motion.g key="aura-group"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.circle cx="75" cy="115" r="74" fill="none"
                    stroke={TL} strokeWidth="1.8" opacity="0.18"
                    strokeDasharray="8 6"
                    filter="url(#aura)"
                    animate={{ rotate: 360 }}
                    transition={{ repeat:Infinity, duration:6, ease:'linear' }}
                    style={{ transformOrigin:'75px 115px' }}
                  />
                  <motion.circle cx="75" cy="115" r="68" fill="none"
                    stroke="#38bdf8" strokeWidth="1" opacity="0.12"
                    strokeDasharray="4 8"
                    animate={{ rotate: -360 }}
                    transition={{ repeat:Infinity, duration:9, ease:'linear' }}
                    style={{ transformOrigin:'75px 115px' }}
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {/* ── SPEED LINES ── */}
            {speedLines}

            {/* ════ LEGS (behind jacket) ════ */}

            {/* LEFT UPPER LEG — pivot at left hip (58, 136) */}
            <motion.g animate={lULCtrl} style={TO(58, 136)}>
              <path d="M58 136 L53 183" stroke={PT}  strokeWidth="15" strokeLinecap="round"/>
              <path d="M57 136 L52 180" stroke={PTH} strokeWidth="3.5" strokeLinecap="round" opacity="0.55"/>
              {/* LEFT LOWER LEG — pivot at left knee (53, 183) */}
              <motion.g animate={lLLCtrl} style={TO(53, 183)}>
                <path d="M53 183 L50 218" stroke={PT}  strokeWidth="13" strokeLinecap="round"/>
                <path d="M52 183 L49 215" stroke={PTH} strokeWidth="3" strokeLinecap="round" opacity="0.45"/>
                <ellipse cx="43" cy="222" rx="18" ry="7"   fill={SO}/>
                <ellipse cx="40" cy="220" rx="10" ry="3.5" fill={SOH} opacity="0.7"/>
                <path d="M30 220 Q43 216 58 221" stroke="#060a18" strokeWidth="1" fill="none"/>
              </motion.g>
            </motion.g>

            {/* RIGHT UPPER LEG — pivot at right hip (92, 136) */}
            <motion.g animate={rULCtrl} style={TO(92, 136)}>
              <path d="M92 136 L97 183" stroke={PT}  strokeWidth="15" strokeLinecap="round"/>
              <path d="M91 136 L95 180" stroke={PTH} strokeWidth="3.5" strokeLinecap="round" opacity="0.55"/>
              {/* RIGHT LOWER LEG — pivot at right knee (97, 183) */}
              <motion.g animate={rLLCtrl} style={TO(97, 183)}>
                <path d="M97 183 L100 218" stroke={PT}  strokeWidth="13" strokeLinecap="round"/>
                <path d="M96 183 L99 215" stroke={PTH} strokeWidth="3" strokeLinecap="round" opacity="0.45"/>
                <ellipse cx="107" cy="222" rx="18" ry="7"   fill={SO}/>
                <ellipse cx="110" cy="220" rx="10" ry="3.5" fill={SOH} opacity="0.7"/>
                <path d="M93 221 Q107 216 122 220" stroke="#060a18" strokeWidth="1" fill="none"/>
              </motion.g>
            </motion.g>

            {/* ════ JACKET BODY ════ */}
            <path d="M33 88 L31 145 L119 145 L117 88 L98 77 L75 80 L52 77 Z" fill={JK}/>
            {/* Rim lighting overlays */}
            <path d="M33 88 L31 145 L60 145 L58 80 Z" fill="url(#rimL)" opacity="0.6"/>
            <path d="M90 80 L92 145 L119 145 L117 88 Z" fill="url(#rimR)" opacity="0.6"/>
            {/* Jacket seam lines */}
            <path d="M51 77 L47 145" stroke={JKH} strokeWidth="0.8" opacity="0.3"/>
            <path d="M99 77 L103 145" stroke={JKH} strokeWidth="0.8" opacity="0.3"/>
            <path d="M75 80 L75 145" stroke={JKH} strokeWidth="0.5" opacity="0.12"/>

            {/* Belt */}
            <rect x="31" y="140" width="88" height="8" rx="3" fill="#060810"/>
            <rect x="70" y="138" width="12" height="11" rx="2.5" fill="#b8922e"/>
            <rect x="72" y="140" width="8"  height="7"  rx="1.5" fill="#d4a93a"/>

            {/* Jacket buttons */}
            <circle cx="75" cy="133" r="2"   fill="rgba(255,255,255,0.2)"/>
            <circle cx="75" cy="120" r="2"   fill="rgba(255,255,255,0.2)"/>
            <circle cx="75" cy="107" r="2"   fill="rgba(255,255,255,0.2)"/>
            {/* button shine */}
            <circle cx="75.8" cy="132.3" r="0.7" fill="rgba(255,255,255,0.6)"/>
            <circle cx="75.8" cy="119.3" r="0.7" fill="rgba(255,255,255,0.6)"/>

            {/* Watch on left wrist (subtle detail) */}
            <rect x="21" y="138" width="10" height="7" rx="2" fill="#1a1f3c" opacity="0.9"/>
            <rect x="22" y="139" width="8"  height="5" rx="1.5" fill="#0d1020"/>
            <circle cx="26" cy="141.5" r="2" fill="#818cf8" opacity="0.5"/>

            {/* ── WHITE SHIRT V ── */}
            <path d="M52 77 L75 80 L98 77 L96 118 L75 124 L54 118 Z" fill={SH}/>
            <path d="M75 80 L75 122" stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>

            {/* ── LAPELS ── */}
            <path d="M52 77 L75 80 L33 88 L40 110 L58 97 Z" fill={LP}/>
            <path d="M98 77 L75 80 L117 88 L110 110 L92 97 Z" fill={LP}/>
            {/* lapel edge highlights */}
            <path d="M52 77 L58 97" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
            <path d="M98 77 L92 97" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>

            {/* ── POCKET SQUARE ── */}
            <path d="M96 96 L108 96 L108 105 L96 105 Z" fill="rgba(255,255,255,0.06)"/>
            <path d="M97 96 L100 89 L104 96" fill={SH}/>
            {/* lapel pin */}
            <circle cx="46" cy="100" r="2.5" fill={TL} opacity="0.8" filter="url(#glow)"/>
            <circle cx="46" cy="100" r="1.2" fill="white" opacity="0.7"/>

            {/* ── TIE — 3-SEGMENT SPRING PENDULUM ── */}
            {/* Segment 0: knot, pivots at (75, 80) */}
            <motion.g style={{ ...TO(75, 80), rotate: tie0 as any }}>
              {/* knot */}
              <path d="M72 82 L75 77 L78 82 L75 87 Z" fill={TDK}/>
              {/* Segment 1: upper blade, pivots at (75, 87) */}
              <motion.g style={{ ...TO(75, 87), rotate: tie1 as any }}>
                <path d="M72 82 L75 87 L77 107 L75 109 L73 107 Z" fill={TD}/>
                {/* Segment 2: lower blade, pivots at (75, 109) */}
                <motion.g style={{ ...TO(75, 109), rotate: tie2 as any }}>
                  <path d="M73 107 L75 109 L77 124 L75 128 L73 124 Z" fill={TL}/>
                  {/* tie tip point */}
                  <path d="M73 124 L75 128 L77 124 L75 126 Z" fill={TD}/>
                  {/* shine */}
                  <path d="M74.5 109 L74.8 123"
                    stroke="rgba(255,255,255,0.32)" strokeWidth="1" strokeLinecap="round"/>
                </motion.g>
              </motion.g>
            </motion.g>

            {/* ════ ARMS ════ */}

            {/* LEFT UPPER ARM — pivot at left shoulder (37, 86) */}
            <motion.g animate={lUACtrl} style={TO(37, 86)}>
              <path d="M37 86 L18 116"  stroke={JK}  strokeWidth="13" strokeLinecap="round"/>
              <path d="M36 86 L17.5 113" stroke={JKH} strokeWidth="3.5" strokeLinecap="round" opacity="0.45"/>
              {/* LEFT LOWER ARM — pivot at left elbow (18, 116) */}
              <motion.g animate={lLACtrl} style={TO(18, 116)}>
                <path d="M18 116 L12 137"  stroke={JK}  strokeWidth="12" strokeLinecap="round"/>
                <path d="M12 135 L11 144"  stroke={SH}  strokeWidth="9"  strokeLinecap="round"/>
                {/* cufflink */}
                <rect x="8" y="137" width="6" height="4" rx="1.5" fill={TL} opacity="0.8"/>
                {/* left hand */}
                <circle cx="10" cy="148" r="8.5" fill={SK}/>
                <path d="M4 146 Q10 142 16 146" stroke={SKD} strokeWidth="1.2" fill="none"/>
                {/* fingers */}
                <path d="M5  151 L4  158" stroke={SK} strokeWidth="3" strokeLinecap="round"/>
                <path d="M9  153 L9  160" stroke={SK} strokeWidth="3" strokeLinecap="round"/>
                <path d="M13 152 L14 159" stroke={SK} strokeWidth="3" strokeLinecap="round"/>
                <path d="M3  148 L2  154" stroke={SK} strokeWidth="2.5" strokeLinecap="round"/>
                {/* watch strap glimpse */}
              </motion.g>
            </motion.g>

            {/* RIGHT UPPER ARM — pivot at right shoulder (113, 86) */}
            <motion.g animate={rUACtrl} style={TO(113, 86)}>
              <path d="M113 86 L132 112"   stroke={JK}  strokeWidth="13" strokeLinecap="round"/>
              <path d="M112 86 L130.5 110" stroke={JKH} strokeWidth="3.5" strokeLinecap="round" opacity="0.45"/>
              {/* RIGHT LOWER ARM — pivot at right elbow (132, 112) */}
              <motion.g animate={rLACtrl} style={TO(132, 112)}>
                <path d="M132 112 L138 133"  stroke={JK}  strokeWidth="12" strokeLinecap="round"/>
                <path d="M138 131 L139 140"  stroke={SH}  strokeWidth="9"  strokeLinecap="round"/>
                {/* cufflink */}
                <rect x="135" y="133" width="6" height="4" rx="1.5" fill={TL} opacity="0.8"/>
                {/* right hand — fingers reaching for card */}
                <circle cx="140" cy="144" r="8.5" fill={SK}/>
                <path d="M134 142 Q140 138 146 142" stroke={SKD} strokeWidth="1.2" fill="none"/>
                {/* grasping fingers */}
                <path d="M135 147 L134 154" stroke={SK} strokeWidth="3" strokeLinecap="round"/>
                <path d="M139 149 L139 156" stroke={SK} strokeWidth="3" strokeLinecap="round"/>
                <path d="M143 148 L144 155" stroke={SK} strokeWidth="3" strokeLinecap="round"/>
                <path d="M147 146 L148 152" stroke={SK} strokeWidth="2.5" strokeLinecap="round"/>
              </motion.g>
            </motion.g>

            {/* ════ HEAD — pivot at (75, 46) ════ */}
            <motion.g animate={headCtrl} style={TO(75, 46)}>

              {/* Neck */}
              <rect x="71" y="65" width="9" height="17" rx="4" fill={SK}/>
              <path d="M72.5 65 L72.5 80" stroke={SKD} strokeWidth="0.8" opacity="0.45"/>

              {/* Head (slightly oval for anime style) */}
              <ellipse cx="75" cy="46" rx="22" ry="23" fill={SK}/>
              {/* subtle shading */}
              <path d="M57 38 Q75 28 93 38" fill="rgba(255,255,255,0.14)"/>
              <ellipse cx="75" cy="56" rx="16" ry="8" fill="rgba(0,0,0,0.04)"/>
              {/* jaw shadow */}
              <path d="M54 55 Q75 70 96 55 Q96 69 75 72 Q54 69 54 55" fill="rgba(0,0,0,0.07)"/>

              {/* ── HAIR ── */}
              <motion.g style={{ ...TO(75, 20), rotate: hair0 as any }}>
                {/* main hair mass */}
                <path d="M53 42 Q55 20 75 18 Q95 20 97 42"
                  stroke={HR} strokeWidth="7" fill="none" strokeLinecap="round"/>
                {/* strand 1 left */}
                <path d="M55 30 Q56 20 60 17" stroke={HR} strokeWidth="3.2" fill="none" strokeLinecap="round"/>
                {/* strand 2 right */}
                <path d="M95 30 Q94 20 90 17" stroke={HR} strokeWidth="3.2" fill="none" strokeLinecap="round"/>
                {/* top strands */}
                <path d="M75 18 Q75 11 77 8"  stroke={HR} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
                <path d="M69 19 Q67 12 64 9"  stroke={HR} strokeWidth="2"   fill="none" strokeLinecap="round"/>
                <path d="M81 19 Q83 12 86 9"  stroke={HR} strokeWidth="2"   fill="none" strokeLinecap="round"/>
                {/* hair highlight */}
                <path d="M63 26 Q70 22 78 24" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </motion.g>

              {/* ── EXPRESSIONS ── */}

              {(face === 'determined' || face === 'straining') && (
                <>
                  {/* angled determined brows */}
                  <path d="M59 38 L67 41.5" stroke={HR} strokeWidth="2.6" strokeLinecap="round"/>
                  <path d="M83 41.5 L91 38" stroke={HR} strokeWidth="2.6" strokeLinecap="round"/>
                  {/* vein on forehead when straining */}
                  {vein && (
                    <motion.path d="M68 34 Q70 32 72 34 Q70 36 68 34"
                      stroke="#e05050" strokeWidth="1.2" fill="none"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                    />
                  )}
                  {/* eyes */}
                  <ellipse cx="65" cy="48" rx="4"   ry={blink ? 0.4 : face==='straining' ? 3.2 : 4.2} fill="#14142e"/>
                  <ellipse cx="85" cy="48" rx="4"   ry={blink ? 0.4 : face==='straining' ? 3.2 : 4.2} fill="#14142e"/>
                  {!blink && (
                    <>
                      <circle cx="67"   cy="46.5" r="1.4" fill="rgba(255,255,255,0.9)"/>
                      <circle cx="87"   cy="46.5" r="1.4" fill="rgba(255,255,255,0.9)"/>
                      {/* iris */}
                      <circle cx="65.2" cy="48.2" r="1.6" fill="#5060c8" opacity="0.65"/>
                      <circle cx="85.2" cy="48.2" r="1.6" fill="#5060c8" opacity="0.65"/>
                      {/* eye glow when straining */}
                      {face === 'straining' && (
                        <>
                          <circle cx="65" cy="48" r="4.5" fill="none"
                            stroke={TL} strokeWidth="1" opacity="0.5" filter="url(#glow)"/>
                          <circle cx="85" cy="48" r="4.5" fill="none"
                            stroke={TL} strokeWidth="1" opacity="0.5" filter="url(#glow)"/>
                        </>
                      )}
                    </>
                  )}
                  {/* mouth */}
                  <path d="M66 57 Q75 62 84 57"
                    stroke="#7a4030" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  {/* small teeth visible when straining */}
                  {face === 'straining' && (
                    <>
                      <path d="M67 57 Q75 63 83 57" fill="#f8fafc" opacity="0.6"/>
                      <path d="M67 57 Q75 62 83 57 L83 59 Q75 65 67 59 Z" fill="#f8fafc"/>
                    </>
                  )}
                </>
              )}

              {face === 'shocked' && (
                <>
                  {/* arched panicked brows */}
                  <path d="M58 35 Q63 28 68 36" stroke={HR} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
                  <path d="M82 36 Q87 28 92 35" stroke={HR} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
                  {/* huge white eyes */}
                  <circle cx="65" cy="48" r="7.5" fill="white"/>
                  <circle cx="85" cy="48" r="7.5" fill="white"/>
                  <circle cx="65" cy="48" r="4.5" fill="#14142e"/>
                  <circle cx="85" cy="48" r="4.5" fill="#14142e"/>
                  <circle cx="66.5" cy="46.5" r="1.7" fill="white"/>
                  <circle cx="86.5" cy="46.5" r="1.7" fill="white"/>
                  {/* screaming O mouth with teeth */}
                  <ellipse cx="75" cy="59" rx="7"   ry="7.5"  fill="#14142e"/>
                  <ellipse cx="75" cy="62" rx="6"   ry="5"    fill="#8b2e20"/>
                  {/* top teeth */}
                  <rect x="70"  y="54" width="3" height="4" rx="0.8" fill="white"/>
                  <rect x="73.5" y="54" width="3" height="4" rx="0.8" fill="white"/>
                  <rect x="77"  y="54" width="3" height="4" rx="0.8" fill="white"/>
                  {/* tongue */}
                  <ellipse cx="75" cy="63" rx="4" ry="2.5" fill="#d44040"/>
                </>
              )}

              {face === 'tired' && (
                <>
                  {/* droopy brows */}
                  <path d="M59 40 L67 39" stroke={HR} strokeWidth="2.6" strokeLinecap="round"/>
                  <path d="M83 39 L91 40" stroke={HR} strokeWidth="2.6" strokeLinecap="round"/>
                  {/* heavy half-lidded eyes */}
                  <ellipse cx="65" cy="48" rx="4" ry="2.5" fill="#14142e"/>
                  <path d="M61 45.5 Q65 42 69 45.5"
                    stroke={SK} strokeWidth="3" fill={SK} strokeLinecap="round"/>
                  <ellipse cx="85" cy="48" rx="4" ry="2.5" fill="#14142e"/>
                  <path d="M81 45.5 Q85 42 89 45.5"
                    stroke={SK} strokeWidth="3" fill={SK} strokeLinecap="round"/>
                  {/* under-eye bags */}
                  <path d="M62 51 Q65 53 68 51" stroke={SKD} strokeWidth="1.1" fill="none" opacity="0.65"/>
                  <path d="M82 51 Q85 53 88 51" stroke={SKD} strokeWidth="1.1" fill="none" opacity="0.65"/>
                  {/* squiggly tired mouth */}
                  <path d="M66 58 Q70 56 75 59 Q80 62 84 58"
                    stroke="#7a4030" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  {/* red blush from exhaustion */}
                  <ellipse cx="58" cy="54" rx="7" ry="4" fill="#e08070" opacity="0.32"/>
                  <ellipse cx="92" cy="54" rx="7" ry="4" fill="#e08070" opacity="0.32"/>
                </>
              )}

              {/* ── SWEAT DROPS (animated, multiple) ── */}
              <AnimatePresence>
                {sweatN > 0 && Array.from({ length: sweatN }, (_, idx) => (
                  <motion.g key={`sw-${idx}-${sweatN}`}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: 26 + idx * 4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.95 + idx * 0.12, ease: 'easeIn', delay: idx * 0.18 }}
                  >
                    <path
                      d={idx === 0
                        ? 'M94 37 Q97 29 94 23 Q91 29 94 37'
                        : idx === 1
                        ? 'M89 34 Q91 28 89 24 Q87 28 89 34'
                        : 'M97 40 Q100 34 97 29 Q94 34 97 40'
                      }
                      fill="#38bdf8" opacity="0.88"
                    />
                  </motion.g>
                ))}
              </AnimatePresence>

              {/* ── "!!" COMIC TEXT ── */}
              <AnimatePresence>
                {shout && (
                  <motion.g key="shout"
                    initial={{ scale: 0.3, opacity: 0, y: 0 }}
                    animate={{ scale: 1.3, opacity: 1, y: -8 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    style={TO(75, 20)}
                  >
                    <text x="60" y="8" fontFamily="'Space Grotesk','Arial Black',sans-serif"
                      fontSize="18" fontWeight="900" fill="#fbbf24"
                      stroke="#000" strokeWidth="1.5" paintOrder="stroke">!!</text>
                  </motion.g>
                )}
              </AnimatePresence>

              {/* ── DAZED ORBITING STARS ── */}
              <AnimatePresence>
                {stars && (
                  <motion.g key="daze-stars"
                    style={TO(75, 46)}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                    initial={{ opacity: 0 }} exit={{ opacity: 0 }}
                  >
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}>
                      <text x="46"  y="12"  fontSize="16" fill="#fbbf24"
                        fontFamily="sans-serif" filter="url(#glow)">★</text>
                      <text x="88"  y="22"  fontSize="12" fill={TL}
                        fontFamily="sans-serif" filter="url(#glow)">★</text>
                      <text x="68"  y="2"   fontSize="14" fill="#38bdf8"
                        fontFamily="sans-serif" filter="url(#glow)">★</text>
                    </motion.g>
                  </motion.g>
                )}
              </AnimatePresence>

            </motion.g>{/* end head group */}

          </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── BUSINESS CARD ── */}
      <div style={{
        position:'fixed', bottom:70, right:-30,
        zIndex:40, pointerEvents:'auto', userSelect:'none',
      }}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -240, right: 0 }}
          dragElastic={{ left: 0.06, right: 0.02 }}
          style={{ x: cardX, cursor: 'grab' }}
          whileDrag={{ cursor: 'grabbing', scale: 1.05, rotate: -3 }}
          onDragEnd={onCardDragEnd}
        >
          <div style={{
            width:84, height:52, borderRadius:7,
            background:'linear-gradient(135deg,#0c1226 0%,#1a1f3c 60%,#0f172a 100%)',
            border:'1px solid rgba(129,140,248,0.44)',
            boxShadow:'0 6px 28px rgba(0,0,0,0.65),0 0 18px rgba(129,140,248,0.18),inset 0 1px 0 rgba(255,255,255,0.07)',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            gap:4, overflow:'hidden', position:'relative',
          }}>
            <div style={{
              position:'absolute', top:0, left:0, right:0, height:'45%',
              background:'linear-gradient(to bottom,rgba(255,255,255,0.06),transparent)',
              borderRadius:'7px 7px 0 0', pointerEvents:'none',
            }}/>
            <span style={{
              fontFamily:"'Space Grotesk','Segoe UI',sans-serif",
              fontSize:17, fontWeight:900,
              background:'linear-gradient(135deg,#818cf8,#38bdf8)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              letterSpacing:'-0.02em', lineHeight:1,
            }}>AC</span>
            <span style={{
              fontFamily:"'JetBrains Mono','Courier New',monospace",
              fontSize:5.5, color:'rgba(255,255,255,0.35)',
              letterSpacing:'0.18em', textTransform:'uppercase',
            }}>Business Card</span>
          </div>
          <motion.div
            animate={{ x: [-2, 2, -2] }}
            transition={{ repeat:Infinity, duration:1.3, ease:'easeInOut' }}
            style={{
              position:'absolute', left:-22, top:'50%', marginTop:-8,
              fontSize:14, color:'rgba(129,140,248,0.72)', pointerEvents:'none',
            }}
          >←</motion.div>
        </motion.div>
      </div>
    </>
  );
}
