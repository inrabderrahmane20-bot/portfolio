import { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   DEEP-FIELD BACKDROP — one fixed canvas behind every page.

   Layers, back to front:
   1. Parallax starfield (3 depth layers, twinkle, halos) + shooting stars
   2. THE GLOBE — a full orbital theatre:
      · shaded planet body with day/night terminator + atmosphere + lit limb
      · continent-seeded node cloud, K-nearest network, graticule
      · radar sweep that ignites nodes as it passes their longitude
      · city beacons (diffraction sparkles) emitting tangent-plane ripples
      · great-circle traffic arcs lifting off the surface between cities
      · double tick-ring system with counter-rotating markers
      · equatorial debris belt (46 particles, per-particle wobble)
      · three satellites on inclined orbits, occluded by the planet,
        each with a call-sign label and leader line
      · live target reticle locked on Marrakech (31.6295°N — 7.9811°W)
   Rotation, rings and satellites are scroll-coupled. DPR-capped, paused
   when the tab hides, single static frame under prefers-reduced-motion.
═══════════════════════════════════════════════════════════════════════ */

type V3 = [number, number, number];

const toRad = (d: number) => (d * Math.PI) / 180;
const TAU = Math.PI * 2;
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
function slerp(a: V3, b: V3, t: number): V3 {
  const d = Math.max(-1, Math.min(1, dot3(a, b)));
  const om = Math.acos(d);
  if (om < 0.001) return a;
  const so = Math.sin(om);
  const w1 = Math.sin((1 - t) * om) / so, w2 = Math.sin(t * om) / so;
  return [a[0] * w1 + b[0] * w2, a[1] * w1 + b[1] * w2, a[2] * w1 + b[2] * w2];
}

/* ── Continent zones [latMin, latMax, lonMin, lonMax, nodes] ─────────── */
const ZONES: [number, number, number, number, number][] = [
  [ 22, 70, -165, -55, 52],
  [-56, 12,  -81, -35, 34],
  [ 36, 70,  -11,  40, 36],
  [-34, 36,  -17,  50, 42],
  [ 12, 74,   28,  90, 34],
  [ -9, 55,   92, 145, 40],
  [-44, -11, 113, 154, 20],
  [-78, 78, -180, 180, 30],   // ocean scatter (last zone = not land)
];

const MARRAKECH = ll2v(31.6295, -7.9811);
const TILT = toRad(23.4);
const LIGHT = norm3([-0.55, 0.4, 0.72] as V3);

interface Ring  { basisU: V3; basisW: V3; r: number; ticks: number; dir: number; }
interface Deb   { phase: number; r: number; speed: number; wob: number; size: number; }
interface Sat   { u: V3; w: V3; r: number; speed: number; phase: number; name: string; }
interface Arc   { a: V3; b: V3; t: number; spd: number; }
interface Rip   { node: number; t: number; }
interface Pulse { edge: number; t: number; spd: number; }

interface GlobeData {
  nodes: V3[];
  lon: Float32Array;
  land: boolean[];
  cities: number[];
  cityPhase: Float32Array;
  edges: [number, number][];
  rings: Ring[];
  debris: Deb[];
  sats: Sat[];
}

function inclinedBasis(inclineA: number, inclineB: number): { u: V3; w: V3 } {
  const axis = norm3([Math.sin(inclineA), Math.cos(inclineA) * Math.cos(inclineB), Math.sin(inclineB)] as V3);
  const u = norm3(cross3(axis, Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0] as V3));
  const w = norm3(cross3(axis, u));
  return { u, w };
}

function buildGlobe(scale: number): GlobeData {
  const nodes: V3[] = [];
  const land: boolean[] = [];
  const lons: number[] = [];
  ZONES.forEach(([la0, la1, lo0, lo1, n], zi) => {
    const count = Math.max(6, Math.round(n * scale));
    for (let i = 0; i < count; i++) {
      const lat = la0 + Math.random() * (la1 - la0);
      const lon = lo0 + Math.random() * (lo1 - lo0);
      nodes.push(ll2v(lat, lon));
      lons.push(toRad(lon));
      land.push(zi < ZONES.length - 1);
    }
  });

  /* K-nearest network among land nodes */
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
      if (dot3(nodes[i], nodes[j]) < 0.82) continue;
      const key = i < j ? i * N + j : j * N + i;
      if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
    }
  }

  /* Cities — every ~8th land node becomes a beacon */
  const cities: number[] = [];
  for (let i = 0; i < N; i++) if (land[i] && i % 8 === 3) cities.push(i);
  const cityPhase = new Float32Array(cities.length).map(() => Math.random() * TAU);

  /* Tick-ring system */
  const r1 = inclinedBasis(0.35, 0.1);
  const r2 = inclinedBasis(-0.2, 0.5);
  const rings: Ring[] = [
    { basisU: r1.u, basisW: r1.w, r: 1.62, ticks: 72, dir: 1 },
    { basisU: r2.u, basisW: r2.w, r: 1.84, ticks: 96, dir: -1 },
  ];

  /* Debris belt */
  const debris: Deb[] = Array.from({ length: Math.round(46 * scale) }, () => ({
    phase: Math.random() * TAU,
    r: 1.3 + Math.random() * 0.18,
    speed: (0.00005 + Math.random() * 0.00008) * (Math.random() < 0.5 ? 1 : -1),
    wob: Math.random() * TAU,
    size: 0.5 + Math.random() * 0.6,
  }));

  /* Satellites */
  const sats: Sat[] = [1.28, 1.45, 1.7].map((r, i) => {
    const { u, w } = inclinedBasis(i * 2.1, i * 1.3 + 0.6);
    return { u, w, r, speed: (0.00016 + i * 0.00006) * (i % 2 ? -1 : 1), phase: i * 2.2, name: `SAT-0${i + 1}` };
  });

  return { nodes, lon: Float32Array.from(lons), land, cities, cityPhase, edges, rings, debris, sats };
}

interface Star { x: number; y: number; z: number; r: number; tw: number; hue: 'white' | 'indigo' | 'cyan'; }
interface Comet { x: number; y: number; vx: number; vy: number; life: number; max: number; }

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
    let arcs: Arc[] = [];
    let ripples: Rip[] = [];
    let lastRipple = 0;

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
        tw: Math.random() * TAU,
        hue: Math.random() < 0.72 ? 'white' : Math.random() < 0.6 ? 'indigo' : 'cyan',
      }));

      globe = buildGlobe(isMob ? 0.5 : 1);
      pulses = []; arcs = []; ripples = [];
    };

    const spawnArc = () => {
      const { cities, nodes } = globe;
      if (cities.length < 4) return;
      for (let tries = 0; tries < 8; tries++) {
        const a = nodes[cities[(Math.random() * cities.length) | 0]];
        const b = nodes[cities[(Math.random() * cities.length) | 0]];
        const d = dot3(a, b);
        if (d > -0.25 && d < 0.75) { // medium-to-long haul only
          arcs.push({ a, b, t: 0, spd: 0.004 + Math.random() * 0.005 });
          return;
        }
      }
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
        ctx.arc(px, py, s.r + s.z * 0.7, 0, TAU);
        ctx.fillStyle = STAR_COLORS[s.hue](alpha);
        ctx.fill();
        if (s.z > 0.85) {
          ctx.beginPath();
          ctx.arc(px, py, (s.r + 1.6) * 2.2, 0, TAU);
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
      const theta = t * 0.000042 + scroll * 0.00055;
      const dim = isMob ? 0.8 : 1;

      const view = (m: V3): V3 => rotZ(rotY(m, theta), TILT);
      const project = (v: V3, radius = R): [number, number] => [cx + v[0] * radius, cy - v[1] * radius];

      const N = globe.nodes.length;
      const px = new Float32Array(N);
      const py = new Float32Array(N);
      const pz = new Float32Array(N);
      const shade = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const v = view(globe.nodes[i]);
        px[i] = cx + v[0] * R;
        py[i] = cy - v[1] * R;
        pz[i] = v[2];
        shade[i] = dot3(v, LIGHT);
      }

      /* Planet body */
      const body = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.3, R * 0.1, cx, cy, R);
      body.addColorStop(0, `rgba(16,18,48,${0.78 * dim})`);
      body.addColorStop(0.62, `rgba(9,10,34,${0.85 * dim})`);
      body.addColorStop(1, `rgba(4,5,18,${0.92 * dim})`);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU);
      ctx.fillStyle = body; ctx.fill();

      /* Atmosphere + lit limb */
      const atm = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.3);
      atm.addColorStop(0, 'rgba(99,102,241,0)');
      atm.addColorStop(0.28, `rgba(99,102,241,${0.10 * dim})`);
      atm.addColorStop(0.55, `rgba(56,189,248,${0.05 * dim})`);
      atm.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.3, 0, TAU);
      ctx.fillStyle = atm; ctx.fill();

      const litAngle = Math.atan2(-LIGHT[1], LIGHT[0]);
      ctx.beginPath(); ctx.arc(cx, cy, R - 1, litAngle - 1.5, litAngle + 1.5);
      ctx.strokeStyle = `rgba(125,211,252,${0.28 * dim})`; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, R - 2.5, litAngle - 1.1, litAngle + 1.1);
      ctx.strokeStyle = `rgba(190,225,255,${0.12 * dim})`; ctx.lineWidth = 4; ctx.stroke();

      /* Graticule */
      const seg = 64;
      const circles: V3[][] = [[], [], []];
      for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * TAU;
        circles[0].push([Math.cos(a), 0, Math.sin(a)]);
        circles[1].push([Math.cos(a), Math.sin(a), 0]);
        circles[2].push([0, Math.sin(a), Math.cos(a)]);
      }
      for (const circle of circles) {
        ctx.beginPath();
        let pen = false;
        for (const p0 of circle) {
          const v = view(p0);
          if (v[2] < -0.02) { pen = false; continue; }
          const [x, y] = project(v);
          if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(129,140,248,${0.10 * dim})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      /* Radar sweep — a meridian of light orbiting the planet */
      const sweepLon = (t * 0.00045) % TAU;
      ctx.beginPath();
      let pen = false;
      for (let i = 0; i <= 40; i++) {
        const lat = -Math.PI / 2 + (i / 40) * Math.PI;
        const m: V3 = [Math.cos(lat) * Math.cos(sweepLon), Math.sin(lat), Math.cos(lat) * Math.sin(sweepLon)];
        const v = view(m);
        if (v[2] < 0.02) { pen = false; continue; }
        const [x, y] = project(v);
        if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(125,211,252,${0.16 * dim})`;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      /* Network edges */
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

      /* Nodes — with radar-sweep ignition */
      for (let i = 0; i < N; i++) {
        const front = pz[i] > 0;
        const lum = Math.max(0, shade[i]);
        const isLand = globe.land[i];
        // wake: how recently did the sweep pass this node's longitude?
        let dLon = (globe.lon[i] - sweepLon) % TAU;
        if (dLon > 0) dLon -= TAU;
        const wake = front && dLon > -0.7 ? 1 + dLon / 0.7 : 0;

        let a: number, r: number;
        if (front) {
          a = (isLand ? 0.22 + lum * 0.6 : 0.10 + lum * 0.22) * dim + wake * 0.5;
          r = (isLand ? 1.1 + lum * 0.9 : 0.8) * (isMob ? 0.85 : 1) + wake * 1.1;
        } else { a = 0.05 * dim; r = 0.7; }
        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, TAU);
        ctx.fillStyle = wake > 0.25
          ? `rgba(125,211,252,${Math.min(0.95, a)})`
          : front && lum > 0.55 && isLand
            ? `rgba(190,225,255,${a})`
            : `rgba(165,180,252,${a})`;
        ctx.fill();
      }

      /* City beacons — pulsing diffraction sparkles */
      for (let c = 0; c < globe.cities.length; c++) {
        const i = globe.cities[c];
        if (pz[i] < 0.05) continue;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0022 + globe.cityPhase[c]);
        const a = (0.25 + pulse * 0.55) * Math.min(1, pz[i] + 0.3) * dim;
        const len = 3 + pulse * 3.5;
        ctx.strokeStyle = `rgba(190,225,255,${a * 0.75})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(px[i] - len, py[i]); ctx.lineTo(px[i] + len, py[i]);
        ctx.moveTo(px[i], py[i] - len); ctx.lineTo(px[i], py[i] + len);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px[i], py[i], 1.6 + pulse, 0, TAU);
        ctx.fillStyle = `rgba(125,211,252,${a})`;
        ctx.fill();
      }

      if (!reduced) {
        /* Surface ripples — tangent-plane transmission rings */
        if (t - lastRipple > 2100 && globe.cities.length) {
          const frontCities = globe.cities.filter(i => pz[i] > 0.25);
          if (frontCities.length) {
            lastRipple = t;
            ripples.push({ node: frontCities[(Math.random() * frontCities.length) | 0], t: 0 });
          }
        }
        ripples = ripples.filter(r => r.t < 1);
        for (const rip of ripples) {
          rip.t += 0.016;
          const i = rip.node;
          if (pz[i] < 0) continue;
          const rr = rip.t * 20;
          const a = (1 - rip.t) * 0.4 * Math.min(1, pz[i] + 0.2) * dim;
          const ang = Math.atan2(py[i] - cy, px[i] - cx);
          ctx.beginPath();
          ctx.ellipse(px[i], py[i], rr, rr * Math.max(0.3, pz[i]), ang, 0, TAU);
          ctx.strokeStyle = `rgba(125,211,252,${a})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        /* Great-circle traffic arcs */
        while (arcs.length < (isMob ? 3 : 6)) spawnArc();
        arcs = arcs.filter(a => a.t < 1.6);
        for (const arc of arcs) {
          arc.t += arc.spd;
          const head = Math.min(1, arc.t);
          const tail = Math.max(0, arc.t - 0.55);
          if (tail >= 1) continue;
          const steps = 26;
          let prev: [number, number] | null = null;
          let prevZ = 0;
          for (let s = 0; s <= steps; s++) {
            const f = tail + (head - tail) * (s / steps);
            const m = slerp(arc.a, arc.b, f);
            const lift = 1 + Math.sin(f * Math.PI) * 0.22;
            const v = view(m);
            const [x, y] = project(v, R * lift);
            if (prev && (v[2] > -0.05 || prevZ > -0.05)) {
              const prog = s / steps;
              const a = Math.sin(prog * Math.PI * 0.9 + 0.1) * 0.5 * Math.min(1, v[2] + 0.55) * dim;
              if (a > 0.02) {
                ctx.strokeStyle = `rgba(103,232,249,${a})`;
                ctx.lineWidth = prog > 0.85 ? 1.4 : 0.9;
                ctx.beginPath();
                ctx.moveTo(prev[0], prev[1]);
                ctx.lineTo(x, y);
                ctx.stroke();
              }
            }
            prev = [x, y]; prevZ = v[2];
          }
          // luminous head
          if (head < 1 && prev) {
            ctx.beginPath();
            ctx.arc(prev[0], prev[1], 1.8, 0, TAU);
            ctx.fillStyle = `rgba(190,225,255,${0.8 * dim})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(prev[0], prev[1], 4.6, 0, TAU);
            ctx.fillStyle = 'rgba(56,189,248,0.16)';
            ctx.fill();
          }
        }

        /* Data pulses on the ground network */
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
          ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU);
          ctx.fillStyle = `rgba(125,211,252,${a})`; ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, 4.2, 0, TAU);
          ctx.fillStyle = `rgba(56,189,248,${a * 0.18})`; ctx.fill();
        }
      }

      /* Marrakech target reticle */
      {
        const v = view(MARRAKECH);
        if (v[2] > 0.12) {
          const [x, y] = project(v);
          const a = Math.min(1, v[2] + 0.25) * dim;
          const spin = t * 0.001;
          const blink = 0.6 + 0.4 * Math.sin(t * 0.004);
          ctx.strokeStyle = `rgba(129,140,248,${0.65 * a})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(x, y, 7, spin, spin + 1.1); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 7, spin + Math.PI, spin + Math.PI + 1.1); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 11, -spin * 0.7, -spin * 0.7 + 0.7); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 11, -spin * 0.7 + Math.PI, -spin * 0.7 + Math.PI + 0.7); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 2, 0, TAU);
          ctx.fillStyle = `rgba(190,225,255,${blink * a})`; ctx.fill();
          if (!isMob) {
            const lx = x + 26, ly = y - 26;
            ctx.strokeStyle = `rgba(129,140,248,${0.4 * a})`;
            ctx.beginPath(); ctx.moveTo(x + 8, y - 8); ctx.lineTo(lx, ly); ctx.lineTo(lx + 12, ly); ctx.stroke();
            ctx.font = "9px 'JetBrains Mono', monospace";
            ctx.fillStyle = `rgba(165,180,252,${0.8 * a})`;
            ctx.fillText('MRK — 31.6295°N / 7.9811°W', lx + 16, ly + 3);
          }
        }
      }

      /* Debris belt */
      for (const d of globe.debris) {
        const a2 = d.phase + t * d.speed + scroll * 0.0002;
        const wobble = Math.sin(a2 * 3 + d.wob) * 0.06;
        const m: V3 = [Math.cos(a2) * d.r, wobble * d.r, Math.sin(a2) * d.r];
        const v = rotZ(m, TILT);
        const x = cx + v[0] * R, y = cy - v[1] * R;
        const behind = v[2] < 0 && Math.hypot(x - cx, y - cy) < R;
        const a = (behind ? 0.03 : 0.16 + (v[2] > 0 ? v[2] * 0.1 : 0)) * dim;
        ctx.beginPath();
        ctx.arc(x, y, d.size, 0, TAU);
        ctx.fillStyle = `rgba(165,180,252,${a})`;
        ctx.fill();
      }

      /* Tick-ring system with counter-rotating markers */
      for (let ri = 0; ri < globe.rings.length; ri++) {
        const ring = globe.rings[ri];
        const drift = t * 0.00003 * ring.dir + scroll * 0.0001 * ring.dir;
        for (let k = 0; k < ring.ticks; k++) {
          const a2 = (k / ring.ticks) * TAU + drift;
          const m: V3 = [
            ring.basisU[0] * Math.cos(a2) + ring.basisW[0] * Math.sin(a2),
            ring.basisU[1] * Math.cos(a2) + ring.basisW[1] * Math.sin(a2),
            ring.basisU[2] * Math.cos(a2) + ring.basisW[2] * Math.sin(a2),
          ];
          const v = rotZ(m, TILT);
          const x = cx + v[0] * R * ring.r, y = cy - v[1] * R * ring.r;
          const behind = v[2] < 0 && Math.hypot(x - cx, y - cy) < R;
          const major = k % 8 === 0;
          const a = (behind ? 0.025 : major ? 0.22 : 0.09) * dim;
          ctx.beginPath();
          ctx.arc(x, y, major ? 1.1 : 0.6, 0, TAU);
          ctx.fillStyle = `rgba(${ri === 0 ? '129,140,248' : '125,211,252'},${a})`;
          ctx.fill();
        }
        // orbiting marker on each ring
        const ma = t * 0.00035 * ring.dir + ri * 2;
        const mm: V3 = [
          ring.basisU[0] * Math.cos(ma) + ring.basisW[0] * Math.sin(ma),
          ring.basisU[1] * Math.cos(ma) + ring.basisW[1] * Math.sin(ma),
          ring.basisU[2] * Math.cos(ma) + ring.basisW[2] * Math.sin(ma),
        ];
        const mv = rotZ(mm, TILT);
        const mx2 = cx + mv[0] * R * ring.r, my2 = cy - mv[1] * R * ring.r;
        const mBehind = mv[2] < 0 && Math.hypot(mx2 - cx, my2 - cy) < R;
        if (!mBehind) {
          ctx.strokeStyle = `rgba(125,211,252,${0.5 * dim})`;
          ctx.lineWidth = 0.9;
          ctx.strokeRect(mx2 - 2.4, my2 - 2.4, 4.8, 4.8);
        }
      }

      /* Satellites + call-signs */
      for (const s of globe.sats) {
        const phase = s.phase + t * s.speed + scroll * 0.0004;
        let headPos: [number, number] | null = null;
        let headBehind = false;
        for (let k = 12; k >= 0; k--) {
          const a2 = phase - k * 0.05;
          const m: V3 = [
            s.u[0] * Math.cos(a2) + s.w[0] * Math.sin(a2),
            s.u[1] * Math.cos(a2) + s.w[1] * Math.sin(a2),
            s.u[2] * Math.cos(a2) + s.w[2] * Math.sin(a2),
          ];
          const v = rotZ(m, TILT);
          const x = cx + v[0] * R * s.r, y = cy - v[1] * R * s.r;
          const behind = v[2] < 0 && Math.hypot(x - cx, y - cy) < R;
          const head = k === 0;
          let a = head ? 0.85 : (1 - k / 13) * 0.22;
          if (behind) a *= 0.12;
          ctx.beginPath();
          ctx.arc(x, y, head ? 1.8 : 1, 0, TAU);
          ctx.fillStyle = head ? `rgba(190,225,255,${a * dim})` : `rgba(129,140,248,${a * dim})`;
          ctx.fill();
          if (head) { headPos = [x, y]; headBehind = behind; }
        }
        if (headPos && !headBehind) {
          ctx.beginPath();
          ctx.arc(headPos[0], headPos[1], 5, 0, TAU);
          ctx.fillStyle = `rgba(56,189,248,${0.16 * dim})`;
          ctx.fill();
          if (!isMob) {
            ctx.strokeStyle = `rgba(129,140,248,${0.30 * dim})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(headPos[0] + 4, headPos[1] - 4);
            ctx.lineTo(headPos[0] + 14, headPos[1] - 12);
            ctx.stroke();
            ctx.font = "8px 'JetBrains Mono', monospace";
            ctx.fillStyle = `rgba(165,180,252,${0.55 * dim})`;
            ctx.fillText(s.name, headPos[0] + 17, headPos[1] - 10);
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
