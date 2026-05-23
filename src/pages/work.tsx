import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { workItems } from '@/lib/content';
import AuroraBackground from '@/components/AuroraBackground';

const BG      = '#030308';
const SURF    = '#07071a';
const TEXT    = '#ffffff';
const TEXT2   = 'rgba(255,255,255,0.62)';
const MUTED   = 'rgba(255,255,255,0.32)';
const BDR     = 'rgba(255,255,255,0.07)';
const BDRGLOW = 'rgba(129,140,248,0.38)';
const ACCENT  = '#818cf8';
const ACCENT2 = '#38bdf8';

/* Category badge colour cycling */
const BADGE_COLS = [ACCENT, ACCENT2, '#a78bfa', '#34d399', ACCENT];

export default function Work() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from('.hero-word', { y: '115%', duration: 1.1, stagger: 0.08, ease: 'power4.out', delay: 0.15 });
        gsap.from('.hero-meta', { opacity: 0, y: 16, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: 0.5 });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  return (
    <div className="overflow-x-hidden relative" style={{ backgroundColor: BG, minHeight: '100dvh' }}>
      <AuroraBackground />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-between px-5 sm:px-[5vw] pt-28 pb-12 overflow-hidden"
        style={{ zIndex: 1, minHeight: '45vh', color: TEXT }}
      >
        <div aria-hidden className="pointer-events-none absolute top-0 right-0"
          style={{
            width: 'clamp(180px,35vw,440px)', height: 'clamp(180px,35vw,440px)',
            background: 'radial-gradient(circle at 60% 25%, rgba(56,189,248,0.10), transparent 65%)',
          }} />

        <div className="hero-meta relative z-10 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em]" style={{ color: ACCENT2 }}>Portfolio</span>
          <span className="block w-5 h-px" style={{ backgroundColor: 'rgba(56,189,248,0.38)' }} />
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em]" style={{ color: MUTED }}>
            {workItems.length} Projects
          </span>
        </div>

        <div className="relative z-10 py-8">
          <h1
            className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3rem,9.5vw,11rem)', color: TEXT }}
          >
            {['Selected', 'Work'].map((w) => (
              <div key={w} className="overflow-hidden">
                <span className="hero-word block">{w}</span>
              </div>
            ))}
          </h1>
        </div>

        <p className="hero-meta relative z-10 font-sans text-sm leading-7 font-light max-w-lg" style={{ color: TEXT2 }}>
          A collection of real-world projects — each one designed and built from concept to launch.
        </p>
      </section>

      {/* ── Gallery ─────────────────────────────────────────────────── */}
      <section
        className="relative"
        style={{ zIndex: 1, backgroundColor: 'rgba(7,7,26,0.72)', backdropFilter: 'blur(2px)', padding: '5rem 0 7rem', borderTop: `1px solid ${BDR}` }}
      >
        <div className="container">
          {/* 2-column grid; last item spans full width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
            {workItems.map((item, i) => {
              const isWide    = i === workItems.length - 1;
              const badgeCol  = BADGE_COLS[i % BADGE_COLS.length];
              const imgSrc    = (item as any).image as string | undefined;

              return (
                <motion.article
                  key={item.slug}
                  className={isWide ? 'sm:col-span-2' : ''}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.08 }}
                >
                  {/* Screenshot */}
                  <div
                    className={`relative overflow-hidden rounded-xl mb-5 ${isWide ? 'aspect-[21/8]' : 'aspect-[4/3]'}`}
                    style={{ border: `1px solid ${BDR}` }}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', objectPosition: 'top',
                          display: 'block',
                          transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                    )}

                    {/* Subtle gradient overlay at bottom for text legibility */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(3,3,8,0.45), transparent)' }}
                    />
                  </div>

                  {/* Info block */}
                  <div className="px-1">
                    {/* Row: number + year */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono text-[0.60rem] uppercase tracking-[0.20em] px-2.5 py-1 rounded-full"
                          style={{ color: badgeCol, border: `1px solid ${badgeCol}40`, background: `${badgeCol}10` }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                        {item.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      className="font-display font-bold tracking-[-0.02em] leading-[1.05] mb-3"
                      style={{ fontSize: 'clamp(1.3rem,2.5vw,2.2rem)', color: TEXT }}
                    >
                      {item.title}
                    </h2>

                    {/* Summary */}
                    <p
                      className="font-sans leading-7 font-light"
                      style={{ fontSize: 'clamp(0.82rem,1.4vw,0.95rem)', color: TEXT2, maxWidth: isWide ? '72ch' : '50ch' }}
                    >
                      {item.summary}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA strip ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ zIndex: 1, backgroundColor: SURF, padding: '5rem 0 6rem', borderTop: `1px solid ${BDR}` }}
      >
        <div aria-hidden className="pointer-events-none absolute -bottom-14 -right-14 rounded-full"
          style={{ width: 280, height: 280, background: 'radial-gradient(circle, rgba(129,140,248,0.10) 0%, transparent 65%)' }} />

        <div className="container relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-4" style={{ color: ACCENT }}>
              Start a project
            </p>
            <h2
              className="reveal font-display font-bold leading-[0.92] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(1.8rem,4vw,4rem)', color: TEXT }}
            >
              Have a project<br />in mind?
            </h2>
          </div>

          <a
            href="/contact"
            className="reveal flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all flex-shrink-0"
            style={{
              fontSize:   'clamp(0.68rem,1.5vw,0.75rem)',
              background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
              color:      '#fff',
              boxShadow:  '0 0 32px rgba(99,102,241,0.35)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(99,102,241,0.60)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.35)')}
          >
            Get in Touch <span className="text-base leading-none">↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}
