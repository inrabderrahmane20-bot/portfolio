import { useEffect, useRef } from 'react';

interface Star {
  x: number; y: number;      // 0..1 normalised
  z: number;                 // depth layer 0..1 (far..near)
  r: number;
  tw: number;                // twinkle phase
  hue: 'white' | 'indigo' | 'cyan';
}

interface Comet {
  x: number; y: number; vx: number; vy: number; life: number; max: number;
}

/**
 * Deep-field backdrop: three drifting aurora blobs (CSS) under a canvas
 * starfield — three parallax depth layers tied to scroll, per-star twinkle,
 * and a shooting star every few seconds. DPR-capped, reduced-motion aware.
 */
export default function SpaceBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let W = 0, H = 0;
    let stars: Star[] = [];
    let comets: Comet[] = [];
    let lastComet = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = W < 640 ? 90 : 170;
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        r: 0.4 + Math.random() * 1.1,
        tw: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.72 ? 'white' : Math.random() < 0.6 ? 'indigo' : 'cyan',
      }));
    };

    const COLORS = {
      white:  (a: number) => `rgba(238,241,255,${a})`,
      indigo: (a: number) => `rgba(165,180,252,${a})`,
      cyan:   (a: number) => `rgba(125,211,252,${a})`,
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const scroll = window.scrollY;
      const time = t * 0.0012;

      for (const s of stars) {
        // deeper stars drift less with scroll — parallax
        const py = ((s.y * H - scroll * (0.02 + s.z * 0.09)) % H + H) % H;
        const px = s.x * W;
        const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(time + s.tw));
        const alpha = (0.16 + s.z * 0.5) * twinkle;
        ctx.beginPath();
        ctx.arc(px, py, s.r + s.z * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[s.hue](alpha);
        ctx.fill();
        // bright ones get a soft halo
        if (s.z > 0.85) {
          ctx.beginPath();
          ctx.arc(px, py, (s.r + 1.6) * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = COLORS[s.hue](alpha * 0.08);
          ctx.fill();
        }
      }

      // shooting star every ~6–11s
      if (t - lastComet > 6000 + Math.random() * 5000 && comets.length < 2) {
        lastComet = t;
        const fromLeft = Math.random() < 0.5;
        comets.push({
          x: fromLeft ? -40 : W * (0.4 + Math.random() * 0.6),
          y: H * Math.random() * 0.4,
          vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 5),
          vy: 2.4 + Math.random() * 2,
          life: 0,
          max: 60 + Math.random() * 30,
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
