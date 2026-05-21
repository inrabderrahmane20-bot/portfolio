import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { workItems } from '@/lib/content';

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
    <div className="overflow-x-hidden" style={{ backgroundColor: '#F3EFE7' }}>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[62vh] flex flex-col justify-between px-[5vw] pt-28 pb-16 overflow-hidden"
        style={{ backgroundColor: '#F3EFE7', color: '#1E1E1E' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 rounded-full opacity-20"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle at 40% 40%, rgba(18,18,18,0.4), transparent 65%)' }}
        />

        <div className="hero-meta relative z-10 flex items-center gap-2.5">
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.32em]" style={{ color: '#8A8178' }}>Portfolio</span>
          <span className="block w-8 h-px" style={{ backgroundColor: '#CBB8A0' }} />
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.32em]" style={{ color: '#8A8178' }}>{workItems.length} Projects</span>
        </div>

        <div className="relative z-10 py-10">
          <h1
            className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3.5rem,10vw,12rem)', color: '#1E1E1E' }}
          >
            {['Selected', 'Work'].map((line) => (
              <div key={line} className="overflow-hidden">
                <span className="hero-word block">{line}</span>
              </div>
            ))}
          </h1>
        </div>

        <p className="hero-meta relative z-10 font-sans text-sm leading-7 font-light max-w-lg" style={{ color: '#8A8178' }}>
          Each project blends premium motion, editorial pacing, and modern compositional clarity.
        </p>
      </section>

      {/* WORK GRID */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '5rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
            {workItems.map((item, i) => (
              <Link
                key={item.slug}
                href={`/work/${item.slug}`}
                className={`work-card reveal-item group block ${i === 2 ? 'sm:col-span-2' : ''}`}
              >
                <div
                  className={`relative overflow-hidden rounded-sm mb-5 work-frame ${i === 2 ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}
                  style={{ border: '1px solid #CBB8A0' }}
                >
                  <div className={`work-thumb absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                  <div className="work-overlay">View Project ↗</div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-sans text-[0.62rem] uppercase tracking-[0.2em] block mb-2" style={{ color: '#8A8178' }}>
                      {item.category} · {item.year}
                    </span>
                    <h2
                      className="font-display font-bold tracking-[-0.01em] leading-[1.05]"
                      style={{ fontSize: 'clamp(1.2rem,2.2vw,1.75rem)', color: '#1E1E1E' }}
                    >
                      {item.title}
                    </h2>
                    <p className="mt-3 font-sans text-sm leading-7 max-w-md" style={{ color: '#8A8178' }}>{item.summary}</p>
                  </div>
                  <span className="font-sans text-xl flex-shrink-0 mt-1 transition-colors" style={{ color: '#8A8178' }}>↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{ backgroundColor: '#F3EFE7', padding: '6rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-4" style={{ color: '#8A8178' }}>
              Start a project
            </p>
            <h2
              className="reveal font-display font-bold leading-[0.92] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2rem,4vw,4rem)', color: '#1E1E1E' }}
            >
              Have a project<br />in mind?
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-[0.75rem] uppercase tracking-[0.1em] transition-opacity hover:opacity-80 flex-shrink-0"
            style={{ backgroundColor: '#121212', color: '#F3EFE7' }}
          >
            Get in Touch <span className="text-base leading-none">↗</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
