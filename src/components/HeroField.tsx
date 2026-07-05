import { useEffect, useRef } from 'react';

/**
 * Drafting-grid particle field. A lattice of ink points breathes with a slow
 * sine drift; within the pointer's radius, points are pushed away along the
 * displacement vector and tinted vermilion by proximity. Canvas 2D, DPR-capped,
 * paused off-screen, static under prefers-reduced-motion.
 */
export default function HeroField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine    = window.matchMedia('(pointer: fine)').matches;

    let raf = 0;
    let running = true;
    let w = 0, h = 0;
    let pts: { x: number; y: number }[] = [];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gap = w < 640 ? 34 : 27;
      pts = [];
      for (let y = gap / 2; y < h; y += gap)
        for (let x = gap / 2; x < w; x += gap)
          pts.push({ x, y });
    };

    const ink  = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#171310';

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // pointer easing
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;

      const R = 150;
      const time = t * 0.00042;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // ambient drift
        const dxA = Math.sin(time + p.y * 0.011) * 2.4;
        const dyA = Math.cos(time * 0.8 + p.x * 0.009) * 2.4;

        let x = p.x + dxA, y = p.y + dyA;
        let r = 1.05, alpha = 0.16, warm = 0;

        const dx = x - mouse.x, dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R);
          const push = f * f * 30;
          x += (dx / d) * push;
          y += (dy / d) * push;
          r = 1.05 + f * 1.7;
          alpha = 0.16 + f * 0.6;
          warm = f;
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = warm > 0.24 ? `rgba(224,67,13,${alpha})` : hexToRgba(ink, alpha);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const hexToRgba = (hex: string, a: number) => {
      const n = parseInt(hex.replace('#', ''), 16);
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.tx = -9999; mouse.ty = -9999; };

    build();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
      if (fine) {
        window.addEventListener('mousemove', onMove, { passive: true });
        document.documentElement.addEventListener('mouseleave', onLeave);
      }
    }

    const onResize = () => { build(); if (reduced) draw(0); };
    window.addEventListener('resize', onResize);

    const io = new IntersectionObserver(([entry]) => {
      if (reduced) return;
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className={className} aria-hidden
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
