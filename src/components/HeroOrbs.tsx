import { useEffect, useRef } from 'react';

/* ── Types ───────────────────────────────────────────────────────────── */
type RGB = readonly [number, number, number];
type Pal = { hi: RGB; mid: RGB; shd: RGB; rim: RGB };

/* Stored as fractions of ball_r so they survive canvas resize */
interface PSpec { rxF: number; ryF: number; rot: number; phase: number; spd: number; sz: number; al: number; }
interface RSpec { ang: number; rF: number; sz: number; ph: number; }

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/* ── Sphere palettes ─────────────────────────────────────────────────── */
const BEIGE: Pal = {
  hi:  [248, 240, 226],
  mid: [218, 200, 176],
  shd: [178, 158, 132],
  rim: [138, 118,  96],
};
const BLANC: Pal = {
  hi:  [252, 248, 242],
  mid: [236, 230, 220],
  shd: [202, 196, 186],
  rim: [162, 156, 148],
};

/* ── Particle colors ─────────────────────────────────────────────────── */
const P_AMBER: RGB = [230, 188,  98];
const P_AGLOW: RGB = [255, 215, 130];
const P_CREAM: RGB = [210, 206, 194];
const P_CGLOW: RGB = [240, 235, 222];

/* ── Ring constants ──────────────────────────────────────────────────── */
const RING_ROT  =  0.54;   // tilt angle ~31° — matches "side ring leaning at an angle"
const RING_NY   =  0.09;   // ry/rx — very edge-on (Saturn-like)
const RING_IN_F =  1.72;   // inner edge as fraction of ball_r
const RING_OUT_F = 2.55;   // outer edge as fraction of ball_r
const RING_N    =  110;    // particle count in ring

/* ── Particle generators (called once on mount) ──────────────────────── */
function genParticles(count: number): PSpec[] {
  return Array.from({ length: count }, () => {
    const tilt = Math.random();  // 0 = edge-on, 1 = face-on
    return {
      rxF:   1.15 + Math.random() * 1.30,       // orbital radius fraction
      ryF:   (0.05 + tilt * 0.50),              // tilt determines squish
      rot:   Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      spd:   (0.18 + Math.random() * 0.85) * (Math.random() > 0.5 ? 1 : -1),
      sz:    1.0 + Math.random() * 2.8,
      al:    0.30 + Math.random() * 0.70,
    };
  });
}

function genRing(): RSpec[] {
  return Array.from({ length: RING_N }, (_, i) => ({
    ang: (i / RING_N) * Math.PI * 2 + (Math.random() - 0.5) * 0.12,
    rF:  RING_IN_F + Math.random() * (RING_OUT_F - RING_IN_F),
    sz:  0.6 + Math.random() * 1.8,
    ph:  Math.random() * Math.PI * 2,  // shimmer phase
  }));
}

/* ── Draw helpers ────────────────────────────────────────────────────── */
function drawOrbGlow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c: RGB) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0,   rgba(c, 0.20));
  g.addColorStop(0.5, rgba(c, 0.07));
  g.addColorStop(1,   rgba(c, 0));
  ctx.save();
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSphere(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, pal: Pal, glow: RGB) {
  /* Wide glow */
  drawOrbGlow(ctx, x, y, r * 2.8, glow);

  /* Main shading — light from top-left */
  ctx.save();
  ctx.shadowBlur  = r * 2.0;
  ctx.shadowColor = rgba(pal.mid, 0.60);
  const g = ctx.createRadialGradient(x - r * 0.28, y - r * 0.26, r * 0.03, x, y, r);
  g.addColorStop(0,    rgba(pal.hi,  0.98));
  g.addColorStop(0.26, rgba(pal.mid, 0.95));
  g.addColorStop(0.58, rgba(pal.shd, 0.90));
  g.addColorStop(0.82, rgba(pal.rim, 0.84));
  g.addColorStop(1,    rgba([pal.rim[0]-28, pal.rim[1]-28, pal.rim[2]-20] as unknown as RGB, 0.70));
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();

  /* Specular highlight */
  ctx.save();
  const sh = ctx.createRadialGradient(x - r * 0.40, y - r * 0.40, 0, x - r * 0.28, y - r * 0.28, r * 0.52);
  sh.addColorStop(0, 'rgba(255,252,248,0.58)');
  sh.addColorStop(1, 'rgba(255,252,248,0)');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = sh;
  ctx.fill();
  ctx.restore();

  /* AO rim */
  ctx.save();
  const rim = ctx.createRadialGradient(x, y, r * 0.80, x, y, r);
  rim.addColorStop(0, 'rgba(0,0,0,0)');
  rim.addColorStop(1, 'rgba(0,0,0,0.30)');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = rim;
  ctx.fill();
  ctx.restore();
}

/* Draw one orbital particle — returns screen position for depth sort */
function particlePos(p: PSpec, cx: number, cy: number, r: number, t: number): [number, number] {
  const angle = p.phase + t * p.spd;
  const rx = p.rxF * r;
  const ry = p.ryF * rx;
  const ex  = rx * Math.cos(angle);
  const ey  = ry * Math.sin(angle);
  return [
    cx + ex * Math.cos(p.rot) - ey * Math.sin(p.rot),
    cy + ex * Math.sin(p.rot) + ey * Math.cos(p.rot),
  ];
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  sz: number, al: number,
  col: RGB, glow: RGB,
) {
  if (al < 0.04) return;
  ctx.save();
  ctx.globalAlpha = al;
  ctx.shadowBlur  = sz * 5;
  ctx.shadowColor = rgba(glow, 0.85);
  const pg = ctx.createRadialGradient(px, py, 0, px, py, sz * 2.0);
  pg.addColorStop(0, rgba(glow, 1));
  pg.addColorStop(0.5, rgba(col, 0.8));
  pg.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = pg;
  ctx.beginPath();
  ctx.arc(px, py, sz * 2.0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/*
 * Saturn-style ring around ball 2.
 * Drawn in two passes for depth sorting:
 *   pass='back'  → arc that goes BEHIND the sphere  (draw before sphere)
 *   pass='front' → arc that sweeps IN FRONT          (draw after sphere)
 *
 * The ring consists of pre-generated particles scattered within a radial band.
 */
function drawRing(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  ball_r: number,
  ring: RSpec[],
  t: number,
  pass: 'back' | 'front',
) {
  /* Also draw two faint solid ellipse strokes as the ring plane */
  for (let band = 0; band < 3; band++) {
    const rr = ball_r * (RING_IN_F + band * ((RING_OUT_F - RING_IN_F) / 2));
    const ry = rr * RING_NY;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(RING_ROT);
    ctx.beginPath();
    if (pass === 'back') {
      ctx.ellipse(0, 0, rr, ry, 0, 0, Math.PI);
    } else {
      ctx.ellipse(0, 0, rr, ry, 0, Math.PI, Math.PI * 2);
    }
    ctx.strokeStyle = `rgba(235,220,195,${pass === 'front' ? 0.22 : 0.07})`;
    ctx.lineWidth   = ball_r * 0.055;
    ctx.stroke();
    ctx.restore();
  }

  /* Particle scatter inside the ring band */
  ring.forEach((rp) => {
    const angle = rp.ang + t * 0.035;   // very slow ring rotation
    const rx    = rp.rF * ball_r;
    const ry    = rx * RING_NY;

    /* Rotated ellipse point */
    const ex  = rx * Math.cos(angle);
    const ey  = ry * Math.sin(angle);
    const px  = cx + ex * Math.cos(RING_ROT) - ey * Math.sin(RING_ROT);
    const py  = cy + ex * Math.sin(RING_ROT) + ey * Math.cos(RING_ROT);

    /* Depth gate — which half of the ring */
    if (pass === 'back'  && py >= cy) return;
    if (pass === 'front' && py  < cy) return;

    const shimmer = 0.55 + 0.45 * Math.sin(t * 1.8 + rp.ph);
    const alpha   = (pass === 'front' ? 0.68 : 0.20) * shimmer;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowBlur  = rp.sz * 3;
    ctx.shadowColor = 'rgba(248,235,205,0.8)';
    ctx.fillStyle   = 'rgba(245,232,210,1)';
    ctx.beginPath();
    ctx.arc(px, py, rp.sz, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

/* Background stars */
function drawStars(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  stars: Array<{ x: number; y: number; r: number; ph: number; spd: number }>,
  t: number,
) {
  stars.forEach((s) => {
    ctx.save();
    ctx.globalAlpha = 0.06 + 0.08 * Math.sin(t * s.spd + s.ph);
    ctx.fillStyle   = '#fff';
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

/* ── Component ───────────────────────────────────────────────────────── */
export default function HeroOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  /* Pre-generated stables arrays — generated once, survive renders */
  const p1Ref   = useRef<PSpec[]>([]);
  const p2Ref   = useRef<PSpec[]>([]);
  const ringRef = useRef<RSpec[]>([]);
  const starsRef = useRef<Array<{ x: number; y: number; r: number; ph: number; spd: number }>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    /* Generate stable random data once */
    p1Ref.current   = genParticles(20);
    p2Ref.current   = genParticles(14);
    ringRef.current  = genRing();
    starsRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 0.9 + 0.2,
      ph:  Math.random() * Math.PI * 2,
      spd: Math.random() * 0.45 + 0.2,
    }));

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ScrollTrigger */
    let stKill: (() => void) | null = null;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        const wrapper = canvas.closest('[data-scene]') as HTMLElement | null;
        if (!wrapper) return;
        const st = ScrollTrigger.create({
          trigger: wrapper,
          start: 'top top',
          end:   'bottom bottom',
          onUpdate: (self: { progress: number }) => { scrollRef.current = self.progress; },
        });
        stKill = () => st.kill();
      },
    );

    /* ── Main render loop ───────────────────────────────────────────── */
    const render = (time: number) => {
      const W = canvas.width;
      const H = canvas.height;
      const t = time * 0.001;

      ctx.clearRect(0, 0, W, H);

      const isMobile = W < 640;

      /* Ball geometry */
      const b1r  = Math.max(30, Math.min(W, H) * (isMobile ? 0.80 : 0.46));
      const b1cx = W + b1r / 3;
      const b1cy = W * (isMobile ? 0.28 : 0.26);

      const b2r  = Math.max(22, Math.min(W, H) * (isMobile ? 0.58 : 0.34));
      const b2cx = -b2r / 3;
      const b2cy = H - W * (isMobile ? 0.22 : 0.28);

      const scrollBump = scrollRef.current * Math.PI * 0.5;
      const t1 = t * 0.10 + scrollBump;

      drawStars(ctx, W, H, starsRef.current, t);

      /* ─── Ball 1: beige, upper-right ──────────────────────────── */
      const p1 = p1Ref.current;

      /* Back-pass particles (appear behind sphere — py < b1cy) */
      p1.forEach((p) => {
        const [px, py] = particlePos(p, b1cx, b1cy, b1r, t1);
        if (py < b1cy) drawParticle(ctx, px, py, p.sz, p.al * 0.55, P_AMBER, P_AGLOW);
      });

      drawSphere(ctx, b1cx, b1cy, b1r, BEIGE, [220, 190, 145] as RGB);

      /* Front-pass particles */
      p1.forEach((p) => {
        const [px, py] = particlePos(p, b1cx, b1cy, b1r, t1);
        if (py >= b1cy) drawParticle(ctx, px, py, p.sz, p.al, P_AMBER, P_AGLOW);
      });

      /* ─── Ball 2: blanc cassé, lower-left + Saturn ring ──────── */
      const p2   = p2Ref.current;
      const ring = ringRef.current;

      /* Ring back half (behind sphere) */
      drawRing(ctx, b2cx, b2cy, b2r, ring, t, 'back');

      /* Back-pass particles */
      p2.forEach((p) => {
        const [px, py] = particlePos(p, b2cx, b2cy, b2r, t1 * 0.8);
        if (py < b2cy) drawParticle(ctx, px, py, p.sz, p.al * 0.50, P_CREAM, P_CGLOW);
      });

      drawSphere(ctx, b2cx, b2cy, b2r, BLANC, [232, 228, 218] as RGB);

      /* Front-pass particles */
      p2.forEach((p) => {
        const [px, py] = particlePos(p, b2cx, b2cy, b2r, t1 * 0.8);
        if (py >= b2cy) drawParticle(ctx, px, py, p.sz, p.al, P_CREAM, P_CGLOW);
      });

      /* Ring front half (in front of sphere — most visible arc) */
      drawRing(ctx, b2cx, b2cy, b2r, ring, t, 'front');

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      stKill?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
    />
  );
}
