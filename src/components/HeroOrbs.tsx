import { useEffect, useRef } from 'react';

type V3 = [number, number, number];
type LL = [number, number]; // [lat°, lon°]

/* ── Network node positions (lat, lon) ── */
const NODES_D: LL[] = [
  [45,-100],[38,-95],[52,-114],[37,-122],[41,-87],[33,-84],   // N. America
  [51,0],[48,2],[52,13],[40,-3],[55,37],[60,11],              // Europe
  [35,105],[39,116],[55,82],[22,88],[13,77],[31,121],         // Asia
  [1,103],[25,55],                                            // SE Asia / Mid-East
  [9,7],[-1,37],[30,31],[-26,28],                            // Africa
  [-23,-43],[-34,-58],[4,-74],                                // S. America
  [-33,151],[-25,130],                                        // Australia
];
const NODES_M: LL[] = [
  [45,-100],[51,0],[52,13],[55,37],
  [35,105],[39,116],[22,88],
  [9,7],[30,31],[-23,-43],[-33,151],[1,103],
];

/* ── Math helpers ── */
const toRad = (d: number) => d * Math.PI / 180;

function ll2v(lat: number, lon: number): V3 {
  const a = toRad(lat), b = toRad(lon);
  return [Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)];
}

function rotY(v: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0] * c - v[2] * s, v[1], v[0] * s + v[2] * c];
}

function slerp3(a: V3, b: V3, t: number): V3 {
  const dot = Math.max(-1, Math.min(1, a[0]*b[0] + a[1]*b[1] + a[2]*b[2]));
  const omega = Math.acos(dot);
  if (omega < 0.001) return [a[0]*(1-t)+b[0]*t, a[1]*(1-t)+b[1]*t, a[2]*(1-t)+b[2]*t];
  const so = Math.sin(omega);
  const w1 = Math.sin((1-t)*omega)/so, w2 = Math.sin(t*omega)/so;
  return [a[0]*w1+b[0]*w2, a[1]*w1+b[1]*w2, a[2]*w1+b[2]*w2];
}

/* Build edges: sort pairs by distance, cap per-node degree, limit arc distance */
function buildEdges(nodes: LL[], maxDeg: number, maxPer: number): [number,number][] {
  const n = nodes.length;
  const pairs: {i:number;j:number;d:number}[] = [];
  for (let i=0; i<n; i++) {
    for (let j=i+1; j<n; j++) {
      const la=toRad(nodes[i][0]), lo=toRad(nodes[i][1]);
      const lb=toRad(nodes[j][0]), lo2=toRad(nodes[j][1]);
      const dlat=lb-la, dlon=lo2-lo;
      const h = Math.sin(dlat/2)**2 + Math.cos(la)*Math.cos(lb)*Math.sin(dlon/2)**2;
      const d = 2*Math.asin(Math.sqrt(Math.min(1,h)))*180/Math.PI;
      if (d <= maxDeg) pairs.push({i,j,d});
    }
  }
  pairs.sort((a,b)=>a.d-b.d);
  const cnt = new Array(n).fill(0);
  const edges: [number,number][] = [];
  for (const {i,j} of pairs) {
    if (cnt[i]<maxPer && cnt[j]<maxPer) { edges.push([i,j]); cnt[i]++; cnt[j]++; }
  }
  return edges;
}

interface Pulse { edge:number; t:number; spd:number; rev:boolean; }

export default function HeroOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    const isMob = window.innerWidth < 640;

    const NODES = isMob ? NODES_M : NODES_D;
    const vecs: V3[] = NODES.map(([la,lo]) => ll2v(la,lo));
    const edges = buildEdges(NODES, isMob ? 60 : 52, isMob ? 2 : 3);

    /* Per-edge shimmer phase (random, fixed) — gives the "random movement" feel */
    const shimPhase = new Float32Array(edges.length).map(() => Math.random()*Math.PI*2);
    const shimSpeed = new Float32Array(edges.length).map(() => 0.8 + Math.random()*1.4);

    /* Traveling pulses */
    const PULSE_N = isMob ? 5 : 10;
    const pulses: Pulse[] = Array.from({length:PULSE_N}, () => ({
      edge: Math.floor(Math.random() * Math.max(1, edges.length)),
      t:    Math.random(),
      spd:  0.003 + Math.random() * 0.008,
      rev:  Math.random() > 0.5,
    }));

    /* Stars (static per resize) */
    const stars: {x:number;y:number;r:number;a:number}[] = [];

    /* Per-frame reused arrays — no GC pressure in render loop */
    const ppx = new Float32Array(NODES.length);
    const ppy = new Float32Array(NODES.length);
    const ppz = new Float32Array(NODES.length);
    const rVec: V3[] = NODES.map(()=>[0,0,0] as V3);

    const FPS   = isMob ? 24 : 45;
    const FRAME = 1000 / FPS;
    let animId  = 0, lastT = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stars.length  = 0;
      const W = canvas.width, H = canvas.height;
      const n = isMob ? 55 : 100;
      for (let i=0; i<n; i++) {
        stars.push({ x:Math.random()*W, y:Math.random()*H, r:0.4+Math.random()*0.9, a:0.12+Math.random()*0.40 });
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* Optional scroll tilt */
    let stKill: (()=>void)|null = null;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
      gsap.registerPlugin(ScrollTrigger);
      const wrapper = canvas.closest('[data-scene]') as HTMLElement|null;
      if (!wrapper) return;
      const st = ScrollTrigger.create({
        trigger:wrapper, start:'top top', end:'bottom bottom',
        onUpdate:(s:{progress:number})=>{ scrollRef.current=s.progress; },
      });
      stKill = ()=>st.kill();
    });

    const draw = (time: number) => {
      animId = requestAnimationFrame(draw);
      if (time - lastT < FRAME) return;
      lastT = time;

      const W = canvas.width, H = canvas.height;
      const t = time * 0.001;
      ctx.clearRect(0,0,W,H);

      /* Globe size and position */
      const r   = isMob ? Math.min(W,H)*0.48 : Math.min(W,H)*0.42;
      const cx  = isMob ? W*0.74 : W*0.75;
      const cy  = isMob ? H*0.30 : H*0.50;

      /* Rotation: slow auto-rotate + small random wobble for organic feel */
      const angle = t*0.07 + scrollRef.current*0.5;

      /* Project all nodes */
      for (let i=0; i<NODES.length; i++) {
        const rv = rotY(vecs[i], angle);
        rVec[i][0] = rv[0]; rVec[i][1] = rv[1]; rVec[i][2] = rv[2];
        ppx[i] = cx + r*rv[0];
        ppy[i] = cy - r*rv[1];
        ppz[i] = rv[2];
      }

      /* ── Stars ── */
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = '#c8e4ff';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ── Outer atmosphere halo ── */
      const atm2 = ctx.createRadialGradient(cx, cy, r*0.6, cx, cy, r*1.45);
      atm2.addColorStop(0,    'rgba(0,90,255,0)');
      atm2.addColorStop(0.55, 'rgba(0,80,220,0.04)');
      atm2.addColorStop(0.82, 'rgba(0,130,255,0.10)');
      atm2.addColorStop(1,    'rgba(0,60,200,0)');
      ctx.fillStyle = atm2;
      ctx.beginPath(); ctx.arc(cx, cy, r*1.45, 0, Math.PI*2); ctx.fill();

      /* ── Inner atmosphere (rim glow) ── */
      const atm1 = ctx.createRadialGradient(cx, cy, r*0.82, cx, cy, r*1.08);
      atm1.addColorStop(0, 'rgba(0,150,255,0)');
      atm1.addColorStop(0.5,'rgba(0,140,255,0.06)');
      atm1.addColorStop(1,  'rgba(0,190,255,0.14)');
      ctx.fillStyle = atm1;
      ctx.beginPath(); ctx.arc(cx, cy, r*1.08, 0, Math.PI*2); ctx.fill();

      /* ── Base sphere ── */
      const sph = ctx.createRadialGradient(cx-r*0.26, cy-r*0.20, r*0.04, cx, cy, r);
      sph.addColorStop(0,    '#0f2e50');
      sph.addColorStop(0.38, '#071d38');
      sph.addColorStop(0.72, '#040f20');
      sph.addColorStop(1,    '#020812');
      ctx.fillStyle = sph;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();

      /* ── Latitude / longitude grid (clipped to sphere) ── */
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.clip();
      ctx.strokeStyle = 'rgba(0,160,255,0.042)';
      ctx.lineWidth   = 0.5;
      const GSEG = isMob ? 16 : 24;
      for (const latDeg of (isMob ? [-45,-10,30,65] : [-60,-30,0,30,60])) {
        ctx.beginPath();
        let mv = true;
        for (let k=0; k<=GSEG; k++) {
          const rv2 = rotY(ll2v(latDeg, (360/GSEG)*k - 180), angle);
          const sx = cx+r*rv2[0], sy = cy-r*rv2[1];
          mv ? (ctx.moveTo(sx,sy), mv=false) : ctx.lineTo(sx,sy);
        }
        ctx.stroke();
      }
      const MERID = isMob ? 6 : 10;
      for (let m=0; m<MERID; m++) {
        const lonDeg = (360/MERID)*m;
        ctx.beginPath();
        let mv2 = true;
        for (let k=0; k<=GSEG; k++) {
          const rv2 = rotY(ll2v(-90+(180/GSEG)*k, lonDeg), angle);
          const sx = cx+r*rv2[0], sy = cy-r*rv2[1];
          mv2 ? (ctx.moveTo(sx,sy), mv2=false) : ctx.lineTo(sx,sy);
        }
        ctx.stroke();
      }
      ctx.restore();

      /* ── Arcs — back hemisphere (very dim) ── */
      const ARC_S = isMob ? 6 : 8;
      for (let e=0; e<edges.length; e++) {
        const [a,b] = edges[e];
        const avgZ  = (ppz[a]+ppz[b])*0.5;
        if (avgZ >= 0) continue;
        const shimmer = 0.5 + 0.5*Math.sin(t*shimSpeed[e]+shimPhase[e]);
        const alpha   = Math.max(0, -avgZ*0.055) * shimmer;
        if (alpha < 0.004) continue;
        ctx.strokeStyle = `rgba(0,110,220,${alpha.toFixed(3)})`;
        ctx.lineWidth   = 0.4;
        ctx.beginPath();
        for (let k=0; k<=ARC_S; k++) {
          const sp = slerp3(rVec[a], rVec[b], k/ARC_S);
          const sx = cx+r*sp[0], sy = cy-r*sp[1];
          k===0 ? ctx.moveTo(sx,sy) : ctx.lineTo(sx,sy);
        }
        ctx.stroke();
      }

      /* ── Arcs — front hemisphere ── */
      for (let e=0; e<edges.length; e++) {
        const [a,b] = edges[e];
        const avgZ  = (ppz[a]+ppz[b])*0.5;
        if (avgZ <= 0) continue;
        const shimmer = 0.55 + 0.45*Math.sin(t*shimSpeed[e]+shimPhase[e]);
        const alpha   = (0.10 + avgZ*0.38) * shimmer;
        ctx.strokeStyle = `rgba(0,195,255,${alpha.toFixed(3)})`;
        ctx.lineWidth   = isMob ? 0.6 : 0.75;
        ctx.beginPath();
        for (let k=0; k<=ARC_S; k++) {
          const sp = slerp3(rVec[a], rVec[b], k/ARC_S);
          const sx = cx+r*sp[0], sy = cy-r*sp[1];
          k===0 ? ctx.moveTo(sx,sy) : ctx.lineTo(sx,sy);
        }
        ctx.stroke();
      }

      /* ── Traveling pulses ── */
      for (const p of pulses) {
        p.t += p.spd;
        if (p.t > 1 || edges.length === 0) {
          p.t    = 0;
          p.edge = Math.floor(Math.random() * edges.length);
          p.rev  = Math.random() > 0.5;
          p.spd  = 0.003 + Math.random() * 0.009;
          continue;
        }
        const [a,b] = edges[p.edge];
        const tt  = p.rev ? 1-p.t : p.t;
        const sp  = slerp3(rVec[a], rVec[b], tt);
        if (sp[2] < -0.12) continue;               // behind sphere

        const dpx = cx+r*sp[0], dpy = cy-r*sp[1];
        const dz  = Math.max(0, sp[2]);
        const da  = dz*0.80 + 0.20;
        const ds  = isMob ? 1.8 : 2.2;

        /* Glow halo */
        const dg = ctx.createRadialGradient(dpx, dpy, 0, dpx, dpy, ds*3.2);
        dg.addColorStop(0,   `rgba(190,240,255,${da.toFixed(2)})`);
        dg.addColorStop(0.38,`rgba(0,210,255,${(da*0.45).toFixed(2)})`);
        dg.addColorStop(1,   'rgba(0,170,255,0)');
        ctx.fillStyle = dg;
        ctx.beginPath(); ctx.arc(dpx, dpy, ds*3.2, 0, Math.PI*2); ctx.fill();
        /* Core */
        ctx.fillStyle = `rgba(225,248,255,${(da*0.95).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(dpx, dpy, ds*0.55, 0, Math.PI*2); ctx.fill();
      }

      /* ── Node dots ── */
      const NR = isMob ? 1.5 : 1.9;
      for (let i=0; i<NODES.length; i++) {
        if (ppz[i] < -0.10) continue;
        const dz = Math.max(0, ppz[i]);
        const al = dz*0.75 + 0.28;
        /* Glow */
        const ng = ctx.createRadialGradient(ppx[i], ppy[i], 0, ppx[i], ppy[i], NR*3.8);
        ng.addColorStop(0,   `rgba(210,245,255,${al.toFixed(2)})`);
        ng.addColorStop(0.35,`rgba(0,205,255,${(al*0.38).toFixed(2)})`);
        ng.addColorStop(1,   'rgba(0,150,255,0)');
        ctx.fillStyle = ng;
        ctx.beginPath(); ctx.arc(ppx[i], ppy[i], NR*3.8, 0, Math.PI*2); ctx.fill();
        /* Core */
        ctx.fillStyle = `rgba(235,250,255,${(al*0.92).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(ppx[i], ppy[i], NR*0.65, 0, Math.PI*2); ctx.fill();
      }

      /* ── Specular highlight ── */
      const sx = cx-r*0.30, sy = cy-r*0.28;
      const specG = ctx.createRadialGradient(sx, sy, 0, sx, sy, r*0.21);
      specG.addColorStop(0, 'rgba(150,215,255,0.14)');
      specG.addColorStop(1, 'rgba(90,180,255,0)');
      ctx.fillStyle = specG;
      ctx.beginPath(); ctx.arc(sx, sy, r*0.21, 0, Math.PI*2); ctx.fill();
    };

    animId = requestAnimationFrame(draw);
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
