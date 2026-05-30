import { useEffect, useRef } from 'react';

type V3 = [number, number, number];
type LL = [number, number]; // [lat°, lon°]

/* ─────────────────────────────────────────────────
   Math helpers
───────────────────────────────────────────────── */
const toRad = (d: number) => d * Math.PI / 180;
const dot3  = (a: V3, b: V3) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];

function ll2v(lat: number, lon: number): V3 {
  const a = toRad(lat), b = toRad(lon);
  return [Math.cos(a)*Math.cos(b), Math.sin(a), Math.cos(a)*Math.sin(b)];
}
function rotY(v: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0]*c - v[2]*s, v[1], v[0]*s + v[2]*c];
}
function slerp3(a: V3, b: V3, t: number): V3 {
  const d   = Math.max(-1, Math.min(1, dot3(a,b)));
  const om  = Math.acos(d);
  if (om < 0.001) return [a[0]*(1-t)+b[0]*t, a[1]*(1-t)+b[1]*t, a[2]*(1-t)+b[2]*t];
  const so = Math.sin(om);
  const w1 = Math.sin((1-t)*om)/so, w2 = Math.sin(t*om)/so;
  return [a[0]*w1+b[0]*w2, a[1]*w1+b[1]*w2, a[2]*w1+b[2]*w2];
}
function randSphere(): V3 {
  const u = Math.random()*2-1, th = Math.random()*Math.PI*2, r = Math.sqrt(1-u*u);
  return [r*Math.cos(th), u, r*Math.sin(th)];
}

/* ─────────────────────────────────────────────────
   Node generation — dense over continents, sparse ocean
   Generated once at module load (stable per page load)
───────────────────────────────────────────────── */
// [latMin, latMax, lonMin, lonMax, countDesktop, countMobile]
const ZONES: [number,number,number,number,number,number][] = [
  [ 20, 72,-168, -55, 22, 10],  // North America
  [-58, 14, -82, -34, 14,  7],  // South America
  [ 35, 72, -12,  42, 14,  7],  // Europe
  [-36, 38, -18,  52, 16,  8],  // Africa
  [ 10, 80,  26,  92, 14,  6],  // W/C Asia
  [-10, 58,  92, 148, 16,  7],  // E/SE Asia
  [-45,-10, 114, 155,  8,  4],  // Australia
  [-80, 80,-180, 180, 16,  7],  // Ocean scatter
];

function seedNodes(isMob: boolean): LL[] {
  const r: LL[] = [];
  for (const [la0,la1,lo0,lo1,nd,nm] of ZONES) {
    const n = isMob ? nm : nd;
    for (let i=0; i<n; i++) {
      r.push([la0+Math.random()*(la1-la0), lo0+Math.random()*(lo1-lo0)]);
    }
  }
  return r;
}

// Fixed at module load → same pattern per page visit
const LL_D = seedNodes(false);
const LL_M = seedNodes(true);

/* Outer-orbit unit vectors (at r*ORBIT_R in rendering) */
const ORBIT_D: V3[] = Array.from({length:22}, randSphere);
const ORBIT_M: V3[] = Array.from({length:10}, randSphere);
const ORBIT_R = 1.38; // multiplier on globe radius

/* ─────────────────────────────────────────────────
   Edge building (K-nearest triangulation)
───────────────────────────────────────────────── */
function knnEdges(vecs: V3[], k: number): [number,number][] {
  const n = vecs.length;
  const seen = new Set<number>();
  const out: [number,number][] = [];
  for (let i=0; i<n; i++) {
    // sort others by descending dot (= ascending angular distance)
    const sorted: number[] = Array.from({length:n},(_,j)=>j)
      .filter(j=>j!==i)
      .sort((ja,jb) => dot3(vecs[jb],vecs[i]) - dot3(vecs[ja],vecs[i]));
    for (let ki=0; ki<k && ki<sorted.length; ki++) {
      const j = sorted[ki];
      const key = i<j ? i*n+j : j*n+i;
      if (!seen.has(key)) { seen.add(key); out.push([i,j]); }
    }
  }
  return out;
}

function orbitEdges(
  oVecs: V3[], sVecs: V3[], oPer: number, sToPer: number
): { oo:[number,number][]; os:[number,number][] } {
  const no = oVecs.length, ns = sVecs.length;
  const seen = new Set<number>();
  const oo: [number,number][] = [];
  for (let i=0; i<no; i++) {
    const sorted = Array.from({length:no},(_,j)=>j)
      .filter(j=>j!==i)
      .sort((ja,jb) => dot3(oVecs[jb],oVecs[i]) - dot3(oVecs[ja],oVecs[i]));
    for (let k=0; k<oPer && k<sorted.length; k++) {
      const j = sorted[k];
      const key = i<j ? i*no+j : j*no+i;
      if (!seen.has(key)) { seen.add(key); oo.push([i,j]); }
    }
  }
  const os: [number,number][] = [];
  for (let i=0; i<no; i++) {
    const sorted = Array.from({length:ns},(_,j)=>j)
      .sort((ja,jb) => dot3(sVecs[jb],oVecs[i]) - dot3(sVecs[ja],oVecs[i]));
    for (let k=0; k<sToPer && k<sorted.length; k++) os.push([i, sorted[k]]);
  }
  return {oo, os};
}

/* ─────────────────────────────────────────────────
   Component
───────────────────────────────────────────────── */
interface Pulse { edge:number; t:number; spd:number; rev:boolean; isOrbit:boolean; }

export default function HeroOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    const isMob = window.innerWidth < 640;

    /* ── Build geometry ── */
    const llNodes   = isMob ? LL_M     : LL_D;
    const oNodes    = isMob ? ORBIT_M  : ORBIT_D;
    const surfVecs  = llNodes.map(([la,lo]) => ll2v(la,lo));
    const surfEdges = knnEdges(surfVecs, isMob ? 4 : 5);
    const {oo: orbitOO, os: orbitOS} = orbitEdges(oNodes, surfVecs, isMob ? 3 : 3, isMob ? 1 : 2);

    /* Per-edge shimmer (gives organic "random movement" feel) */
    const nSE = surfEdges.length;
    const shimPh  = new Float32Array(nSE + orbitOO.length + orbitOS.length);
    const shimSpd = new Float32Array(nSE + orbitOO.length + orbitOS.length);
    for (let i=0; i<shimPh.length; i++) {
      shimPh[i]  = Math.random()*Math.PI*2;
      shimSpd[i] = 0.7 + Math.random()*1.8;
    }

    /* Stars */
    const stars: {x:number;y:number;r:number;a:number}[] = [];

    /* Pulses across surface + orbit-surface edges */
    const allPulseEdges = surfEdges.length + orbitOS.length;
    const PULSE_N = isMob ? 12 : 28;
    const pulses: Pulse[] = Array.from({length:PULSE_N}, () => {
      const isOrbit = Math.random() > 0.7 && orbitOS.length > 0;
      return {
        edge:    Math.floor(Math.random() * (isOrbit ? orbitOS.length : surfEdges.length)),
        t:       Math.random(),
        spd:     0.004 + Math.random()*0.010,
        rev:     Math.random() > 0.5,
        isOrbit,
      };
    });

    /* Reusable per-frame projected arrays */
    const ns = surfVecs.length, no = oNodes.length;
    const spx = new Float32Array(ns), spy = new Float32Array(ns), spz = new Float32Array(ns);
    const opx = new Float32Array(no), opy = new Float32Array(no), opz = new Float32Array(no);
    const srV: V3[] = surfVecs.map(()=>[0,0,0] as V3);
    const orV: V3[] = oNodes.map(()=>[0,0,0] as V3);

    const FPS   = isMob ? 24 : 48;
    const FRAME = 1000/FPS;
    let animId  = 0, lastT = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stars.length  = 0;
      const W = canvas.width, H = canvas.height;
      for (let i=0; i<(isMob?80:160); i++) {
        stars.push({x:Math.random()*W, y:Math.random()*H, r:0.3+Math.random()*1.1, a:0.10+Math.random()*0.50});
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* Scroll tracking */
    let stKill: (()=>void)|null = null;
    Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
      gsap.registerPlugin(ScrollTrigger);
      const wr = canvas.closest('[data-scene]') as HTMLElement|null;
      if (!wr) return;
      const st = ScrollTrigger.create({trigger:wr,start:'top top',end:'bottom bottom',
        onUpdate:(s:{progress:number})=>{ scrollRef.current=s.progress; }});
      stKill = ()=>st.kill();
    });

    /* ═══════════════ RENDER ═══════════════ */
    const draw = (time: number) => {
      animId = requestAnimationFrame(draw);
      if (time - lastT < FRAME) return;
      lastT = time;

      const W = canvas.width, H = canvas.height;
      const t = time * 0.001;
      ctx.clearRect(0,0,W,H);

      /* Globe layout */
      const r  = isMob ? Math.min(W,H)*0.50 : Math.min(W,H)*0.44;
      const cx = isMob ? W*0.72 : W*0.74;
      const cy = isMob ? H*0.32 : H*0.50;
      const angle = t*0.06 + scrollRef.current*0.5;

      /* ── Project surface nodes ── */
      for (let i=0; i<ns; i++) {
        const rv = rotY(surfVecs[i], angle);
        srV[i][0]=rv[0]; srV[i][1]=rv[1]; srV[i][2]=rv[2];
        spx[i]=cx+r*rv[0]; spy[i]=cy-r*rv[1]; spz[i]=rv[2];
      }
      /* ── Project orbit nodes (at larger radius) ── */
      for (let i=0; i<no; i++) {
        const rv = rotY(oNodes[i], angle);
        orV[i][0]=rv[0]; orV[i][1]=rv[1]; orV[i][2]=rv[2];
        opx[i]=cx+r*ORBIT_R*rv[0]; opy[i]=cy-r*ORBIT_R*rv[1]; opz[i]=rv[2];
      }

      /* ── Stars ── */
      for (const s of stars) {
        ctx.globalAlpha = s.a * (0.6 + 0.4*Math.sin(t*0.8+s.x));
        ctx.fillStyle = '#d4eeff';
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ── Outer atmosphere halo ── */
      const atm3 = ctx.createRadialGradient(cx,cy,r*0.5,cx,cy,r*1.7);
      atm3.addColorStop(0,'rgba(0,80,220,0)');
      atm3.addColorStop(0.5,'rgba(0,80,200,0.05)');
      atm3.addColorStop(0.8,'rgba(0,130,255,0.12)');
      atm3.addColorStop(1,'rgba(0,60,180,0)');
      ctx.fillStyle=atm3; ctx.beginPath(); ctx.arc(cx,cy,r*1.7,0,Math.PI*2); ctx.fill();

      /* ── Back-hemisphere orbit-orbit edges (very dim) ── */
      for (let e=0; e<orbitOO.length; e++) {
        const [a,b]=orbitOO[e];
        if (opz[a]>0&&opz[b]>0) continue;
        const avgZ=(opz[a]+opz[b])*0.5;
        if (avgZ>0.1) continue;
        const shimmer = 0.4+0.6*Math.sin(t*shimSpd[nSE+e]+shimPh[nSE+e]);
        ctx.strokeStyle=`rgba(0,100,200,${(Math.max(0,-avgZ)*0.05*shimmer).toFixed(3)})`;
        ctx.lineWidth=0.4;
        ctx.beginPath(); ctx.moveTo(opx[a],opy[a]); ctx.lineTo(opx[b],opy[b]); ctx.stroke();
      }

      /* ── Back-hemisphere surface edges ── */
      const ARC = isMob ? 5 : 7;
      for (let e=0; e<surfEdges.length; e++) {
        const [a,b]=surfEdges[e];
        if (spz[a]>0||spz[b]>0) continue;
        const avgZ=(spz[a]+spz[b])*0.5;
        const shimmer=0.4+0.6*Math.sin(t*shimSpd[e]+shimPh[e]);
        const alpha=Math.max(0,-avgZ*0.08)*shimmer;
        if (alpha<0.004) continue;
        ctx.strokeStyle=`rgba(0,120,220,${alpha.toFixed(3)})`;
        ctx.lineWidth=0.5;
        ctx.beginPath();
        for (let k=0;k<=ARC;k++){
          const sp=slerp3(srV[a],srV[b],k/ARC);
          const sx=cx+r*sp[0],sy=cy-r*sp[1];
          k===0?ctx.moveTo(sx,sy):ctx.lineTo(sx,sy);
        }
        ctx.stroke();
      }

      /* ── Sphere base ── */
      const sph=ctx.createRadialGradient(cx-r*0.22,cy-r*0.18,r*0.04,cx+r*0.12,cy+r*0.08,r*1.05);
      sph.addColorStop(0,  '#163760');
      sph.addColorStop(0.3,'#0b2440');
      sph.addColorStop(0.65,'#050f1e');
      sph.addColorStop(1,  '#020810');
      ctx.fillStyle=sph; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();

      /* ── Equatorial glow band (inner sphere top) ── */
      const eqG=ctx.createRadialGradient(cx-r*0.2,cy-r*0.1,r*0.15,cx,cy,r*0.95);
      eqG.addColorStop(0,'rgba(0,160,255,0.12)');
      eqG.addColorStop(0.6,'rgba(0,120,255,0.04)');
      eqG.addColorStop(1,'rgba(0,80,200,0)');
      ctx.fillStyle=eqG; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();

      /* ── Grid lines (clipped to sphere) ── */
      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip();
      ctx.strokeStyle='rgba(0,170,255,0.055)';
      ctx.lineWidth=0.5;
      const GSEG=isMob?14:20;
      for (const latDeg of(isMob?[-60,-30,0,30,60]:[-75,-60,-45,-30,-15,0,15,30,45,60,75])){
        ctx.beginPath(); let mv=true;
        for(let k=0;k<=GSEG;k++){
          const rv=rotY(ll2v(latDeg,(360/GSEG)*k-180),angle);
          const sx=cx+r*rv[0],sy=cy-r*rv[1];
          mv?(ctx.moveTo(sx,sy),mv=false):ctx.lineTo(sx,sy);
        }
        ctx.stroke();
      }
      const MERID=isMob?8:14;
      for(let m=0;m<MERID;m++){
        const lonDeg=(360/MERID)*m;
        ctx.beginPath(); let mv2=true;
        for(let k=0;k<=GSEG;k++){
          const rv=rotY(ll2v(-90+(180/GSEG)*k,lonDeg),angle);
          const sx=cx+r*rv[0],sy=cy-r*rv[1];
          mv2?(ctx.moveTo(sx,sy),mv2=false):ctx.lineTo(sx,sy);
        }
        ctx.stroke();
      }
      ctx.restore();

      /* ── Front-hemisphere surface edges (bright triangulated mesh) ── */
      for (let e=0; e<surfEdges.length; e++) {
        const [a,b]=surfEdges[e];
        const avgZ=(spz[a]+spz[b])*0.5;
        if (avgZ<=0&&spz[a]<=0&&spz[b]<=0) continue;
        const shimmer=0.55+0.45*Math.sin(t*shimSpd[e]+shimPh[e]);
        const alpha=(0.18+Math.max(0,avgZ)*0.50)*shimmer;
        ctx.strokeStyle=`rgba(0,200,255,${Math.min(0.85,alpha).toFixed(3)})`;
        ctx.lineWidth = avgZ > 0.5 ? (isMob?0.9:1.1) : (isMob?0.6:0.75);
        ctx.beginPath();
        for(let k=0;k<=ARC;k++){
          const sp=slerp3(srV[a],srV[b],k/ARC);
          const sx=cx+r*sp[0],sy=cy-r*sp[1];
          k===0?ctx.moveTo(sx,sy):ctx.lineTo(sx,sy);
        }
        ctx.stroke();
      }

      /* ── Orbit-surface edges (front hemisphere, lines extending into space) ── */
      for(let e=0;e<orbitOS.length;e++){
        const [oi,si]=orbitOS[e];
        const avgZ=(opz[oi]+spz[si])*0.5;
        if(avgZ<-0.2) continue;
        const shimmer=0.5+0.5*Math.sin(t*shimSpd[nSE+orbitOO.length+e]+shimPh[nSE+orbitOO.length+e]);
        const alpha=(0.08+Math.max(0,avgZ)*0.30)*shimmer;
        ctx.strokeStyle=`rgba(80,210,255,${alpha.toFixed(3)})`;
        ctx.lineWidth=0.6;
        ctx.beginPath(); ctx.moveTo(spx[si],spy[si]); ctx.lineTo(opx[oi],opy[oi]); ctx.stroke();
      }

      /* ── Front orbit-orbit edges ── */
      for(let e=0;e<orbitOO.length;e++){
        const [a,b]=orbitOO[e];
        const avgZ=(opz[a]+opz[b])*0.5;
        if(avgZ<0) continue;
        const shimmer=0.5+0.5*Math.sin(t*shimSpd[nSE+e]+shimPh[nSE+e]);
        const alpha=(0.12+avgZ*0.28)*shimmer;
        ctx.strokeStyle=`rgba(120,220,255,${alpha.toFixed(3)})`;
        ctx.lineWidth=0.7;
        ctx.beginPath(); ctx.moveTo(opx[a],opy[a]); ctx.lineTo(opx[b],opy[b]); ctx.stroke();
      }

      /* ── Traveling pulses ── */
      for(const p of pulses){
        p.t += p.spd;
        if(p.t>1){
          p.t=0; p.rev=Math.random()>0.5; p.spd=0.004+Math.random()*0.012;
          if(p.isOrbit && orbitOS.length>0)
            p.edge=Math.floor(Math.random()*orbitOS.length);
          else
            p.edge=Math.floor(Math.random()*surfEdges.length);
          continue;
        }
        const tt=p.rev?1-p.t:p.t;
        let dpx:number, dpy:number, dpz:number;

        if(p.isOrbit && p.edge<orbitOS.length){
          const [oi,si]=orbitOS[p.edge];
          dpx=spx[si]+(opx[oi]-spx[si])*tt;
          dpy=spy[si]+(opy[oi]-spy[si])*tt;
          dpz=(spz[si]+opz[oi])*0.5;
        } else {
          const ei=Math.min(p.edge,surfEdges.length-1);
          const [a,b]=surfEdges[ei];
          const sp=slerp3(srV[a],srV[b],tt);
          dpx=cx+r*sp[0]; dpy=cy-r*sp[1]; dpz=sp[2];
        }
        if(dpz<-0.12) continue;

        const da=Math.max(0,dpz)*0.75+0.25;
        const ds=isMob?2.0:2.6;
        /* Tail glow */
        const pg=ctx.createRadialGradient(dpx,dpy,0,dpx,dpy,ds*3.5);
        pg.addColorStop(0,`rgba(210,248,255,${da.toFixed(2)})`);
        pg.addColorStop(0.35,`rgba(0,220,255,${(da*0.40).toFixed(2)})`);
        pg.addColorStop(1,'rgba(0,170,255,0)');
        ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(dpx,dpy,ds*3.5,0,Math.PI*2); ctx.fill();
        /* Core */
        ctx.fillStyle=`rgba(240,252,255,${(da*0.96).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(dpx,dpy,ds*0.55,0,Math.PI*2); ctx.fill();
      }

      /* ── Surface node dots ── */
      const NR=isMob?1.6:2.0;
      for(let i=0;i<ns;i++){
        if(spz[i]<-0.08) continue;
        const dz=Math.max(0,spz[i]);
        const al=dz*0.80+0.25;
        /* Glow halo */
        const ng=ctx.createRadialGradient(spx[i],spy[i],0,spx[i],spy[i],NR*4.2);
        ng.addColorStop(0,`rgba(220,248,255,${al.toFixed(2)})`);
        ng.addColorStop(0.30,`rgba(0,210,255,${(al*0.35).toFixed(2)})`);
        ng.addColorStop(1,'rgba(0,160,255,0)');
        ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(spx[i],spy[i],NR*4.2,0,Math.PI*2); ctx.fill();
        /* Core dot */
        ctx.fillStyle=`rgba(245,252,255,${(al*0.95).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(spx[i],spy[i],NR*0.70,0,Math.PI*2); ctx.fill();
      }

      /* ── Orbit node dots ── */
      const OR=isMob?1.3:1.6;
      for(let i=0;i<no;i++){
        if(opz[i]<-0.08) continue;
        const dz=Math.max(0,opz[i]);
        const al=dz*0.70+0.25;
        const og=ctx.createRadialGradient(opx[i],opy[i],0,opx[i],opy[i],OR*4);
        og.addColorStop(0,`rgba(180,240,255,${al.toFixed(2)})`);
        og.addColorStop(0.35,`rgba(0,200,255,${(al*0.30).toFixed(2)})`);
        og.addColorStop(1,'rgba(0,150,255,0)');
        ctx.fillStyle=og; ctx.beginPath(); ctx.arc(opx[i],opy[i],OR*4,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=`rgba(230,250,255,${(al*0.90).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(opx[i],opy[i],OR*0.65,0,Math.PI*2); ctx.fill();
      }

      /* ── Inner atmosphere rim (over globe) ── */
      const rim=ctx.createRadialGradient(cx,cy,r*0.85,cx,cy,r*1.06);
      rim.addColorStop(0,'rgba(0,160,255,0)');
      rim.addColorStop(0.55,'rgba(0,160,255,0.06)');
      rim.addColorStop(1,'rgba(0,200,255,0.18)');
      ctx.fillStyle=rim; ctx.beginPath(); ctx.arc(cx,cy,r*1.06,0,Math.PI*2); ctx.fill();

      /* ── Specular highlight (lit side) ── */
      const slx=cx-r*0.28, sly=cy-r*0.26;
      const specG=ctx.createRadialGradient(slx,sly,0,slx,sly,r*0.28);
      specG.addColorStop(0,'rgba(160,225,255,0.22)');
      specG.addColorStop(0.5,'rgba(80,180,255,0.08)');
      specG.addColorStop(1,'rgba(60,160,255,0)');
      ctx.fillStyle=specG; ctx.beginPath(); ctx.arc(slx,sly,r*0.28,0,Math.PI*2); ctx.fill();
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
