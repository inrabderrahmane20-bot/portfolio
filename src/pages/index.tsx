import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { featuredWork, services, whyItems, logoPartners, contactData } from '@/lib/content';
import HeroOrbs from '@/components/HeroOrbs';

const marqueeItems = [
  'Web Design', '★', 'Branding', '★', 'Product Design',
  '★', 'Art Direction', '★', 'Full-Stack Dev', '★', 'Motion & UX', '★',
];

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from('.hero-word', {
          y: '115%', duration: 1.15, stagger: 0.1, ease: 'power4.out', delay: 0.2,
        });
        gsap.from('.hero-meta', {
          opacity: 0, y: 20, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.65,
        });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: '#F3EFE7' }}>

      {/* ═══════════════════════════════════ HERO ══════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-between px-[5vw] pt-28 pb-12 overflow-hidden"
        style={{ backgroundColor: '#F3EFE7', color: '#1E1E1E' }}
      >
        <HeroOrbs />

        {/* Top strip */}
        <div className="hero-meta relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="status-dot block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#CBB8A0' }} />
            <span className="font-sans text-[0.63rem] uppercase tracking-[0.4em]" style={{ color: '#8A8178' }}>
              Available for projects
            </span>
          </div>
          <span className="font-sans text-[0.63rem] uppercase tracking-[0.15em]" style={{ color: '#8A8178' }}>
            2026
          </span>
        </div>

        {/* Giant title */}
        <div className="relative z-10 flex-1 flex items-center py-8">
          <h1
            className="font-display font-black uppercase leading-[0.87] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3.8rem,11.5vw,13.5rem)', color: '#1E1E1E' }}
          >
            <div className="overflow-hidden"><span className="hero-word block">Brand &amp;</span></div>
            <div className="overflow-hidden">
              <span className="hero-word block">
                Web{' '}
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(30,30,30,0.08)',
                  border: '1px solid rgba(30,30,30,0.08)',
                  borderRadius: '999px',
                  padding: '0 0.22em 0.06em',
                  color: '#1E1E1E',
                  lineHeight: 'inherit',
                }}>Design</span>
              </span>
            </div>
            <div className="overflow-hidden"><span className="hero-word block">Specialist</span></div>
          </h1>
        </div>

        {/* Bottom strip */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 items-end gap-8 sm:gap-0">
          <p className="hero-meta font-sans text-sm leading-7 font-light" style={{ color: '#8A8178' }}>
            Crafting digital experiences<br className="hidden sm:block" /> that define modern brands.
          </p>

          <div className="hero-meta flex flex-col items-start sm:items-center gap-5">
            <a
              href={`mailto:${contactData.email}`}
              className="font-display font-semibold text-sm tracking-[0.04em] transition-colors"
              style={{ color: '#FFFFFF', borderBottom: '1px solid #CBB8A0', paddingBottom: '2px' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6E5846')}
              onMouseLeave={e => (e.currentTarget.style.color = '#FFFFFF')}
            >
              {contactData.email}
            </a>
            <div className="hidden sm:flex flex-col items-center gap-2">
              <div className="scroll-line-anim w-px h-12" style={{ backgroundColor: '#CBB8A0' }} />
              <span className="font-sans text-[0.58rem] uppercase tracking-[0.2em]" style={{ color: '#8A8178' }}>Scroll</span>
            </div>
          </div>

          <div className="hero-meta flex sm:flex-col gap-6 sm:gap-3 sm:items-end">
            {[['16+', 'Years experience'], ['50+', 'Projects delivered'], ['30+', 'Happy clients']].map(([num, label]) => (
              <div key={label} className="sm:text-right">
                <div className="font-display text-2xl font-black leading-none" style={{ color: '#1E1E1E' }}>{num}</div>
                <div className="font-sans text-[0.6rem] uppercase tracking-[0.1em] mt-0.5" style={{ color: '#8A8178' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ MARQUEE ═══════════════ */}
      <div className="overflow-hidden py-5" style={{ backgroundColor: '#DDD2C3', borderTop: '1px solid #CBB8A0', borderBottom: '1px solid #CBB8A0' }}>
        <div className="marquee-track flex gap-10 whitespace-nowrap w-max">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="font-display font-bold uppercase"
              style={{
                fontSize: item === '★' ? '0.5rem' : '0.82rem',
                letterSpacing: item === '★' ? 0 : '0.07em',
                color: '#8A8178',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════ SERVICES ═══════════════ */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '7rem 0' }}>
        <div className="container">
          <div className="reveal flex flex-wrap items-baseline gap-4 sm:gap-8 mb-16 sm:mb-24">
            <span
              className="font-sans text-[0.62rem] uppercase tracking-[0.22em] px-3 py-1 rounded-full"
              style={{ color: '#8A8178', border: '1px solid #CBB8A0' }}
            >
              Services
            </span>
            <h2
              className="font-display font-bold leading-[0.95] tracking-[-0.02em] flex-1"
              style={{ fontSize: 'clamp(2.2rem,5vw,4.5rem)', color: '#1E1E1E' }}
            >
              What I Do
            </h2>
          </div>

          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ border: '1px solid #CBB8A0' }}>
            {services.map((svc) => (
              <div
                key={svc.num}
                className="svc-card reveal-item group"
                style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid #CBB8A0', borderBottom: '1px solid #CBB8A0', padding: '2.5rem' }}
              >
                <div className="svc-fill" />
                <div className="svc-content flex flex-col gap-6 min-h-[260px]">
                  <span className="svc-text font-sans text-[0.65rem] tracking-[0.15em]" style={{ color: '#8A8178' }}>
                    {svc.num}
                  </span>
                  <h3
                    className="svc-text font-display font-bold leading-[1.05] tracking-[-0.01em]"
                    style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#1E1E1E', whiteSpace: 'pre-line' }}
                  >
                    {svc.title}
                  </h3>
                  <p className="svc-muted font-sans text-sm leading-7 flex-1" style={{ color: '#8A8178' }}>
                    {svc.detail}
                  </p>
                  <span className="svc-text font-sans text-xl transition-all duration-300 group-hover:rotate-45 inline-block" style={{ color: '#6E5846' }}>
                    ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ SELECTED WORK ════════════ */}
      <section style={{ backgroundColor: '#F3EFE7', padding: '7rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <div className="reveal flex flex-wrap items-baseline gap-4 sm:gap-8 mb-14 sm:mb-20">
            <span
              className="font-sans text-[0.62rem] uppercase tracking-[0.22em] px-3 py-1 rounded-full"
              style={{ color: '#8A8178', border: '1px solid #CBB8A0' }}
            >
              Portfolio
            </span>
            <h2
              className="font-display font-bold leading-[0.95] tracking-[-0.02em] flex-1"
              style={{ fontSize: 'clamp(2.2rem,5vw,4.5rem)', color: '#1E1E1E' }}
            >
              Selected Work
            </h2>
            <Link
              href="/work"
              className="font-sans text-sm transition-colors ml-auto"
              style={{ color: '#8A8178', borderBottom: '1px solid #CBB8A0', paddingBottom: '2px' }}
            >
              View All ↗
            </Link>
          </div>

          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {featuredWork.map((item, i) => (
              <Link
                key={item.slug}
                href={`/work/${item.slug}`}
                className={`work-card reveal-item group block ${i === 2 ? 'sm:col-span-2' : ''}`}
              >
                <div
                  className={`relative overflow-hidden rounded-sm mb-4 work-frame ${i === 2 ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}
                  style={{ border: '1px solid #CBB8A0' }}
                >
                  <div className={`work-thumb absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                  <div className="work-overlay">View Project ↗</div>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="font-sans text-[0.62rem] uppercase tracking-[0.15em] block mb-1" style={{ color: '#8A8178' }}>
                      {item.category} · {item.year}
                    </span>
                    <h3
                      className="font-display font-bold tracking-[-0.01em] transition-colors"
                      style={{ fontSize: 'clamp(1.1rem,2vw,1.5rem)', color: '#1E1E1E' }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <span className="font-sans text-base flex-shrink-0 transition-colors" style={{ color: '#8A8178' }}>↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ WHY WORK WITH ME ════════════ */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '7rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <div className="reveal flex flex-wrap items-baseline gap-4 sm:gap-8 mb-16 sm:mb-24">
            <span
              className="font-sans text-[0.62rem] uppercase tracking-[0.22em] px-3 py-1 rounded-full"
              style={{ color: '#8A8178', border: '1px solid #CBB8A0' }}
            >
              Value
            </span>
            <h2
              className="font-display font-bold leading-[0.92] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2.2rem,5vw,4.5rem)', color: '#1E1E1E' }}
            >
              Why Work<br />With Me
            </h2>
          </div>

          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 gap-x-12">
            {whyItems.map((item) => (
              <div
                key={item.num}
                className="reveal-item pb-10 mb-10"
                style={{ borderTop: '1px solid #CBB8A0', paddingTop: '2rem' }}
              >
                <span
                  className="font-sans text-[0.62rem] block mb-5 tracking-[0.1em] uppercase"
                  style={{ color: '#8A8178' }}
                >
                  {item.num}
                </span>
                <h3
                  className="font-display font-bold leading-[1.08] tracking-[-0.01em] mb-4"
                  style={{ fontSize: 'clamp(1.3rem,2.2vw,1.9rem)', color: '#1E1E1E', whiteSpace: 'pre-line' }}
                >
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-7 font-light" style={{ color: '#8A8178' }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════ BRANDS ═════════════════ */}
      <section style={{ backgroundColor: '#F3EFE7', padding: '5rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <p
            className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] text-center mb-12"
            style={{ color: '#8A8178' }}
          >
            Trusted by studios &amp; companies
          </p>
          <div className="reveal-group flex flex-wrap justify-center gap-6 sm:gap-10">
            {logoPartners.map((name) => (
              <span
                key={name}
                className="reveal-item font-display font-bold uppercase cursor-default transition-colors"
                style={{ fontSize: 'clamp(1.1rem,2.5vw,2rem)', letterSpacing: '-0.01em', color: '#8A8178' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#6E5846')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8178')}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA ════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#DDD2C3', padding: '7rem 0', borderTop: '1px solid #CBB8A0' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 rounded-full opacity-10"
          style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(30,30,30,0.08), transparent 65%)',
          }}
        />
        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-end">
          <div>
            <p
              className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-8"
              style={{ color: '#8A8178' }}
            >
              Ready to start?
            </p>
            <h2
              className="reveal font-display font-black leading-[0.88] tracking-[-0.03em] uppercase mb-12"
              style={{ fontSize: 'clamp(3rem,7vw,8rem)', color: '#1E1E1E' }}
            >
              Let&apos;s Create<br />Something<br />Remarkable.
            </h2>
            <Link
              href="/contact"
              className="reveal inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-[0.75rem] uppercase tracking-[0.1em] transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#121212', color: '#F3EFE7' }}
            >
              Start a Project <span className="text-base leading-none">↗</span>
            </Link>
          </div>

          <div className="reveal flex flex-col gap-10">
            {[
              { label: 'Email',        val: contactData.email,        href: `mailto:${contactData.email}` },
              { label: 'Location',     val: contactData.location },
              { label: 'Availability', val: contactData.availability },
            ].map(({ label, val, href }) => (
              <div key={label}>
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.22em] mb-2" style={{ color: '#8A8178' }}>{label}</p>
                {href ? (
                  <a href={href} className="font-display font-semibold text-lg tracking-[-0.01em] transition-colors hover:opacity-70" style={{ color: '#1E1E1E' }}>{val}</a>
                ) : (
                  <p className="font-display font-semibold text-lg tracking-[-0.01em]" style={{ color: '#1E1E1E' }}>{val}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
