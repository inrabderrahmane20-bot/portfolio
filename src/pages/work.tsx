import Link from 'next/link';
import { useEffect, useRef } from 'react';
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
    <div className="overflow-x-hidden relative" style={{ backgroundColor: BG }}>
      <AuroraBackground />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex flex-col justify-between px-5 sm:px-[5vw] pt-28 pb-12 overflow-hidden"
        style={{ zIndex: 1, color: TEXT }}
      >
        <div aria-hidden className="pointer-events-none absolute top-0 right-0 rounded-full"
          style={{ width: 'clamp(200px,40vw,500px)', height: 'clamp(200px,40vw,500px)',
            background: 'radial-gradient(circle at 60% 30%, rgba(56,189,248,0.10), transparent 65%)' }} />

        <div className="hero-meta relative z-10 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em]" style={{ color: ACCENT2 }}>Portfolio</span>
          <span className="block w-6 h-px" style={{ backgroundColor: 'rgba(56,189,248,0.38)' }} />
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em]" style={{ color: MUTED }}>{workItems.length} Projects</span>
        </div>

        <div className="relative z-10 py-8 sm:py-10">
          <h1
            className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3.2rem,10vw,12rem)', color: TEXT }}
          >
            {['Selected', 'Work'].map((line) => (
              <div key={line} className="overflow-hidden">
                <span className="hero-word block">{line}</span>
              </div>
            ))}
          </h1>
        </div>

        <p className="hero-meta relative z-10 font-sans text-sm leading-7 font-light max-w-lg" style={{ color: TEXT2 }}>
          Each project blends premium motion, editorial pacing, and modern compositional clarity.
        </p>
      </section>

      {/* WORK GRID */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: 'rgba(7,7,26,0.75)', backdropFilter: 'blur(2px)', padding: '5rem 0', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-12 sm:gap-y-16">
            {workItems.map((item, i) => (
              <Link
                key={item.slug}
                href={`/work/${item.slug}`}
                className={`work-card reveal-item group block ${i === 2 ? 'sm:col-span-2' : ''}`}
              >
                {/* Screenshot or gradient thumbnail */}
                <div
                  className={`relative overflow-hidden rounded-xl mb-4 sm:mb-5 work-frame ${i === 2 ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}
                  style={{ border: `1px solid ${BDR}` }}
                >
                  {(item as any).image ? (
                    <img
                      src={(item as any).image}
                      alt={item.title}
                      className="work-thumb absolute inset-0 w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className={`work-thumb absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                  )}
                  <div className="work-overlay">View Project ↗</div>
                </div>

                <div className="flex items-start justify-between gap-4 px-1">
                  <div className="min-w-0">
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.20em] block mb-2" style={{ color: MUTED }}>
                      {item.category} · {item.year}
                    </span>
                    <h2
                      className="font-display font-bold tracking-[-0.01em] leading-[1.05] mb-2 sm:mb-3"
                      style={{ fontSize: 'clamp(1.1rem,2.2vw,1.75rem)', color: TEXT }}
                    >
                      {item.title}
                    </h2>
                    <p className="font-sans text-sm leading-7 max-w-md" style={{ color: TEXT2 }}>{item.summary}</p>
                  </div>
                  <span className="font-sans text-xl flex-shrink-0 mt-1 transition-colors" style={{ color: MUTED }}>↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="relative overflow-hidden" style={{ zIndex: 1, backgroundColor: SURF, padding: '5rem 0 6rem', borderTop: `1px solid ${BDR}` }}>
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 rounded-full glow-orb-rev"
          style={{ width: 320, height: 320, background: 'radial-gradient(circle, rgba(129,140,248,0.10) 0%, transparent 65%)' }} />
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
          <Link
            href="/contact"
            className="reveal flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all flex-shrink-0"
            style={{
              fontSize: 'clamp(0.68rem,1.5vw,0.75rem)',
              background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
              color: '#fff',
              boxShadow: '0 0 32px rgba(99,102,241,0.35)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(99,102,241,0.60)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.35)')}
          >
            Get in Touch <span className="text-base leading-none">↗</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
