import { useEffect, useRef } from 'react';

/* ── Config ──────────────────────────────────────────────────────────── */
const ORBITALS: {
  r: number; size: number; dur: number;
  tiltX: number; startZ: number; delay: number; dir: 1 | -1;
}[] = [
  { r: 230, size: 12, dur: 10,   tiltX: 72,  startZ: 15,   delay: 0,    dir:  1 },
  { r: 310, size: 8,  dur: 15,   tiltX: 60,  startZ: -30,  delay: 1.6,  dir: -1 },
  { r: 168, size: 16, dur: 7.5,  tiltX: 82,  startZ: 52,   delay: 0.7,  dir:  1 },
  { r: 400, size: 6,  dur: 20,   tiltX: 50,  startZ: -8,   delay: 3.1,  dir: -1 },
  { r: 275, size: 10, dur: 12,   tiltX: 68,  startZ: 74,   delay: 2.2,  dir:  1 },
  { r: 145, size: 6,  dur: 5.5,  tiltX: 86,  startZ: -48,  delay: 0.4,  dir: -1 },
  { r: 460, size: 5,  dur: 25,   tiltX: 44,  startZ: 20,   delay: 4,    dir:  1 },
];

const KEYFRAMES = ORBITALS.map(({ tiltX, startZ, dir }, i) => `
  @keyframes __orb_${i} {
    from { transform: rotateX(${tiltX}deg) rotateZ(${startZ}deg); }
    to   { transform: rotateX(${tiltX}deg) rotateZ(${startZ + dir * 360}deg); }
  }
`).join('');

/* Sphere gradients — light with warm depth tones */
const ORB1_BG = [
  /* main sphere: light with warm edge highlight */
  'radial-gradient(circle at 28% 26%, rgba(203,184,160,0.40) 0%, rgba(221,210,195,0.50) 30%, rgba(243,239,231,0.95) 65%, transparent 85%)',
  /* subtle rim light */
  'radial-gradient(circle at 72% 72%, rgba(30,30,30,0.08) 0%, transparent 45%)',
].join(', ');

const ORB2_BG = [
  'radial-gradient(circle at 32% 30%, rgba(203,184,160,0.35) 0%, rgba(221,210,195,0.50) 30%, rgba(243,239,231,0.95) 65%, transparent 85%)',
  'radial-gradient(circle at 65% 65%, rgba(30,30,30,0.08) 0%, transparent 40%)',
].join(', ');

export default function HeroOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref      = useRef<HTMLDivElement>(null);
  const orb2Ref      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let tl: any;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        const hero = containerRef.current?.closest('section');
        if (!hero || !orb1Ref.current || !orb2Ref.current) return;

        tl = gsap.timeline({
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 2.5 },
          defaults: { ease: 'sine.inOut' },
        });

        /* Orb 1 — positive sine */
        tl.to(orb1Ref.current, { x: '13vw', y: '-9vh',  scale: 0.88 }, 0)
          .to(orb1Ref.current, { x: '-5vw', y:  '2vh',  scale: 1.06 })
          .to(orb1Ref.current, { x:  '9vw', y: '11vh',  scale: 0.86 })
          .to(orb1Ref.current, { x: '-3vw', y: '19vh',  scale: 1.0  });

        /* Orb 2 — negative sine */
        tl.to(orb2Ref.current, { x: '-13vw', y:  '9vh', scale: 0.86 }, 0)
          .to(orb2Ref.current, { x:   '7vw', y: '-3vh', scale: 1.06 }, '<')
          .to(orb2Ref.current, { x:  '-7vw', y:  '4vh', scale: 0.90 }, '<')
          .to(orb2Ref.current, { x:   '4vw', y: '15vh', scale: 1.0  }, '<');
      },
    );
    return () => tl?.kill();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: '1100px' }}
    >
      <style>{KEYFRAMES}</style>

      {/* ── Giant Orb 1 — dark charcoal sphere, subtle cool tint ── */}
      <div
        ref={orb1Ref}
        style={{
          position: 'absolute',
          width: 'clamp(320px,40vw,640px)', height: 'clamp(320px,40vw,640px)',
          top: '-14%', right: '-9%',
          borderRadius: '50%',
          background: ORB1_BG,
          /* very subtle glow — barely visible */
          boxShadow: '0 0 60px rgba(18,18,18,0.08), inset 0 0 50px rgba(30,30,30,0.08)',
          willChange: 'transform',
        }}
      />

      {/* ── Giant Orb 2 — darker steel sphere ─────────────────── */}
      <div
        ref={orb2Ref}
        style={{
          position: 'absolute',
          width: 'clamp(260px,33vw,530px)', height: 'clamp(260px,33vw,530px)',
          top: '8%', right: '3%',
          borderRadius: '50%',
          background: ORB2_BG,
          boxShadow: '0 0 40px rgba(18,18,18,0.08), inset 0 0 35px rgba(30,30,30,0.08)',
          willChange: 'transform',
        }}
      />

      {/* ── Orbital ring system — small, subtle planets ────────── */}
      <div style={{ position: 'absolute', top: '30%', right: '21%', transformStyle: 'preserve-3d' }}>
        {ORBITALS.map((orb, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: orb.r * 2, height: orb.r * 2,
              top: -orb.r, left: -orb.r,
              borderRadius: '50%',
              /* ring trace — almost invisible */
              border: '1px solid rgba(30,30,30,0.04)',
              transformStyle: 'preserve-3d',
              animation: `__orb_${i} ${orb.dur}s linear ${orb.delay}s infinite`,
            }}
          >
            {/* Planet dot */}
            <div style={{
              position: 'absolute',
              width: orb.size, height: orb.size,
              top: -(orb.size / 2),
              left: `calc(50% - ${orb.size / 2}px)`,
              borderRadius: '50%',
              /* warm-toned, very subtle */
              background: `radial-gradient(circle at 35% 35%, rgba(30,30,30,${0.12 + (i % 3) * 0.04}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${orb.size * 1.5}px rgba(30,30,30,0.08)`,
            }} />
          </div>
        ))}
      </div>

      {/* ── One small accent dot — the ONLY use of #1E1E1E here ── */}
      <div style={{
        position: 'absolute', bottom: '37%', right: '24%',
        width: 6, height: 6, borderRadius: '50%',
        backgroundColor: '#1E1E1E',
        boxShadow: '0 0 8px rgba(30,30,30,0.08)',
        animation: '__orb_1 7s ease-in-out 1s infinite',
      }} />
    </div>
  );
}
