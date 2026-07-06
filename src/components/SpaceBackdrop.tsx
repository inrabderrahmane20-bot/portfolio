import { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   DEEP-FIELD BACKDROP — one fixed canvas behind every page.

   Layers, back to front:
   1. Parallax starfield (3 depth layers, twinkle, halos) + shooting stars
   2. THE EARTH — a holographic planet with real geography:
      · coastline vector polygons (encoded lon/lat) drawn as glowing strokes
      · landmass fill = thousands of dots point-in-polygon tested at build
      · day/night terminator, 30° graticule, atmosphere + lit limb
      · 29 real cities as pulsing beacons (cyan/violet), tangent ripples
      · great-circle traffic arcs between actual city pairs
      · radar sweep igniting land as it passes each longitude
      · twin tick-rings + two magenta orbital ellipses, counter-rotating
      · equatorial debris belt, three satellites with call-sign labels
      · live target reticle locked on Marrakech (31.6295°N — 7.9811°W)
   Scroll-coupled rotation. DPR-capped, paused when hidden, static frame
   under prefers-reduced-motion.
═══════════════════════════════════════════════════════════════════════ */

type V3 = [number, number, number];
type LL = [number, number]; // [lon, lat]

const toRad = (d: number) => (d * Math.PI) / 180;
const TAU = Math.PI * 2;
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function ll2v(lon: number, lat: number): V3 {
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

/* ═══ WORLD GEOGRAPHY — simplified coastlines, [lon, lat] rings ═══════ */
const WORLD: LL[][] = [
  /* North America */
  [[-156,71],[-140,70],[-125,71],[-110,73],[-96,72],[-85,70],[-75,71],[-68,60],[-56,52],
   [-65,45],[-70,42],[-75,35],[-81,31],[-80,25],[-83,29],[-89,29],[-96,27],[-97,21],
   [-90,21],[-87,21],[-88,16],[-83,14],[-83,9],[-79,8],[-77,7],[-80,9],[-85,11],[-92,15],
   [-97,16],[-105,20],[-109,23],[-113,27],[-115,30],[-117,33],[-122,37],[-124,41],[-124,46],
   [-126,49],[-131,53],[-135,58],[-141,60],[-147,61],[-153,59],[-158,56],[-164,55],
   [-162,60],[-166,64],[-166,68],[-156,71]],
  /* Greenland */
  [[-45,60],[-53,65],[-56,71],[-61,76],[-58,80],[-45,83],[-30,83],[-20,80],[-21,75],
   [-27,70],[-33,67],[-40,63],[-45,60]],
  /* South America */
  [[-77,7],[-72,12],[-64,11],[-52,5],[-50,0],[-44,-3],[-35,-7],[-39,-13],[-40,-20],
   [-41,-23],[-48,-26],[-53,-33],[-57,-36],[-62,-39],[-65,-41],[-65,-47],[-69,-50],
   [-68,-53],[-71,-54],[-74,-50],[-73,-44],[-73,-38],[-71,-32],[-70,-24],[-70,-18],
   [-76,-14],[-79,-7],[-81,-3],[-80,1],[-77,7]],
  /* Africa */
  [[-6,35],[3,37],[10,37],[11,33],[19,31],[25,32],[32,31],[34,27],[37,22],[40,16],
   [43,12],[51,12],[48,5],[42,0],[40,-5],[39,-11],[36,-18],[35,-23],[32,-28],[27,-33],
   [20,-35],[18,-32],[15,-27],[12,-18],[13,-11],[9,-2],[9,4],[3,6],[-4,5],[-8,4],
   [-13,9],[-17,15],[-16,20],[-14,26],[-9,31],[-6,35]],
  /* Madagascar */
  [[44,-25],[47,-24],[50,-16],[49,-12],[45,-16],[43,-21],[44,-25]],
  /* Eurasia (incl. Arabia + India + SE Asia mainland) */
  [[-9,38],[-9,43],[-2,46],[-5,48],[0,49],[4,52],[8,54],[8,57],[5,59],[5,62],[12,66],
   [16,69],[25,71],[31,70],[40,67],[48,68],[60,69],[70,73],[80,73],[95,76],[105,77],
   [113,74],[130,72],[140,72],[150,70],[160,70],[170,67],[178,65],[178,62],[163,60],
   [160,53],[156,58],[150,60],[143,59],[137,54],[141,49],[135,44],[129,38],[126,34],
   [122,37],[117,38],[121,31],[117,23],[110,20],[108,15],[109,12],[105,9],[102,13],
   [100,7],[103,1.5],[99,6],[97,12],[94,16],[90,22],[87,21],[83,17],[80,13],[77,8],
   [73,15],[70,21],[66,25],[61,25],[57,26],[59,22],[55,17],[52,15],[45,13],[43,17],
   [39,21],[35,28],[34,30],[35,34],[36,36],[30,36],[26,40],[22,37],[20,40],[18,42],
   [13,45],[18,40],[15,38],[12,41],[10,44],[7,43],[3,42],[0,39],[-2,36],[-6,36],[-9,38]],
  /* United Kingdom */
  [[-5,50],[1,51],[0,53],[-2,56],[-4,58],[-6,55],[-5,53],[-6,50],[-5,50]],
  /* Japan */
  [[130,31],[134,34],[140,36],[143,42],[145,44],[141,41],[136,35],[131,31],[130,31]],
  /* Borneo */
  [[109,1],[114,5],[117,6],[119,1],[116,-3],[110,-2],[109,1]],
  /* Sumatra + Java hint */
  [[95,5],[100,2],[104,-4],[110,-7],[114,-8],[106,-6],[101,-2],[96,3],[95,5]],
  /* New Guinea */
  [[131,-1],[137,-2],[141,-3],[147,-6],[143,-8],[136,-4],[131,-2],[131,-1]],
  /* Philippines hint */
  [[120,18],[122,13],[125,9],[123,12],[121,16],[120,18]],
  /* Australia */
  [[113,-25],[115,-34],[124,-33],[129,-32],[133,-32],[138,-35],[141,-38],[147,-38],
   [150,-37],[153,-30],[153,-25],[149,-20],[146,-19],[142,-11],[140,-17],[136,-12],
   [131,-12],[129,-15],[122,-18],[114,-22],[113,-25]],
  /* New Zealand */
  [[173,-35],[176,-38],[174,-42],[169,-46],[167,-45],[172,-40],[173,-35]],
];

/* Real cities — [lon, lat, violet?] */
const CITIES: [number, number, number][] = [
  [-7.98, 31.63, 0],  // Marrakech
  [-7.6, 33.6, 1], [0, 51.5, 0], [2.3, 48.9, 1], [-3.7, 40.4, 0], [13.4, 52.5, 0],
  [12.5, 41.9, 1], [31.2, 30, 0], [3.4, 6.5, 1], [36.8, -1.3, 0], [28, -26.2, 1],
  [55.3, 25.3, 0], [37.6, 55.8, 1], [72.9, 19.1, 0], [77.2, 28.6, 1], [103.8, 1.4, 0],
  [114.2, 22.3, 1], [121.5, 31.2, 0], [116.4, 39.9, 1], [139.7, 35.7, 0], [127, 37.6, 1],
  [151.2, -33.9, 0], [106.8, -6.2, 1], [-74, 40.7, 0], [-122.4, 37.8, 1], [-99.1, 19.4, 0],
  [-46.6, -23.6, 1], [-58.4, -34.6, 0], [-79.4, 43.7, 1],
];

/* Point-in-polygon (lon/lat ray cast) */
function inPoly(lon: number, lat: number, poly: LL[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}
function isLand(lon: number, lat: number): boolean {
  for (const poly of WORLD) if (inPoly(lon, lat, poly)) return true;
  return false;
}

const MARRAKECH = ll2v(-7.9811, 31.6295);
const TILT = toRad(23.4);
const LIGHT = norm3([-0.55, 0.4, 0.72] as V3);

interface Ring  { u: V3; w: V3; r: number; ticks: number; dir: number; magenta: boolean; }
interface Deb   { phase: number; r: number; speed: number; wob: number; size: number; }
interface Sat   { u: V3; w: V3; r: number; speed: number; phase: number; name: string; }
interface Arc   { a: V3; b: V3; t: number; spd: number; violet: boolean; }
interface Rip   { city: number; t: number; }
interface Pulse { edge: number; t: number; spd: number; }

interface GlobeData {
  dots: V3[]; dotLon: Float32Array;
  coasts: V3[][];
  cities: V3[]; cityLon: Float32Array; cityViolet: boolean[]; cityPhase: Float32Array;
  edges: [number, number][];
  rings: Ring[]; debris: Deb[]; sats: Sat[];
}

function inclinedBasis(a: number, b: number): { u: V3; w: V3 } {
  const axis = norm3([Math.sin(a), Math.cos(a) * Math.cos(b), Math.sin(b)] as V3);
  const u = norm3(cross3(axis, Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0] as V3));
  const w = norm3(cross3(axis, u));
  return { u, w };
}

function buildGlobe(isMob: boolean): GlobeData {
  /* Land-fill dots — evenly spaced on the sphere, PIP-tested against WORLD */
  const step = isMob ? 2.6 : 1.7;
  const dots: V3[] = [];
  const dotLonArr: number[] = [];
  for (let lat = -55; lat <= 80; lat += step) {
    const lonStep = step / Math.max(0.25, Math.cos(toRad(lat)));
    for (let lon = -180; lon < 180; lon += lonStep) {
      const jLon = lon + (Math.random() - 0.5) * lonStep * 0.4;
      const jLat = lat + (Math.random() - 0.5) * step * 0.4;
      if (isLand(jLon, jLat)) {
        dots.push(ll2v(jLon, jLat));
        dotLonArr.push(toRad(jLon));
      }
    }
  }

  /* Coastline polylines, densified so they curve with the sphere */
  const coasts: V3[][] = WORLD.map(poly => {
    const ring: V3[] = [];
    for (let i = 0; i < poly.length - 1; i++) {
      const a = poly[i], b = poly[i + 1];
      const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4));
      for (let s = 0; s < steps; s++) {
        ring.push(ll2v(a[0] + ((b[0] - a[0]) * s) / steps, a[1] + ((b[1] - a[1]) * s) / steps));
      }
    }
    ring.push(ll2v(poly[poly.length - 1][0], poly[poly.length - 1][1]));
    return ring;
  });

  /* Cities */
  const cities = CITIES.map(([lon, lat]) => ll2v(lon, lat));
  const cityLon = Float32Array.from(CITIES.map(([lon]) => toRad(lon)));
  const cityViolet = CITIES.map(c => c[2] === 1);
  const cityPhase = new Float32Array(CITIES.length).map(() => Math.random() * TAU);

  /* Ground network between nearby cities */
  const edges: [number, number][] = [];
  const seen = new Set<number>();
  for (let i = 0; i < cities.length; i++) {
    const near = Array.from({ length: cities.length }, (_, j) => j)
      .filter(j => j !== i)
      .sort((a, b) => dot3(cities[b], cities[i]) - dot3(cities[a], cities[i]))
      .slice(0, 2);
    for (const j of near) {
      if (dot3(cities[i], cities[j]) < 0.55) continue;
      const key = i < j ? i * 100 + j : j * 100 + i;
      if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
    }
  }

  const r1 = inclinedBasis(0.35, 0.1);
  const r2 = inclinedBasis(-0.2, 0.5);
  const r3 = inclinedBasis(1.2, -0.35);
  const r4 = inclinedBasis(-1.0, 0.9);
  const rings: Ring[] = [
    { ...r1, r: 1.62, ticks: 72, dir: 1,  magenta: false },
    { ...r2, r: 1.84, ticks: 96, dir: -1, magenta: false },
    { ...r3, r: 1.18, ticks: 0,  dir: 1,  magenta: true },
    { ...r4, r: 1.30, ticks: 0,  dir: -1, magenta: true },
  ];

  const debris: Deb[] = Array.from({ length: isMob ? 22 : 46 }, () => ({
    phase: Math.random() * TAU,
    r: 1.3 + Math.random() * 0.18,
    speed: (0.00005 + Math.random() * 0.00008) * (Math.random() < 0.5 ? 1 : -1),
    wob: Math.random() * TAU,
    size: 0.5 + Math.random() * 0.6,
  }));

  const sats: Sat[] = [1.28, 1.45, 1.7].map((r, i) => {
    const { u, w } = inclinedBasis(i * 2.1, i * 1.3 + 0.6);
    return { u, w, r, speed: (0.00016 + i * 0.00006) * (i % 2 ? -1 : 1), phase: i * 2.2, name: `SAT-0${i + 1}` };
  });

  return { dots, dotLon: Float32Array.from(dotLonArr), coasts, cities, cityLon, cityViolet, cityPhase, edges, rings, debris, sats };
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
    let globe: GlobeData = buildGlobe(false);
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

      globe = buildGlobe(isMob);
      pulses = []; arcs = []; ripples = [];
    };

    const spawnArc = () => {
      const { cities } = globe;
      for (let tries = 0; tries < 8; tries++) {
        const i = (Math.random() * cities.length) | 0;
        const j = (Math.random() * cities.length) | 0;
        const d = dot3(cities[i], cities[j]);
        if (i !== j && d > -0.25 && d < 0.8) {
          arcs.push({ a: cities[i], b: cities[j], t: 0, spd: 0.004 + Math.random() * 0.005, violet: Math.random() < 0.4 });
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

    /* ── The Earth ─────────────────────────────────────────────────── */
    const drawGlobe = (t: number, scroll: number) => {
      const R = Math.min(W, H) * (isMob ? 0.46 : 0.42);
      const cx = isMob ? W * 0.72 : W * 0.79;
      const cy = (isMob ? H * 0.66 : H * 0.56) + Math.sin(t * 0.00012) * 10;
      const theta = t * 0.000042 + scroll * 0.00055;
      const dim = isMob ? 0.85 : 1;

      const view = (m: V3): V3 => rotZ(rotY(m, theta), TILT);

      /* Planet body — luminous glassy blue, highlight toward upper-left */
      const body = ctx.createRadialGradient(cx - R * 0.45, cy - R * 0.4, R * 0.05, cx, cy, R);
      body.addColorStop(0, `rgba(70,110,235,${0.50 * dim})`);
      body.addColorStop(0.4, `rgba(38,55,170,${0.55 * dim})`);
      body.addColorStop(0.75, `rgba(22,30,110,${0.62 * dim})`);
      body.addColorStop(1, `rgba(14,18,70,${0.72 * dim})`);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU);
      ctx.fillStyle = body; ctx.fill();

      /* Fresnel — the glass sphere brightens toward its edge, all around */
      const fresnel = ctx.createRadialGradient(cx, cy, R * 0.62, cx, cy, R);
      fresnel.addColorStop(0, 'rgba(80,160,255,0)');
      fresnel.addColorStop(0.82, `rgba(80,160,255,${0.07 * dim})`);
      fresnel.addColorStop(0.96, `rgba(100,180,255,${0.26 * dim})`);
      fresnel.addColorStop(1, `rgba(140,210,255,${0.42 * dim})`);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU);
      ctx.fillStyle = fresnel; ctx.fill();

      /* Full rim light + outer atmosphere halo */
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU);
      ctx.strokeStyle = `rgba(130,195,255,${0.55 * dim})`;
      ctx.lineWidth = 1.8; ctx.stroke();
      const atm = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.42);
      atm.addColorStop(0, `rgba(90,150,255,${0.22 * dim})`);
      atm.addColorStop(0.3, `rgba(80,140,255,${0.10 * dim})`);
      atm.addColorStop(0.65, `rgba(56,189,248,${0.04 * dim})`);
      atm.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.42, 0, TAU);
      ctx.fillStyle = atm; ctx.fill();

      /* Extra brilliance on the sunlit limb */
      const litAngle = Math.atan2(-LIGHT[1], LIGHT[0]);
      ctx.beginPath(); ctx.arc(cx, cy, R - 1, litAngle - 1.7, litAngle + 1.7);
      ctx.strokeStyle = `rgba(170,225,255,${0.6 * dim})`; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, R - 4, litAngle - 1.2, litAngle + 1.2);
      ctx.strokeStyle = `rgba(210,240,255,${0.2 * dim})`; ctx.lineWidth = 7; ctx.stroke();

      /* Graticule — every 30° */
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = `rgba(140,175,255,${0.17 * dim})`;
      for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i <= 72; i++) {
          const v = view(ll2v((i / 72) * 360 - 180, latDeg));
          if (v[2] < -0.02) { pen = false; continue; }
          const x = cx + v[0] * R, y = cy - v[1] * R;
          if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      for (let lonDeg = 0; lonDeg < 360; lonDeg += 30) {
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i <= 48; i++) {
          const v = view(ll2v(lonDeg - 180, (i / 48) * 180 - 90));
          if (v[2] < -0.02) { pen = false; continue; }
          const x = cx + v[0] * R, y = cy - v[1] * R;
          if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      /* Radar sweep meridian */
      const sweepLon = (t * 0.00045) % TAU;
      ctx.beginPath();
      let pen = false;
      for (let i = 0; i <= 40; i++) {
        const lat = -Math.PI / 2 + (i / 40) * Math.PI;
        const m: V3 = [Math.cos(lat) * Math.cos(sweepLon), Math.sin(lat), Math.cos(lat) * Math.sin(sweepLon)];
        const v = view(m);
        if (v[2] < 0.02) { pen = false; continue; }
        const x = cx + v[0] * R, y = cy - v[1] * R;
        if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(125,211,252,${0.15 * dim})`;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      /* ── LANDMASS DOTS — the actual Earth, bright like the hologram ── */
      const nD = globe.dots.length;
      for (let i = 0; i < nD; i++) {
        const v = view(globe.dots[i]);
        if (v[2] < 0.02) continue;
        const x = cx + v[0] * R, y = cy - v[1] * R;
        const lum = Math.max(0, dot3(v, LIGHT));
        let dLon = (globe.dotLon[i] - sweepLon) % TAU;
        if (dLon > 0) dLon -= TAU;
        const wake = dLon > -0.6 ? 1 + dLon / 0.6 : 0;

        const a = (0.4 + lum * 0.55) * dim + wake * 0.35;
        const sz = 1.3 + lum * 0.9 + wake * 0.9;
        ctx.fillStyle = wake > 0.25
          ? `rgba(170,230,255,${Math.min(0.98, a)})`
          : lum > 0.5
            ? `rgba(175,210,255,${a})`
            : `rgba(130,155,250,${a})`;
        ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }

      /* ── COASTLINES — bright glowing vector strokes ── */
      for (let pass = 0; pass < 2; pass++) {
        ctx.lineWidth = pass === 0 ? 3.6 : 1.3;
        for (const ring of globe.coasts) {
          ctx.beginPath();
          let pen2 = false;
          let lumSum = 0, lumN = 0;
          for (const p of ring) {
            const v = view(p);
            if (v[2] < 0.0) { pen2 = false; continue; }
            const x = cx + v[0] * R, y = cy - v[1] * R;
            lumSum += Math.max(0, dot3(v, LIGHT)); lumN++;
            if (!pen2) { ctx.moveTo(x, y); pen2 = true; } else ctx.lineTo(x, y);
          }
          if (!lumN) continue;
          const lum = lumSum / lumN;
          ctx.strokeStyle = pass === 0
            ? `rgba(90,170,255,${(0.12 + lum * 0.16) * dim})`
            : `rgba(175,225,255,${(0.42 + lum * 0.45) * dim})`;
          ctx.stroke();
        }
      }

      /* City projections (computed once for beacons/edges/pulses/ripples) */
      const nC = globe.cities.length;
      const cpx = new Float32Array(nC);
      const cpy = new Float32Array(nC);
      const cpz = new Float32Array(nC);
      for (let i = 0; i < nC; i++) {
        const v = view(globe.cities[i]);
        cpx[i] = cx + v[0] * R;
        cpy[i] = cy - v[1] * R;
        cpz[i] = v[2];
      }

      /* Ground network between cities */
      for (const [i, j] of globe.edges) {
        const zAvg = (cpz[i] + cpz[j]) / 2;
        if (zAvg < 0.02) continue;
        ctx.strokeStyle = `rgba(129,140,248,${(0.06 + zAvg * 0.14) * dim})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cpx[i], cpy[i]);
        ctx.lineTo(cpx[j], cpy[j]);
        ctx.stroke();
      }

      /* City beacons — cyan + violet like the reference */
      for (let i = 0; i < nC; i++) {
        if (cpz[i] < 0.05) continue;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0022 + globe.cityPhase[i]);
        const a = (0.35 + pulse * 0.5) * Math.min(1, cpz[i] + 0.3) * dim;
        const violet = globe.cityViolet[i];
        const core = violet ? '217,70,239' : '125,211,252';
        const len = 2.5 + pulse * 3;
        ctx.strokeStyle = `rgba(${core},${a * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cpx[i] - len, cpy[i]); ctx.lineTo(cpx[i] + len, cpy[i]);
        ctx.moveTo(cpx[i], cpy[i] - len); ctx.lineTo(cpx[i], cpy[i] + len);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(cpx[i], cpy[i], 1.5 + pulse * 0.8, 0, TAU);
        ctx.fillStyle = `rgba(${core},${a})`; ctx.fill();
        ctx.beginPath(); ctx.arc(cpx[i], cpy[i], 5 + pulse * 3, 0, TAU);
        ctx.fillStyle = `rgba(${core},${a * 0.12})`; ctx.fill();
      }

      if (!reduced) {
        /* Tangent-plane ripples */
        if (t - lastRipple > 2100) {
          const front: number[] = [];
          for (let i = 0; i < nC; i++) if (cpz[i] > 0.25) front.push(i);
          if (front.length) {
            lastRipple = t;
            ripples.push({ city: front[(Math.random() * front.length) | 0], t: 0 });
          }
        }
        ripples = ripples.filter(r => r.t < 1);
        for (const rip of ripples) {
          rip.t += 0.016;
          const i = rip.city;
          if (cpz[i] < 0) continue;
          const rr = rip.t * 20;
          const a = (1 - rip.t) * 0.4 * Math.min(1, cpz[i] + 0.2) * dim;
          const ang = Math.atan2(cpy[i] - cy, cpx[i] - cx);
          ctx.beginPath();
          ctx.ellipse(cpx[i], cpy[i], rr, rr * Math.max(0.3, cpz[i]), ang, 0, TAU);
          ctx.strokeStyle = `rgba(125,211,252,${a})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        /* Great-circle traffic arcs between real cities */
        while (arcs.length < (isMob ? 3 : 6)) spawnArc();
        arcs = arcs.filter(a => a.t < 1.6);
        for (const arc of arcs) {
          arc.t += arc.spd;
          const head = Math.min(1, arc.t);
          const tail = Math.max(0, arc.t - 0.55);
          if (tail >= 1) continue;
          const col = arc.violet ? '217,70,239' : '103,232,249';
          const steps = 26;
          let prev: [number, number] | null = null;
          let prevZ = 0;
          for (let s = 0; s <= steps; s++) {
            const f = tail + (head - tail) * (s / steps);
            const m = slerp(arc.a, arc.b, f);
            const lift = 1 + Math.sin(f * Math.PI) * 0.22;
            const v = view(m);
            const x = cx + v[0] * R * lift, y = cy - v[1] * R * lift;
            if (prev && (v[2] > -0.05 || prevZ > -0.05)) {
              const prog = s / steps;
              const a = Math.sin(prog * Math.PI * 0.9 + 0.1) * 0.5 * Math.min(1, v[2] + 0.55) * dim;
              if (a > 0.02) {
                ctx.strokeStyle = `rgba(${col},${a})`;
                ctx.lineWidth = prog > 0.85 ? 1.4 : 0.9;
                ctx.beginPath();
                ctx.moveTo(prev[0], prev[1]);
                ctx.lineTo(x, y);
                ctx.stroke();
              }
            }
            prev = [x, y]; prevZ = v[2];
          }
          if (head < 1 && prev) {
            ctx.beginPath(); ctx.arc(prev[0], prev[1], 1.8, 0, TAU);
            ctx.fillStyle = `rgba(190,225,255,${0.8 * dim})`; ctx.fill();
            ctx.beginPath(); ctx.arc(prev[0], prev[1], 4.6, 0, TAU);
            ctx.fillStyle = `rgba(${col},0.16)`; ctx.fill();
          }
        }

        /* Pulses on the city network */
        while (pulses.length < (isMob ? 4 : 8) && globe.edges.length) {
          pulses.push({ edge: (Math.random() * globe.edges.length) | 0, t: 0, spd: 0.006 + Math.random() * 0.012 });
        }
        pulses = pulses.filter(p => p.t <= 1);
        for (const p of pulses) {
          p.t += p.spd;
          const [i, j] = globe.edges[p.edge];
          const zAvg = (cpz[i] + cpz[j]) / 2;
          if (zAvg < 0) continue;
          const x = cpx[i] + (cpx[j] - cpx[i]) * p.t;
          const y = cpy[i] + (cpy[j] - cpy[i]) * p.t;
          const a = Math.sin(p.t * Math.PI) * (0.35 + zAvg * 0.55) * dim;
          ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU);
          ctx.fillStyle = `rgba(125,211,252,${a})`; ctx.fill();
        }
      }

      /* Marrakech target reticle */
      {
        const v = view(MARRAKECH);
        if (v[2] > 0.12) {
          const x = cx + v[0] * R, y = cy - v[1] * R;
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

      /* Ring system — tick rings + magenta orbital ellipses */
      for (let ri = 0; ri < globe.rings.length; ri++) {
        const ring = globe.rings[ri];
        const drift = t * 0.00003 * ring.dir + scroll * 0.0001 * ring.dir;

        if (ring.magenta) {
          /* Solid magenta orbit — like the reference image */
          ctx.beginPath();
          let pen3 = false;
          let firstFront: [number, number] | null = null;
          for (let k = 0; k <= 90; k++) {
            const a2 = (k / 90) * TAU + drift;
            const m: V3 = [
              ring.u[0] * Math.cos(a2) + ring.w[0] * Math.sin(a2),
              ring.u[1] * Math.cos(a2) + ring.w[1] * Math.sin(a2),
              ring.u[2] * Math.cos(a2) + ring.w[2] * Math.sin(a2),
            ];
            const v = rotZ(m, TILT);
            const x = cx + v[0] * R * ring.r, y = cy - v[1] * R * ring.r;
            const behind = v[2] < 0 && Math.hypot(x - cx, y - cy) < R;
            if (behind) { pen3 = false; continue; }
            if (!pen3) { ctx.moveTo(x, y); pen3 = true; if (!firstFront) firstFront = [x, y]; }
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(232,121,249,${0.42 * dim})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
          /* glowing tracer riding the orbit */
          const ta = t * 0.0004 * ring.dir + ri;
          const tm: V3 = [
            ring.u[0] * Math.cos(ta) + ring.w[0] * Math.sin(ta),
            ring.u[1] * Math.cos(ta) + ring.w[1] * Math.sin(ta),
            ring.u[2] * Math.cos(ta) + ring.w[2] * Math.sin(ta),
          ];
          const tv = rotZ(tm, TILT);
          const tx2 = cx + tv[0] * R * ring.r, ty2 = cy - tv[1] * R * ring.r;
          const tBehind = tv[2] < 0 && Math.hypot(tx2 - cx, ty2 - cy) < R;
          if (!tBehind) {
            ctx.beginPath(); ctx.arc(tx2, ty2, 1.8, 0, TAU);
            ctx.fillStyle = `rgba(240,171,252,${0.9 * dim})`; ctx.fill();
            ctx.beginPath(); ctx.arc(tx2, ty2, 5.5, 0, TAU);
            ctx.fillStyle = 'rgba(217,70,239,0.18)'; ctx.fill();
          }
        } else {
          /* Tick rings */
          for (let k = 0; k < ring.ticks; k++) {
            const a2 = (k / ring.ticks) * TAU + drift;
            const m: V3 = [
              ring.u[0] * Math.cos(a2) + ring.w[0] * Math.sin(a2),
              ring.u[1] * Math.cos(a2) + ring.w[1] * Math.sin(a2),
              ring.u[2] * Math.cos(a2) + ring.w[2] * Math.sin(a2),
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
          const ma = t * 0.00035 * ring.dir + ri * 2;
          const mm: V3 = [
            ring.u[0] * Math.cos(ma) + ring.w[0] * Math.sin(ma),
            ring.u[1] * Math.cos(ma) + ring.w[1] * Math.sin(ma),
            ring.u[2] * Math.cos(ma) + ring.w[2] * Math.sin(ma),
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
