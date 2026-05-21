import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { featuredWork, services, whyItems, logoPartners, contactData } from '@/lib/content';
import HeroOrbs from '@/components/HeroOrbs';
import AuroraBackground from '@/components/AuroraBackground';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';

/* ── Design tokens ───────────────────────────────────────────────────── */
const BG      = '#030308';
const SURF    = '#07071a';
const TEXT    = '#ffffff';
const TEXT2   = 'rgba(255,255,255,0.62)';
const MUTED   = 'rgba(255,255,255,0.32)';
const BDR     = 'rgba(255,255,255,0.07)';
const BDRGLOW = 'rgba(129,140,248,0.38)';
const ACCENT  = '#818cf8';
const ACCENT2 = '#38bdf8';

const marqueeItems = [
  'Web Design','✦','Branding','✦','Product Design',
  '✦','Art Direction','✦','Full-Stack Dev','✦','Motion & UX','✦',
];

/* Stat pill used in mobile hero bottom row */
function StatPill({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex-1 text-center px-3 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BDR}` }}>
      <div className="font-display text-xl font-black leading-none text-gradient">{num}</div>
      <div className="font-mono text-[0.52rem] uppercase tracking-[0.08em] mt-1" style={{ color: MUTED }}>{label}</div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from('.hero-word', { y: '115%', duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: 0.2 });
        gsap.from('.hero-meta', { opacity: 0, y: 20, duration: 1.0, stagger: 0.1, ease: 'power3.out', delay: 0.7 });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: BG, position: 'relative' }}>

      {/* Fixed aurora shader — sits below everything */}
      <AuroraBackground />

      {/* ══════════════ SCENE (hero + marquee + services) ══════════════ */}
      <div data-scene className="relative" style={{ overflow: 'hidden', zIndex: 1 }}>
        <HeroOrbs />

        {/* ────────────────────────── HERO ─────────────────────────── */}
        <section
          ref={heroRef}
          className="relative min-h-[100dvh] flex flex-col px-5 sm:px-[5vw] pt-24 pb-8 sm:pb-12"
          style={{ zIndex: 1, color: TEXT }}
        >
          {/* ── Status bar ── */}
          <div className="hero-meta flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="status-dot block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.30em]" style={{ color: MUTED }}>
                Available
              </span>
            </div>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em]" style={{ color: MUTED }}>2026</span>
          </div>

          {/* ── Giant title ── */}
          <div className="flex-1 flex items-center py-4">
            <h1
              className="font-display font-black uppercase leading-[0.87] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(3.4rem,11.5vw,13.5rem)', color: TEXT }}
            >
              <div className="overflow-hidden"><span className="hero-word block">Brand &amp;</span></div>
              <div className="overflow-hidden">
                <span className="hero-word block">
                  Web{' '}
                  <span className="hero-pill text-gradient">Design</span>
                </span>
              </div>
              <div className="overflow-hidden"><span className="hero-word block">Specialist</span></div>
            </h1>
          </div>

          {/* ── MOBILE bottom area (hidden sm+) ── */}
          <div className="hero-meta sm:hidden flex flex-col gap-4 pt-2">
            {/* Description */}
            <p className="font-sans text-[0.82rem] leading-6" style={{ color: TEXT2 }}>
              Crafting digital experiences that define modern brands.
            </p>

            {/* Email — full-width pill, never squishes */}
            <a
              href={`mailto:${contactData.email}`}
              className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-all"
              style={{
                background: 'rgba(129,140,248,0.07)',
                border: `1px solid ${BDRGLOW}`,
                color: ACCENT,
              }}
            >
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] truncate">{contactData.email}</span>
              <span className="text-sm flex-shrink-0">↗</span>
            </a>

            {/* Stats row */}
            <div className="flex gap-2.5">
              <StatPill num="16+" label="Years" />
              <StatPill num="50+" label="Projects" />
              <StatPill num="30+" label="Clients" />
            </div>

            {/* Scroll hint */}
            <div className="flex items-center gap-3 pt-1">
              <div className="scroll-line-anim w-px h-8 flex-shrink-0"
                style={{ background: `linear-gradient(to bottom, ${ACCENT}, transparent)` }} />
              <span className="font-mono text-[0.52rem] uppercase tracking-[0.22em]" style={{ color: MUTED }}>Scroll</span>
            </div>
          </div>

          {/* ── DESKTOP bottom strip (hidden below sm) ── */}
          <div className="hero-meta hidden sm:grid grid-cols-3 items-end gap-8">
            <p className="font-sans text-sm leading-7 font-light" style={{ color: TEXT2 }}>
              Crafting digital experiences<br /> that define modern brands.
            </p>

            <div className="flex flex-col items-center gap-5">
              <a
                href={`mailto:${contactData.email}`}
                className="font-display font-semibold text-sm tracking-[0.04em] transition-all text-center"
                style={{ color: ACCENT, borderBottom: `1px solid ${BDRGLOW}`, paddingBottom: '2px' }}
                onMouseEnter={e => (e.currentTarget.style.color = ACCENT2)}
                onMouseLeave={e => (e.currentTarget.style.color = ACCENT)}
              >
                {contactData.email}
              </a>
              <div className="flex flex-col items-center gap-2">
                <div className="scroll-line-anim w-px h-12"
                  style={{ background: `linear-gradient(to bottom, ${ACCENT}, transparent)` }} />
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em]" style={{ color: MUTED }}>Scroll</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 items-end">
              {[['16+', 'Years experience'], ['50+', 'Projects delivered'], ['30+', 'Happy clients']].map(([num, label]) => (
                <div key={label} className="text-right">
                  <div className="font-display text-2xl font-black leading-none text-gradient">{num}</div>
                  <div className="font-mono text-[0.58rem] uppercase tracking-[0.1em] mt-0.5" style={{ color: MUTED }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────────── MARQUEE ───────────────────────── */}
        <div
          className="relative overflow-hidden py-[1rem]"
          style={{ zIndex: 1, background: 'rgba(3,3,8,0.60)', borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}`, backdropFilter: 'blur(8px)' }}
        >
          <div className="marquee-track flex gap-8 sm:gap-10 whitespace-nowrap w-max">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="font-display font-bold uppercase" style={{
                fontSize: item === '✦' ? '0.5rem' : '0.78rem',
                letterSpacing: item === '✦' ? 0 : '0.07em',
                color: item === '✦' ? ACCENT : MUTED,
              }}>{item}</span>
            ))}
          </div>
        </div>

        {/* ─────────────────────────── SERVICES ─────────────────────── */}
        <section
          className="relative"
          style={{ zIndex: 1, backgroundColor: 'rgba(7,7,26,0.75)', backdropFilter: 'blur(2px)', padding: '5rem 0 6rem', borderTop: `1px solid ${BDR}` }}
        >
          <div className="container">
            <div className="reveal flex flex-wrap items-baseline gap-3 sm:gap-8 mb-10 sm:mb-20">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] px-3 py-1 rounded-full"
                style={{ color: ACCENT, border: `1px solid ${BDRGLOW}`, background: 'rgba(129,140,248,0.06)' }}>
                Services
              </span>
              <h2 className="font-display font-bold leading-[0.95] tracking-[-0.02em] flex-1"
                style={{ fontSize: 'clamp(2rem,5vw,4.5rem)', color: TEXT }}>
                What I Do
              </h2>
            </div>

            {/* Mobile: vertical stack. Desktop: 2×2 grid */}
            <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ border: `1px solid ${BDR}` }}>
              {services.map((svc) => (
                <div key={svc.num} className="svc-card reveal-item group"
                  style={{ padding: 'clamp(1.5rem, 4vw, 2.8rem)' }}>
                  <div className="svc-fill" />
                  <div className="svc-content flex flex-col gap-5 min-h-[220px] sm:min-h-[280px]">
                    <span className="svc-text font-mono text-[0.60rem] tracking-[0.18em]" style={{ color: ACCENT }}>{svc.num}</span>
                    <h3 className="svc-text font-display font-bold leading-[1.05] tracking-[-0.01em]"
                      style={{ fontSize: 'clamp(1.25rem,2.5vw,2rem)', color: TEXT, whiteSpace: 'pre-line' }}>
                      {svc.title}
                    </h3>
                    <p className="svc-muted font-sans text-sm leading-7 flex-1" style={{ color: TEXT2 }}>{svc.detail}</p>
                    <span className="svc-arrow font-sans text-xl transition-transform duration-300 inline-block" style={{ color: ACCENT }}>↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* ══════════════════ END SCENE CONTAINER ════════════════════════ */}

      {/* ═══════════════════ SELECTED WORK ════════════════════════════ */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, padding: '5rem 0 6rem', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <div className="reveal flex flex-wrap items-baseline gap-3 sm:gap-8 mb-10 sm:mb-16">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] px-3 py-1 rounded-full"
              style={{ color: ACCENT2, border: '1px solid rgba(56,189,248,0.35)', background: 'rgba(56,189,248,0.06)' }}>
              Portfolio
            </span>
            <h2 className="font-display font-bold leading-[0.95] tracking-[-0.02em] flex-1"
              style={{ fontSize: 'clamp(2rem,5vw,4.5rem)', color: TEXT }}>
              Selected Work
            </h2>
            <Link href="/work"
              className="font-mono text-xs sm:text-sm transition-colors"
              style={{ color: MUTED, borderBottom: `1px solid ${BDR}`, paddingBottom: '2px' }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
              View All ↗
            </Link>
          </div>

          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {featuredWork.map((item, i) => (
              <Link key={item.slug} href={`/work/${item.slug}`}
                className={`work-card reveal-item group block ${i === 2 ? 'sm:col-span-2' : ''}`}>
                <div
                  className={`relative overflow-hidden rounded-xl mb-3 sm:mb-4 work-frame ${i === 2 ? 'aspect-[16/7] sm:aspect-[21/9]' : 'aspect-[4/3] sm:aspect-[4/3]'}`}
                  style={{ border: `1px solid ${BDR}` }}>
                  <div className={`work-thumb absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                  <div className="work-overlay">View Project ↗</div>
                </div>
                <div className="flex items-baseline justify-between gap-4 px-1">
                  <div>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.15em] block mb-1" style={{ color: MUTED }}>
                      {item.category} · {item.year}
                    </span>
                    <h3 className="font-display font-bold tracking-[-0.01em]"
                      style={{ fontSize: 'clamp(1rem,2vw,1.5rem)', color: TEXT }}>
                      {item.title}
                    </h3>
                  </div>
                  <span className="font-sans text-base flex-shrink-0" style={{ color: MUTED }}>↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY WORK WITH ME — STORY SCROLL ══════════════════
          Each FlowSection is full-screen and rotates into view as you scroll.
          The dark backgrounds + white text match the site theme.
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative" style={{ zIndex: 1 }}>
        <FlowArt aria-label="Why work with Abderrahmane">
          {whyItems.map((item, idx) => {
            /* Alternate between two dark tones for variety */
            const bgs = ['#030308', '#07071a', '#030308', '#0a0a1e'];
            const accents = [ACCENT, ACCENT2, '#a78bfa', ACCENT];
            return (
              <FlowSection
                key={item.num}
                aria-label={item.title}
                style={{ backgroundColor: bgs[idx], color: TEXT, borderTop: `1px solid ${BDR}` }}
              >
                {/* Top label */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.60rem] uppercase tracking-[0.28em]"
                    style={{ color: accents[idx] }}>
                    {item.num} — Why work with me
                  </span>
                  <span className="font-mono text-[0.60rem] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                    {idx + 1}/{whyItems.length}
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: `1px solid ${BDR}` }} />

                {/* Big headline */}
                <div className="flex-1 flex items-center">
                  <h2
                    className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
                    style={{ fontSize: 'clamp(3rem,10vw,11rem)', whiteSpace: 'pre-line', color: TEXT }}
                  >
                    {item.title}
                  </h2>
                </div>

                <hr style={{ border: 'none', borderTop: `1px solid ${BDR}` }} />

                {/* Detail text at bottom */}
                <p className="font-sans leading-7 max-w-[55ch]"
                  style={{ fontSize: 'clamp(0.95rem,2vw,1.25rem)', color: TEXT2 }}>
                  {item.detail}
                </p>
              </FlowSection>
            );
          })}
        </FlowArt>
      </div>

      {/* ═══════════════════════════ BRANDS ═══════════════════════════ */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, padding: '5rem 0', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.32em] text-center mb-10" style={{ color: MUTED }}>
            Trusted by studios &amp; companies
          </p>
          {/* Mobile: 2-column wrap. Desktop: row */}
          <div className="reveal-group flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-x-10 sm:gap-y-0">
            {logoPartners.map((name) => (
              <span key={name}
                className="reveal-item font-display font-bold uppercase cursor-default transition-all duration-300"
                style={{ fontSize: 'clamp(0.85rem,2.5vw,2rem)', letterSpacing: '-0.01em', color: MUTED }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = TEXT;
                  el.style.textShadow = `0 0 20px ${ACCENT}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = MUTED;
                  el.style.textShadow = 'none';
                }}
              >{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA ═══════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ zIndex: 1, backgroundColor: SURF, padding: '6rem 0 7rem', borderTop: `1px solid ${BDR}` }}
      >
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 rounded-full glow-orb"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(129,140,248,0.10) 0%, transparent 65%)' }} />
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 rounded-full glow-orb-rev"
          style={{ width: 320, height: 320, background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 65%)' }} />

        <div className="container relative z-10">
          {/* Mobile: single column stacked. Desktop: 2-col */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-end">
            <div>
              <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.32em] mb-6 sm:mb-8" style={{ color: ACCENT }}>
                Ready to start?
              </p>
              <h2
                className="reveal font-display font-black leading-[0.88] tracking-[-0.03em] uppercase mb-8 sm:mb-12"
                style={{ fontSize: 'clamp(2.6rem,7vw,8rem)', color: TEXT }}
              >
                Let&apos;s Create<br />
                <span className="text-gradient">Something</span><br />
                Remarkable.
              </h2>

              {/* CTA button — full width on mobile */}
              <Link
                href="/contact"
                className="reveal flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all"
                style={{
                  fontSize: 'clamp(0.68rem, 1.5vw, 0.75rem)',
                  background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                  color: '#fff',
                  boxShadow: '0 0 32px rgba(99,102,241,0.35)',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(99,102,241,0.60)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.35)')}
              >
                Start a Project <span className="text-base leading-none">↗</span>
              </Link>
            </div>

            {/* Contact details */}
            <div className="reveal flex flex-col gap-7 sm:gap-10">
              {[
                { label: 'Email',        val: contactData.email,        href: `mailto:${contactData.email}` },
                { label: 'Location',     val: contactData.location },
                { label: 'Availability', val: contactData.availability },
              ].map(({ label, val, href }) => (
                <div key={label}>
                  <p className="font-mono text-[0.56rem] uppercase tracking-[0.22em] mb-1.5" style={{ color: MUTED }}>{label}</p>
                  {href ? (
                    <a href={href}
                      className="font-display font-semibold tracking-[-0.01em] transition-colors break-all sm:break-normal"
                      style={{ fontSize: 'clamp(0.95rem,1.8vw,1.15rem)', color: TEXT }}
                      onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                      onMouseLeave={e => (e.currentTarget.style.color = TEXT)}
                    >{val}</a>
                  ) : (
                    <p className="font-display font-semibold tracking-[-0.01em]"
                      style={{ fontSize: 'clamp(0.95rem,1.8vw,1.15rem)', color: TEXT }}>{val}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
