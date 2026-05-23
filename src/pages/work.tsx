import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { workItems } from '@/lib/content';
import AuroraBackground from '@/components/AuroraBackground';

const BG   = '#030308';
const SURF = '#07071a';
const T    = '#ffffff';
const T2   = 'rgba(255,255,255,0.62)';
const MUT  = 'rgba(255,255,255,0.32)';
const BDR  = 'rgba(255,255,255,0.07)';
const ACC  = '#818cf8';
const ACC2 = '#38bdf8';

const FS_HERO  = 'clamp(1.4rem, 7vw, 11rem)';
const FS_H2    = 'clamp(1.75rem,5vw,4.5rem)';
const FS_LABEL = '0.625rem';
const FS_BODY  = '0.875rem';

const BADGE = [ACC, ACC2, '#a78bfa', '#34d399', ACC];

export default function Work() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    /* Page-entrance: fade in from black (bridges the folder transition) */
    const curtain = document.createElement('div');
    curtain.style.cssText =
      'position:fixed;inset:0;background:#030308;z-index:9999;pointer-events:none;';
    document.body.appendChild(curtain);

    import('gsap').then(({ gsap }) => {
      /* Fade out the black curtain smoothly */
      gsap.to(curtain, {
        opacity:    0,
        duration:   0.80,
        ease:       'power2.out',
        delay:      0.08,
        onComplete: () => { if (document.body.contains(curtain)) document.body.removeChild(curtain); },
      });

      /* Then animate the hero words in */
      let ctx: any;
      ctx = gsap.context(() => {
        gsap.from('.hero-word', { y: '110%', duration: 1.1, stagger: 0.08, ease: 'power4.out', delay: 0.30 });
        gsap.from('.hero-meta', { opacity: 0, y: 14, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.70 });
      }, heroRef);

      return () => ctx?.revert?.();
    });
  }, []);

  return (
    <div style={{ backgroundColor: BG, overflowX: 'hidden', minHeight: '100svh', position: 'relative' }}>
      <AuroraBackground />

      {/* Hero */}
      <section ref={heroRef}
        className="relative flex flex-col justify-between px-5 sm:px-[5vw] pt-24 sm:pt-28 pb-10 sm:pb-14 overflow-hidden"
        style={{ zIndex: 1, minHeight: '42vh', color: T }}>
        <div aria-hidden className="pointer-events-none absolute top-0 right-0"
          style={{ width: 'min(40vw,380px)', height: 'min(40vw,380px)',
            background: 'radial-gradient(circle at 65% 25%, rgba(56,189,248,0.09), transparent 65%)' }} />

        <div className="hero-meta relative z-10 flex items-center gap-3 flex-wrap">
          <span className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing: '0.32em', color: ACC2 }}>Portfolio</span>
          <span className="block w-5 h-px" style={{ backgroundColor: 'rgba(56,189,248,0.38)' }} />
          <span className="font-mono" style={{ fontSize: FS_LABEL, letterSpacing: '0.32em', color: MUT }}>
            {workItems.length} Projects
          </span>
        </div>

        <div className="relative z-10 py-6 sm:py-8">
          <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: FS_HERO, color: T }}>
            {['Selected','Work'].map(w => (
              <div key={w} className="overflow-hidden">
                <span className="hero-word block">{w}</span>
              </div>
            ))}
          </h1>
        </div>

        <p className="hero-meta relative z-10 font-sans leading-7 font-light max-w-lg"
          style={{ fontSize: FS_BODY, color: T2 }}>
          A collection of real-world projects — designed and built from concept to launch.
        </p>
      </section>

      {/* Gallery */}
      <section className="relative" style={{ zIndex: 1,
        backgroundColor: 'rgba(7,7,26,0.72)',
        padding: 'clamp(3rem,5vw,6rem) 0', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
            {workItems.map((item, i) => {
              const isWide = i === workItems.length - 1;
              const imgSrc = (item as any).image as string | undefined;
              const col    = BADGE[i % BADGE.length];

              return (
                <motion.article key={item.slug}
                  className={isWide ? 'sm:col-span-2' : ''}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.10 }}
                  transition={{ duration: 0.70, ease: [0.16,1,0.3,1], delay: (i % 2) * 0.07 }}>

                  {/* Screenshot */}
                  <div className={`relative overflow-hidden rounded-xl mb-4 ${isWide ? 'aspect-[21/8]' : 'aspect-[16/10]'}`}
                    style={{ border: `1px solid ${BDR}`, width: '100%' }}>
                    {imgSrc ? (
                      <img src={imgSrc} alt={item.title} loading="lazy"
                        style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                          objectFit:'cover', objectPosition:'top', display:'block',
                          transition: 'transform 0.65s cubic-bezier(0.16,1,0.3,1)' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(3,3,8,0.40), transparent)' }} />
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-mono uppercase inline-block px-2.5 py-0.5 rounded-full"
                        style={{ fontSize: FS_LABEL, letterSpacing: '0.18em',
                          color: col, border: `1px solid ${col}40`, background: `${col}0f` }}>
                        {item.category}
                      </span>
                      <span className="font-mono" style={{ fontSize: FS_LABEL, letterSpacing: '0.16em', color: MUT }}>
                        {item.year}
                      </span>
                    </div>

                    <h2 className="font-display font-bold tracking-[-0.02em] leading-[1.05] mb-3"
                      style={{ fontSize: 'clamp(1.15rem,2.5vw,2.2rem)', color: T }}>
                      {item.title}
                    </h2>

                    <p className="font-sans leading-7 font-light"
                      style={{ fontSize: FS_BODY, color: T2, maxWidth: isWide ? '72ch' : '50ch' }}>
                      {item.summary}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ zIndex: 1, backgroundColor: SURF,
        padding: 'clamp(3rem,5vw,6rem) 0', borderTop: `1px solid ${BDR}` }}>
        <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-12 rounded-full glow-orb-rev"
          style={{ width: 'min(280px,60vw)', height: 'min(280px,60vw)',
            background: 'radial-gradient(circle, rgba(129,140,248,0.09), transparent 65%)' }} />
        <div className="container relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-7 sm:gap-8">
          <div>
            <p className="reveal font-mono uppercase mb-3" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: ACC }}>
              Start a project
            </p>
            <h2 className="reveal font-display font-bold leading-[0.92] tracking-[-0.02em] break-words"
              style={{ fontSize: FS_H2, color: T }}>
              Have a project<br />in mind?
            </h2>
          </div>
          <a href="/contact"
            className="reveal flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all flex-shrink-0"
            style={{ fontSize: '0.72rem', background:'linear-gradient(135deg,#6366f1,#38bdf8)',
              color:'#fff', boxShadow:'0 0 30px rgba(99,102,241,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 48px rgba(99,102,241,0.60)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.35)')}>
            Get in Touch <span className="text-base leading-none">↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}
