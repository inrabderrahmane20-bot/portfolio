import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface Star {
  xF: number;
  y0: number;
  spd: number;
  r: number;
  al: number;
  trailF: number;
  colR: number; colG: number; colB: number;
}

const PALETTE = [
  [255, 255, 255],   // white  ×3 weight
  [255, 255, 255],
  [255, 255, 255],
  [129, 140, 248],   // indigo
  [56,  189, 248],   // cyan
  [167, 139, 250],   // violet
] as const;

function genStars(n: number): Star[] {
  return Array.from({ length: n }, () => {
    const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    return {
      xF:    Math.random(),
      y0:    Math.random(),
      spd:   0.032 + Math.random() * 0.095,
      r:     0.55 + Math.random() * 1.8,
      al:    0.22 + Math.random() * 0.42,
      trailF: 0.025 + Math.random() * 0.075,
      colR: col[0], colG: col[1], colB: col[2],
    };
  });
}

export default function FallingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router    = useRouter();

  /* Skip rendering on business-cards page (has its own full-screen experience) */
  const hidden = router.pathname === '/business-cards';

  useEffect(() => {
    if (hidden) return;
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d', { alpha: true })!;
    let animId: number;
    let lastT  = 0;
    const isMob  = window.innerWidth < 640;
    const FPS    = isMob ? 24 : 36;
    const FRAME  = 1000 / FPS;
    const stars  = genStars(isMob ? 28 : 65);

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const draw = (ts: number) => {
      animId = requestAnimationFrame(draw);
      if (ts - lastT < FRAME) return;
      lastT = ts;

      const W = canvas.width, H = canvas.height;
      const t = ts * 0.001;
      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        const headY = ((s.y0 + s.spd * t) % 1.1) * H;
        if (headY < 0) continue;
        const px    = s.xF * W;
        const tailY = Math.max(0, headY - s.trailF * H);

        const g = ctx.createLinearGradient(px, tailY, px, headY);
        g.addColorStop(0, `rgba(${s.colR},${s.colG},${s.colB},0)`);
        g.addColorStop(1, `rgba(${s.colR},${s.colG},${s.colB},${s.al})`);

        ctx.beginPath();
        ctx.moveTo(px, tailY);
        ctx.lineTo(px, headY);
        ctx.strokeStyle = g;
        ctx.lineWidth   = s.r * 0.55;
        ctx.lineCap     = 'round';
        ctx.stroke();

        /* Bright head dot */
        ctx.globalAlpha = s.al;
        ctx.fillStyle   = `rgb(${s.colR},${s.colG},${s.colB})`;
        ctx.beginPath();
        ctx.arc(px, headY, s.r * 0.68, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
        width:         '100%',
        height:        '100%',
      }}
    />
  );
}
