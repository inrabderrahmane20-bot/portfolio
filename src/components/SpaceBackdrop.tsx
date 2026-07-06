import { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   DEEP-FIELD BACKDROP — one fixed canvas behind every page:
   1. Parallax starfield (3 depth layers, twinkle, halos, shooting stars)
   2. The Globe — a shaded network planet: continent-seeded node cloud,
      K-nearest wireframe, day/night terminator, graticule, atmosphere rim,
      travelling data pulses, and three satellites on inclined orbits.
   Rotation and drift are scroll-coupled. DPR-capped, reduced-motion aware.
═══════════════════════════════════════════════════════════════════════ */

type V3 = [number, number, number];

const toRad = (d: number) => (d * Math.PI) / 180;
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function ll2v(lat: number, lon: number): V3 {
  const a = toRad(lat), b = toRad(lon);
  return [Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)];
}
function rotY(v: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0] * c - v[2] * s, v[1], v[0] * s + v[2] * c];
}
function rotZ(v: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
}
function norm3(v: V3): V3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}
function cross3(a: V3, b: V3): V3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

/* ── Continent zones [latMin, latMax, lonMin, lonMax, nodes] ─────────── */
const ZONES: [number, number, number, number, number][] = [
  [ 22, 70, -165, -55, 52],  // North America
  [-56, 12,  -81, -35, 34],  // South America
  [ 36, 70,  -11,  40, 36],  // Europe
  [-34, 36,  -17,  50, 42],  // Africa
  [ 12, 74,   28,  90, 34],  // West / Central Asia
  [ -9, 55,   92, 145, 40],  // East / SE Asia
  [-44, -11, 113, 154, 20],  // Australia
  [-78, 78, -180, 180, 30],  // ocean scatter
];

interface GlobeData {
  nodes: V3[];
  land: boolean[];
  edges: [number, number][];
  sats: { u: V3; w: V3; r: number; speed: number; phase: number }[];
}

function buildGlobe(scale: number): GlobeData {
  const nodes: V3[] = [];
  const land: boolean[] = [];
  ZONES.forEach(([la0, la1, lo0, lo1, n], zi) => {
    const count = Math.max(6, Math.round(n * scale));
    for (let i = 0; i < count; i++) {
      nodes.push(ll2v(la0 + Math.random() * (la1 - la0), lo0 + Math.random() * (lo1 - lo0)));
      land.push(zi < ZONES.length - 1);
    }
  });

  /* K-nearest edges among land nodes, capped to short arcs */
  const edges: [number, number][] = [];
  const seen = new Set<number>();
  const N = nodes.length;
  for (let i = 0; i < N; i++) {
    if (!land[i]) continue;
    const near = Array.from({ length: N }, (_, j) => j)
      .filter(j => j !== i && land[j])
      .sort((a, b) => dot3(nodes[b], nodes[i]) - dot3(nodes[a], nodes[i]))
      .slice(0, 3);
    for (const j of near) {
      if (dot3(nodes[i], nodes[j]) < 0.82) continue; // skip long chords
      const key = i < j ? i * N + j : j * N + i;
      if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
    }
  }

  /* Satellites — inclined circular orbits (orthonormal basis per orbit) */
  const sats = [1.28, 1.42, 1.58].map((r, i) => {
    const axis = norm3([Math.sin(i * 2.1) * 0.8, 1, Math.cos(i * 1.7) * 0.9] as V3);
    const u = norm3(cross3(axis, [0, 0, 1] as V3));
    const w = norm3(cross3(axis, u));
    return { u, w, r, speed: (0.00016 + i * 0.00007) * (i % 2 ? -1 : 1), phase: i * 2.2 };
  });

  return { nodes, land, edges, sats };
}

interface Star { x: number; y: number; z: number; r: number; tw: number; hue: 'white' | 'indigo' | 'cyan'; }
interface Comet { x: number; y: number; vx: number; vy: number; life: number; max: number; }
interface Pulse { edge: number; t: number; spd: number; }

const STAR_COLORS = {
  white:  (a: number) => `rgba(238,241,255,${a})`,
  indigo: (a: number) => `rgba(165,180,252,${a})`,
  cyan:   (a: number) => `rgba(125,211,252,${a})`,
};

export default function SpaceBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let W = 0, H = 0, isMob = false;
    let stars: Star[] = [];
    let comets: Comet[] = [];
    let lastComet = 0;
    let globe: GlobeData = buildGlobe(1);
    let pulses: Pulse[] = [];

    const LIGHT = norm3([-0.55, 0.4, 0.72] as V3);
    const TILT = toRad(23.4);

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      isMob = W < 640;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: isMob ? 80 : 160 }, () => ({
        x: Math.random(), y: Math.random(), z: Math.random(),
        r: 0.4 + Math.random() * 1.1,
        tw: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.72 ? 'white' : Math.random() < 0.6 ? 'indigo' : 'cyan',
      }));

      globe = buildGlobe(isMob ? 0.5 : 1);
      pulses = [];
    };

    /* ── Stars ─────────────────────────────────────────────────────── */
    const drawStars = (t: number, scroll: number) => {
      const time = t * 0.0012;
      for (const s of stars) {
        const py = (((s.y * H - scroll * (0.02 + s.z * 0.09)) % H) + H) % H;
        const px = s.x * W;
        const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(time + s.tw));
        const alpha = (0.16 + s.z * 0.5) * twinkle;
        ctx.beginPath();
        ctx.arc(px, py, s.r + s.z * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = STAR_COLORS[s.hue](alpha);
        ctx.fill();
        if (s.z > 0.85) {
          ctx.beginPath();
          ctx.arc(px, py, (s.r + 1.6) * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = STAR_COLORS[s.hue](alpha * 0.08);
          ctx.fill();
        }
      }
    };

    /* ── Shooting stars ────────────────────────────────────────────── */
    const drawComets = (t: number) => {
      if (t - lastComet > 6000 + Math.random() * 5000 && comets.length < 2) {
        lastComet = t;
        const fromLeft = Math.random() < 0.5;
        comets.push({
          x: fromLeft ? -40 : W * (0.4 + Math.random() * 0.6),
          y: H * Math.random() * 0.4,
          vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 5),
          vy: 2.4 + Math.random() * 2,
          life: 0, max: 60 + Math.random() * 30,
        });
      }
      comets = comets.filter(c => c.life < c.max && c.x > -80 && c.x < W + 80 && c.y < H + 80);
      for (const c of comets) {
        c.life++; c.x += c.vx; c.y += c.vy;
        const fade = Math.sin((c.life / c.max) * Math.PI);
        const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 9, c.y - c.vy * 9);
        grad.addColorStop(0, `rgba(190,225,255,${0.85 * fade})`);
        grad.addColorStop(1, 'rgba(129,140,248,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x - c.vx * 9, c.y - c.vy * 9);
        ctx.stroke();
      }
    };

    /* ── The Globe ─────────────────────────────────────────────────── */
    const drawGlobe = (t: number, scroll: number) => {
      const R = Math.min(W, H) * (isMob ? 0.44 : 0.36);
      const cx = isMob ? W * 0.72 : W * 0.80;
      const cy = (isMob ? H * 0.66 : H * 0.56) + Math.sin(t * 0.00012) * 10;
      const theta = t * 0.000042 + scroll * 0.00055; // spin + scroll coupling
      const dim = isMob ? 0.8 : 1;

      const N = globe.nodes.length;
      const px = new Float32Array(N);
      const py = new Float32Array(N);
      const pz = new Float32Array(N);
      const shade = new Float32Array(N);

      for (let i = 0; i < N; i++) {
        const v = rotZ(rotY(globe.nodes[i], theta), TILT);
        px[i] = cx + v[0] * R;
        py[i] = cy - v[1] * R;
        pz[i] = v[2];
        shade[i] = dot3(v, LIGHT);
      }

      /* Planet body — occludes stars, shaded toward the light */
      const body = ctx.createRadialGradient(
        cx - R * 0.4, cy - R * 0.3, R * 0.1, cx, cy, R,
      );
      body.addColorStop(0, `rgba(16,18,48,${0.78 * dim})`);
      body.addColorStop(0.62, `rgba(9,10,34,${0.85 * dim})`);
      body.addColorStop(1, `rgba(4,5,18,${0.92 * dim})`);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      /* Atmosphere — outer glow + lit limb */
      const atm = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.3);
      atm.addColorStop(0, 'rgba(99,102,241,0)');
      atm.addColorStop(0.28, `rgba(99,102,241,${0.10 * dim})`);
      atm.addColorStop(0.55, `rgba(56,189,248,${0.05 * dim})`);
      atm.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = atm;
      ctx.fill();

      const litAngle = Math.atan2(-LIGHT[1], LIGHT[0]);
      ctx.beginPath();
      ctx.arc(cx, cy, R - 1, litAngle - 1.5, litAngle + 1.5);
      ctx.strokeStyle = `rgba(125,211,252,${0.28 * dim})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, R - 2.5, litAngle - 1.1, litAngle + 1.1);
      ctx.strokeStyle = `rgba(190,225,255,${0.12 * dim})`;
      ctx.lineWidth = 4;
      ctx.stroke();

      /* Graticule — equator + two meridians */
      const circles: V3[][] = [];
      const seg = 64;
      const eq: V3[] = [], m1: V3[] = [], m2: V3[] = [];
      for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * Math.PI * 2;
        eq.push([Math.cos(a), 0, Math.sin(a)]);
        m1.push([Math.cos(a), Math.sin(a), 0]);
        m2.push([0, Math.sin(a), Math.cos(a)]);
      }
      circles.push(eq, m1, m2);
      for (const circle of circles) {
        ctx.beginPath();
        let pen = false;
        for (const p0 of circle) {
          const v = rotZ(rotY(p0, theta), TILT);
          if (v[2] < -0.02) { pen = false; continue; }
          const x = cx + v[0] * R, y = cy - v[1] * R;
          if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(129,140,248,${0.10 * dim})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      /* Network edges — lit by terminator, faded when behind */
      for (const [i, j] of globe.edges) {
        const zAvg = (pz[i] + pz[j]) / 2;
        if (zAvg < -0.15) continue;
        const front = Math.min(1, Math.max(0, zAvg + 0.35));
        const lum = Math.max(0, (shade[i] + shade[j]) / 2);
        const a = (0.05 + lum * 0.14) * front * dim;
        if (a < 0.015) continue;
        ctx.strokeStyle = `rgba(129,140,248,${a})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(px[i], py[i]);
        ctx.lineTo(px[j], py[j]);
        ctx.stroke();
      }

      /* Nodes — land bright, ocean dim; day side lit, night side ember */
      for (let i = 0; i < N; i++) {
        const front = pz[i] > 0;
        const lum = Math.max(0, shade[i]);
        const isLand = globe.land[i];
        let a: number, r: number;
        if (front) {
          a = (isLand ? 0.22 + lum * 0.6 : 0.10 + lum * 0.22) * dim;
          r = (isLand ? 1.1 + lum * 0.9 : 0.8) * (isMob ? 0.85 : 1);
        } else {
          a = 0.05 * dim;
          r = 0.7;
        }
        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
        ctx.fillStyle = front && lum > 0.55 && isLand
          ? `rgba(190,225,255,${a})`
          : `rgba(165,180,252,${a})`;
        ctx.fill();
      }

      /* Data pulses running along the network */
      if (!reduced) {
        while (pulses.length < (isMob ? 5 : 11) && globe.edges.length) {
          pulses.push({ edge: (Math.random() * globe.edges.length) | 0, t: 0, spd: 0.006 + Math.random() * 0.012 });
        }
        pulses = pulses.filter(p => p.t <= 1);
        for (const p of pulses) {
          p.t += p.spd;
          const [i, j] = globe.edges[p.edge];
          const zAvg = (pz[i] + pz[j]) / 2;
          if (zAvg < 0) continue;
          const x = px[i] + (px[j] - px[i]) * p.t;
          const y = py[i] + (py[j] - py[i]) * p.t;
          const a = Math.sin(p.t * Math.PI) * (0.35 + zAvg * 0.55) * dim;
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(125,211,252,${a})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 4.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56,189,248,${a * 0.18})`;
          ctx.fill();
        }
      }

      /* Satellites — inclined orbits, occluded behind the planet */
      for (const s of globe.sats) {
        const phase = s.phase + t * s.speed + scroll * 0.0004;
        for (let k = 12; k >= 0; k--) {
          const a2 = phase - k * 0.05;
          const pos: V3 = [
            s.u[0] * Math.cos(a2) + s.w[0] * Math.sin(a2),
            s.u[1] * Math.cos(a2) + s.w[1] * Math.sin(a2),
            s.u[2] * Math.cos(a2) + s.w[2] * Math.sin(a2),
          ];
          const v = rotZ(pos, TILT);
          const x = cx + v[0] * R * s.r;
          const y = cy - v[1] * R * s.r;
          const behind = v[2] < 0 && Math.hypot(x - cx, y - cy) < R;
          const head = k === 0;
          let a = head ? 0.85 : (1 - k / 13) * 0.22;
          if (behind) a *= 0.12;
          ctx.beginPath();
          ctx.arc(x, y, head ? 1.8 : 1, 0, Math.PI * 2);
          ctx.fillStyle = head ? `rgba(190,225,255,${a * dim})` : `rgba(129,140,248,${a * dim})`;
          ctx.fill();
          if (head && !behind) {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56,189,248,${0.16 * dim})`;
            ctx.fill();
          }
        }
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const scroll = window.scrollY;
      drawStars(t, scroll);
      drawGlobe(t, scroll);
      drawComets(t);
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    build();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => { build(); if (reduced) draw(0); };
    window.addEventListener('resize', onResize);
    const onVis = () => {
      if (reduced) return;
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
    </div>
  );
}
