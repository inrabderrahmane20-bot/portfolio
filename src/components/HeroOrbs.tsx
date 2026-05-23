import { useEffect, useRef } from 'react';

type RGB = readonly [number, number, number];
type Pal = { hi: RGB; mid: RGB; rim: RGB };

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

const BEIGE: Pal = { hi: [248, 240, 226], mid: [218, 200, 176], rim: [140, 120,  98] };
const BLANC: Pal = { hi: [252, 248, 242], mid: [236, 230, 220], rim: [162, 156, 148] };

const P_AMBER: RGB = [230, 188, 98];
const P_CREAM: RGB = [210, 206, 194];

const RING_ROT   = 0.54;
const RING_NY    = 0.09;
const RING_IN_F  = 1.72;
const RING_OUT_F = 2.55;

interface PSpec { rxF: number; ryF: number; rot: number; phase: number; spd: number; sz: number; al: number; }
interface RSpec { ang: number; rF: number; sz: number; ph: number; }

function genParticles(n: number): PSpec[] {
  return Array.from({ length: n }, () => {
    const tilt = Math.random();
    return {
      rxF:   1.15 + Math.random() * 1.30,
      ryF:   0.05 + tilt * 0.50,
      rot:   Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      spd:   (0.18 + Math.random() * 0.85) * (Math.random() > 0.5 ? 1 : -1),
      sz:    1.0 + Math.random() * 2.4,
      al:    0.30 + Math.random() * 0.60,
    };
  });
}

function genRing(n: number): RSpec[] {
  return Array.from({ length: n }, (_, i) => ({
    ang: (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.12,
    rF:  RING_IN_F + Math.random() * (RING_OUT_F - RING_IN_F),
    sz:  0.5 + Math.random() * 1.4,
    ph:  Math.random() * Math.PI * 2,
  }));
}

function drawSphere(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, pal: Pal) {
  const g = ctx.createRadialGradient(x - r * 0.28, y - r * 0.26, r * 0.04, x, y, r);
  g.addColorStop(0, rgba(pal.hi, 0.96));
  g.addColorStop(0.55, rgba(pal.mid, 0.90));
  g.addColorStop(1,  rgba(pal.rim, 0.65));
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  const sx = x - r * 0.38, sy = y - r * 0.38, sr = r * 0.18;
  const sh = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
  sh.addColorStop(0, 'rgba(255,252,248,0.50)');
  sh.addColorStop(1, 'rgba(255,252,248,0)');
  ctx.beginPath();
  ctx.arc(sx, sy, sr, 0, Math.PI * 2);
  ctx.fillStyle = sh;
  ctx.fill();
}

function drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c: RGB) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0,   rgba(c, 0.12));
  g.addColorStop(0.5, rgba(c, 0.04));
  g.addColorStop(1,   rgba(c, 0));
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
}

function drawParticlePts(
  ctx: CanvasRenderingContext2D,
  parts: PSpec[], cx: number, cy: number, r: number,
  col: RGB, t: number, side: 'back' | 'front',
) {
  parts.forEach(p => {
    const a = p.phase + t * p.spd;
    const rx = p.rxF * r, ry = p.ryF * rx;
    const ex = rx * Math.cos(a), ey = ry * Math.sin(a);
    const px = cx + ex * Math.cos(p.rot) - ey * Math.sin(p.rot);
    const py = cy + ex * Math.sin(p.rot) + ey * Math.cos(p.rot);
    if (side === 'back'  && py >= cy) return;
    if (side === 'front' && py  < cy) return;
    const alpha = p.al * 0.85;
    if (alpha < 0.04) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = rgba(col, 1);
    ctx.beginPath();
    ctx.arc(px, py, Math.max(0.5, p.sz), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawRing(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, ball_r: number,
  ring: RSpec[], t: number, pass: 'back' | 'front',
  isMobile: boolean,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(RING_ROT);
  for (let b = 0; b < 2; b++) {
    const rr = ball_r * (RING_IN_F + b * 0.4);
    ctx.beginPath();
    ctx.ellipse(0, 0, rr, rr * RING_NY,
      0, pass === 'back' ? 0 : Math.PI, pass === 'back' ? Math.PI : Math.PI * 2);
    ctx.strokeStyle = `rgba(235,220,195,${pass === 'front' ? 0.18 : 0.06})`;
    ctx.lineWidth   = ball_r * 0.045;
    ctx.stroke();
  }
  ctx.restore();

  if (isMobile) return;

  ring.forEach(rp => {
    const angle = rp.ang + t * 0.030;
    const rx = rp.rF * ball_r, ry = rx * RING_NY;
    const ex = rx * Math.cos(angle), ey = ry * Math.sin(angle);
    const px = cx + ex * Math.cos(RING_ROT) - ey * Math.sin(RING_ROT);
    const py = cy + ex * Math.sin(RING_ROT) + ey * Math.cos(RING_ROT);
    if (pass === 'back'  && py >= cy) return;
    if (pass === 'front' && py  < cy) return;
    const shimmer = 0.50 + 0.50 * Math.sin(t * 1.6 + rp.ph);
    ctx.globalAlpha = (pass === 'front' ? 0.55 : 0.16) * shimmer;
    ctx.fillStyle   = 'rgba(245,232,210,1)';
    ctx.beginPath();
    ctx.arc(px, py, rp.sz, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

export default function HeroOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const p1Ref     = useRef<PSpec[]>([]);
  const p2Ref     = useRef<PSpec[]>([]);
  const ringRef   = useRef<RSpec[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMob = window.innerWidth < 640;
    p1Ref.current   = genParticles(isMob ? 6 : 12);
    p2Ref.current   = genParticles(isMob ? 5 : 10);
    ringRef.current = genRing(isMob ? 0 : 50);

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d', { alpha: true })!;
    let animId: number;
    let lastT    = 0;
    const FPS    = isMob ? 24 : 40;
    const FRAME  = 1000 / FPS;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let stKill: (() => void) | null = null;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      const wrapper = canvas.closest('[data-scene]') as HTMLElement | null;
      if (!wrapper) return;
      const st = ScrollTrigger.create({
        trigger: wrapper, start: 'top top', end: 'bottom bottom',
        onUpdate: (s: { progress: number }) => { scrollRef.current = s.progress; },
      });
      stKill = () => st.kill();
    });

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (time - lastT < FRAME) return;
      lastT = time;

      const W = canvas.width, H = canvas.height;
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      const isMobile = W < 640;
      const b1r  = Math.max(28, Math.min(W, H) * (isMobile ? 0.76 : 0.46));
      const b1cx = W + b1r / 3;
      const b1cy = W * 0.26;
      const b2r  = Math.max(20, Math.min(W, H) * (isMobile ? 0.56 : 0.34));
      const b2cx = -b2r / 3;
      const b2cy = H - W * 0.28;

      const scroll = scrollRef.current * Math.PI * 0.5;
      const t1     = t * 0.10 + scroll;

      drawGlow(ctx, b1cx, b1cy, b1r * 3.5, BEIGE.mid);
      drawParticlePts(ctx, p1Ref.current, b1cx, b1cy, b1r, P_AMBER, t1, 'back');
      drawSphere(ctx, b1cx, b1cy, b1r, BEIGE);
      drawParticlePts(ctx, p1Ref.current, b1cx, b1cy, b1r, P_AMBER, t1, 'front');

      drawGlow(ctx, b2cx, b2cy, b2r * 3.5, BLANC.mid);
      drawRing(ctx, b2cx, b2cy, b2r, ringRef.current, t, 'back',  isMobile);
      drawParticlePts(ctx, p2Ref.current, b2cx, b2cy, b2r, P_CREAM, t1 * 0.8, 'back');
      drawSphere(ctx, b2cx, b2cy, b2r, BLANC);
      drawParticlePts(ctx, p2Ref.current, b2cx, b2cy, b2r, P_CREAM, t1 * 0.8, 'front');
      drawRing(ctx, b2cx, b2cy, b2r, ringRef.current, t, 'front', isMobile);
    };

    animId = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); stKill?.(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{ willChange: 'transform' }}
    />
  );
}
