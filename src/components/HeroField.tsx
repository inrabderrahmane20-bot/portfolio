import { useEffect, useRef } from 'react';

/**
 * Constellation grid. A lattice of starlight points breathes with a slow
 * sine drift; within the pointer's radius points displace outward, ignite
 * cyan, and link to their neighbours with luminous constellation lines.
 * Canvas 2D, DPR-capped, paused off-screen, static under reduced-motion.
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
    let gap = 27;
    let pts: { x: number; y: number }[] = [];
    let cols = 0;
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

      gap = w < 640 ? 36 : 28;
      pts = [];
      cols = 0;
      for (let x = gap / 2; x < w; x += gap) cols++;
      for (let y = gap / 2; y < h; y += gap)
        for (let x = gap / 2; x < w; x += gap)
          pts.push({ x, y });
    };

    const R = 160;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;

      const time = t * 0.00042;
      // displaced positions + activation, so lines can reuse them
      const px = new Float32Array(pts.length);
      const py = new Float32Array(pts.length);
      const act = new Float32Array(pts.length);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let x = p.x + Math.sin(time + p.y * 0.011) * 2.6;
        let y = p.y + Math.cos(time * 0.8 + p.x * 0.009) * 2.6;

        const dx = x - mouse.x, dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        let f = 0;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          f = 1 - d / R;
          const push = f * f * 26;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }
        px[i] = x; py[i] = y; act[i] = f;

        const r = 1 + f * 1.8;
        const alpha = 0.13 + f * 0.75;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = f > 0.18
          ? `rgba(125,211,252,${alpha})`
          : `rgba(238,241,255,${alpha})`;
        ctx.fill();
        if (f > 0.5) {
          ctx.beginPath();
          ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56,189,248,${f * 0.09})`;
          ctx.fill();
        }
      }

      // constellation lines between activated neighbours (right + down)
      for (let i = 0; i < pts.length; i++) {
        const a = act[i];
        if (a < 0.14) continue;
        const right = (i + 1) % cols !== 0 ? i + 1 : -1;
        const down  = i + cols < pts.length ? i + cols : -1;
        for (const j of [right, down]) {
          if (j < 0) continue;
          const b = act[j];
          if (b < 0.14) continue;
          const s = Math.min(a, b);
          ctx.strokeStyle = `rgba(129,140,248,${s * 0.55})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(px[j], py[j]);
          ctx.stroke();
        }
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
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
