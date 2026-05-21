import { useEffect, useRef } from 'react';

/* ── Types ───────────────────────────────────────────────────────────── */
type RGB = readonly [number, number, number];
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/* ── Sphere palettes ─────────────────────────────────────────────────── */
const BEIGE = {
  hi:  [248, 240, 226] as const,  // bright highlight — warm parchment
  mid: [218, 200, 176] as const,  // main body — warm beige
  shd: [178, 158, 132] as const,  // shadow side
  rim: [138, 118,  96] as const,  // deep rim shadow
};
const BLANC = {
  hi:  [252, 248, 242] as const,  // bright highlight — near-white
  mid: [236, 230, 220] as const,  // body — blanc cassé
  shd: [202, 196, 186] as const,  // shadow
  rim: [162, 156, 148] as const,  // rim
};

/* ── Particle colors ─────────────────────────────────────────────────── */
const P_AMBER: RGB = [230, 188,  98];  // warm amber — orbiting B1
const P_CREAM: RGB = [212, 206, 194];  // cool cream — orbiting B2

/* ── Sphere palette type ─────────────────────────────────────────────── */
type Pal = { hi: RGB; mid: RGB; shd: RGB; rim: RGB };

/* ── Draw a realistic sphere (clipped to canvas bounds naturally) ────── */
function drawSphere(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  pal: Pal,
  glowColor: RGB,
) {
  /* 1. Wide atmospheric glow */
  const glow = ctx.createRadialGradient(cx, cy, r * 0.75, cx, cy, r * 2.8);
  glow.addColorStop(0,   rgba(glowColor, 0.10));
  glow.addColorStop(0.5, rgba(glowColor, 0.04));
  glow.addColorStop(1,   rgba(glowColor, 0));
  ctx.save();
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* 2. Main sphere shading — light source top-left */
  const hx = cx - r * 0.28, hy = cy - r * 0.26;
  const g = ctx.createRadialGradient(hx, hy, r * 0.02, cx, cy, r);
  g.addColorStop(0,    rgba(pal.hi,  0.98));
  g.addColorStop(0.26, rgba(pal.mid, 0.95));
  g.addColorStop(0.58, rgba(pal.shd, 0.90));
  g.addColorStop(0.82, rgba(pal.rim, 0.84));
  g.addColorStop(1,    rgba([Math.max(0, pal.rim[0] - 30), Math.max(0, pal.rim[1] - 30), Math.max(0, pal.rim[2] - 25)] as unknown as RGB, 0.72));
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();

  /* 3. Specular highlight — sharp, offset from centre */
  const sh = ctx.createRadialGradient(
    cx - r * 0.40, cy - r * 0.40, 0,
    cx - r * 0.28, cy - r * 0.28, r * 0.52,
  );
  sh.addColorStop(0, 'rgba(255,252,248,0.62)');
  sh.addColorStop(1, 'rgba(255,252,248,0)');
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = sh;
  ctx.fill();
  ctx.restore();

  /* 4. Ambient-occlusion rim darkening */
  const rim = ctx.createRadialGradient(cx, cy, r * 0.80, cx, cy, r);
  rim.addColorStop(0, 'rgba(0,0,0,0)');
  rim.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = rim;
  ctx.fill();
  ctx.restore();
}

/*
 * Snake-climbing-tree-branch orbital particles.
 *
 * "branch"  = the orbital ellipse around the massive sphere.
 * "snake"   = N particles trailing the lead particle along that ellipse, each
 *             displaced PERPENDICULAR to the local tangent by a sinusoidal
 *             envelope — exactly the weaving motion of a snake on a branch.
 *
 * `side`: 'back' draws particles above sphere centre (behind it in 3-D),
 *         'front' draws particles below sphere centre (in front of it).
 */
function drawSnake(
  ctx: CanvasRenderingContext2D,
  /* orbit ellipse */
  cx: number, cy: number, rx: number, ry: number,
  /* lead angle of orbit */
  leadAngle: number,
  /* animation time */
  t: number,
  /* colours */
  col: RGB, glow: RGB,
  /* sphere radius (for sizing) */
  sphereR: number,
  /* depth pass */
  side: 'back' | 'front',
) {
  const N      = 32;
  const TRAIL  = 1.85;           // radians of orbit the snake spans
  const WAVES  = 2.6;             // sine cycles across the trail
  const AMP    = sphereR * 0.055; // perpendicular oscillation amplitude

  for (let i = N; i >= 0; i--) {
    const frac = i / N;
    const a    = leadAngle - frac * TRAIL;

    const bx  = cx + rx * Math.cos(a);
    const by  = cy + ry * Math.sin(a);

    /* depth filter — only render appropriate half */
    if (side === 'back'  && by >= cy) continue;
    if (side === 'front' && by < cy)  continue;

    /* tangent of ellipse at angle a */
    const dtx  = -rx * Math.sin(a);
    const dty  =  ry * Math.cos(a);
    const tlen = Math.sqrt(dtx * dtx + dty * dty) || 1;
    const tnx  = dtx / tlen;
    const tny  = dty / tlen;

    /* normal = 90° rotation of tangent */
    const nx = tny, ny = -tnx;

    /* snake wave */
    const env    = Math.sin(frac * Math.PI);
    const phase  = t * 2.2 + frac * WAVES * Math.PI * 2;
    const offset = AMP * env * Math.sin(phase);

    const px = bx + offset * nx;
    const py = by + offset * ny;

    const fade  = Math.pow(1 - frac, 0.55);
    const pSize = sphereR * 0.018 * Math.pow(fade, 0.65) + 0.6;
    const alpha = 0.90 * fade;
    if (alpha < 0.02 || pSize < 0.3) continue;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowBlur  = pSize * 5;
    ctx.shadowColor = rgba(glow, 0.85);

    const pg = ctx.createRadialGradient(px, py, 0, px, py, pSize * 2.2);
    pg.addColorStop(0, rgba(glow, 1));
    pg.addColorStop(0.5, rgba(col, 0.8));
    pg.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(px, py, pSize * 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* Faint elliptical orbit ring visible in the arc that crosses the screen */
function drawOrbitRing(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, rx: number, ry: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 18]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

/* Background star field */
function drawStars(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  stars: Array<{ x: number; y: number; r: number; phase: number; spd: number }>,
  t: number,
) {
  for (const s of stars) {
    const a = 0.06 + 0.07 * Math.sin(t * s.spd + s.phase);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* ── Component ───────────────────────────────────────────────────────── */
export default function HeroOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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

    /* Star field */
    const STARS = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
      spd:   Math.random() * 0.4 + 0.2,
    }));

    /* ScrollTrigger — drives a small angular offset as user scrolls the combined section */
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

    /* ── Render loop ────────────────────────────────────────────────── */
    const render = (time: number) => {
      const W = canvas.width;
      const H = canvas.height;
      const t = time * 0.001;

      ctx.clearRect(0, 0, W, H);

      /* ── Ball geometry (fractions of W) ──
       *
       * Ball 1: large, beige — peeking from upper-right
       *   radius = 0.46W
       *   centre at x = W + R/3 → only ~1/3 of diameter visible from right
       *   centre at y = 0.26W (upper third of hero)
       *
       * Ball 2: smaller, blanc cassé — peeking from lower-left
       *   radius = 0.34W
       *   centre at x = -R/3 → ~1/3 visible from left
       *   centre at y = H − 0.28W (lower area, in services section)
       */
      const b1r  = W * 0.46;
      const b1cx = W + b1r / 3;      // 1/3 diameter visible from right
      const b1cy = W * 0.26;

      const b2r  = W * 0.34;
      const b2cx = -b2r / 3;         // 1/3 diameter visible from left
      const b2cy = H - W * 0.28;     // lower section

      /* Orbit ellipses — slightly outside the sphere radius, perspective-flattened */
      const o1rx = b1r * 1.14;
      const o1ry = o1rx * 0.28;

      const o2rx = b2r * 1.14;
      const o2ry = o2rx * 0.28;

      /* Lead angle: slow constant rotation + subtle scroll push */
      const scrollOffset = scrollRef.current * Math.PI * 0.6;
      const lead1 = t * 0.18 + scrollOffset;
      const lead2 = -(t * 0.14 + scrollOffset);  // counter-rotate

      /* ── Draw ── */
      drawStars(ctx, W, H, STARS, t);

      /* Orbit rings (visible arc only — canvas clips naturally) */
      drawOrbitRing(ctx, b1cx, b1cy, o1rx, o1ry);
      drawOrbitRing(ctx, b2cx, b2cy, o2rx, o2ry);

      /* Back-arc particles (behind spheres) */
      drawSnake(ctx, b1cx, b1cy, o1rx, o1ry, lead1, t, P_AMBER, [255, 220, 150] as RGB, b1r, 'back');
      drawSnake(ctx, b2cx, b2cy, o2rx, o2ry, lead2, t, P_CREAM, [240, 235, 225] as RGB, b2r, 'back');

      /* Spheres (drawn after back-arc so front-arc overlaps) */
      drawSphere(ctx, b1cx, b1cy, b1r, BEIGE, [220, 190, 145] as RGB);
      drawSphere(ctx, b2cx, b2cy, b2r, BLANC, [232, 228, 218] as RGB);

      /* Front-arc particles (in front of spheres) */
      drawSnake(ctx, b1cx, b1cy, o1rx, o1ry, lead1, t, P_AMBER, [255, 220, 150] as RGB, b1r, 'front');
      drawSnake(ctx, b2cx, b2cy, o2rx, o2ry, lead2, t, P_CREAM, [240, 235, 225] as RGB, b2r, 'front');

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
