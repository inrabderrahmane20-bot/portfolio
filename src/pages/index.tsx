import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { services, whyItems, logoPartners, contactData } from '@/lib/content';
import HeroOrbs from '@/components/HeroOrbs';
import AuroraBackground from '@/components/AuroraBackground';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import ProjectFolder from '@/components/ProjectFolder';

/* ── Tokens ─────────────────────────────────────────────────────────── */
const BG   = '#030308';
const SURF = '#07071a';
const T    = '#ffffff';
const T2   = 'rgba(255,255,255,0.62)';
const MUT  = 'rgba(255,255,255,0.32)';
const BDR  = 'rgba(255,255,255,0.07)';
const BDG  = 'rgba(129,140,248,0.38)';
const ACC  = '#818cf8';
const ACC2 = '#38bdf8';

/* ── Type scales (safe at 320 px) ─────────────────────────────────── */
const FS_HERO  = 'clamp(2.5rem, 11vw, 11rem)';  /* min 38.4 px */
const FS_H2    = 'clamp(1.75rem, 5vw, 4.5rem)';      /* min 28 px   */
const FS_LABEL = '0.625rem';
const FS_BODY  = '0.875rem';

const marqueeItems = [
  'Web Design','✦','Branding','✦','Product Design',
  '✦','Art Direction','✦','Full-Stack Dev','✦','Motion & UX','✦',
];

/* ── Stat pill (mobile hero) ─────────────────────────────────────── */
function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center py-3 px-2 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BDR}`, minWidth: 0 }}>
      <span className="font-display font-black leading-none text-gradient"
        style={{ fontSize: 'clamp(1.1rem, 5vw, 1.5rem)' }}>{n}</span>
      <span className="font-mono uppercase tracking-wider mt-1"
        style={{ fontSize: '0.52rem', color: MUT }}>{label}</span>
    </div>
  );
}

/* ── Tag pill ────────────────────────────────────────────────────── */
function Tag({ children, color = ACC, bg = 'rgba(129,140,248,0.06)', bdr = BDG }:
  { children: React.ReactNode; color?: string; bg?: string; bdr?: string }) {
  return (
    <span className="font-mono uppercase inline-flex items-center px-3 py-1 rounded-full"
      style={{ fontSize: FS_LABEL, letterSpacing: '0.22em', color, border: `1px solid ${bdr}`, background: bg }}>
      {children}
    </span>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from('.hero-word', { y: '110%', duration: 1.15, stagger: 0.09, ease: 'power4.out', delay: 0.2 });
        gsap.from('.hero-meta', { opacity: 0, y: 18, duration: 0.95, stagger: 0.08, ease: 'power3.out', delay: 0.7 });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  return (
    <div style={{ backgroundColor: BG, overflowX: 'hidden' }}>
      <AuroraBackground />

      {/* ══════════ SCENE CONTAINER (hero + marquee + services share canvas) ═══ */}
      <div data-scene className="relative" style={{ overflowX: 'hidden' }}>
        <HeroOrbs />

        {/* ─── HERO ──────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative flex flex-col px-5 sm:px-[5vw] pt-24 sm:pt-28 pb-8 sm:pb-12"
          style={{ zIndex: 1, color: T, minHeight: '100svh' }}
        >
          {/* Ambient glow */}
          <div aria-hidden className="pointer-events-none absolute top-0 right-0 opacity-40"
            style={{ width: 'min(50vw,320px)', height: 'min(50vw,320px)',
              background: 'radial-gradient(circle at 65% 25%, rgba(129,140,248,0.12), transparent 65%)' }} />

          {/* Status row */}
          <div className="hero-meta flex items-center justify-between mb-6 sm:mb-0">
            <div className="flex items-center gap-2">
              <span className="status-dot block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ACC }} />
              <span className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing: '0.32em', color: MUT }}>
                Available
              </span>
            </div>
            <span className="font-mono" style={{ fontSize: FS_LABEL, letterSpacing: '0.18em', color: MUT }}>2026</span>
          </div>

          {/* Giant title */}
          <div className="flex-1 flex items-center py-4 sm:py-8">
            <h1 className="font-display font-black uppercase leading-[0.87] tracking-[-0.03em]"
              style={{ fontSize: FS_HERO, color: T}}>
              <div className="overflow-hidden"><span className="hero-word block">Brand &amp;</span></div>
              <div className="overflow-hidden">
                <span className="hero-word block">
                  Web <span className="hero-pill"><span className="text-gradient">Design</span></span>
                </span>
              </div>
              <div className="overflow-hidden"><span className="hero-word block">Specialist</span></div>
            </h1>
          </div>

          {/* ── Mobile bottom (< sm) ────── */}
          <div className="hero-meta sm:hidden flex flex-col gap-3">
            <p className="font-sans leading-6" style={{ fontSize: FS_BODY, color: T2 }}>
              Crafting digital experiences that define modern brands.
            </p>
            {/* Email pill — never clips */}
            <a href={`mailto:${contactData.email}`}
              className="flex items-center justify-between gap-2 px-4 rounded-2xl"
              style={{ background: 'rgba(129,140,248,0.07)', border: `1px solid ${BDG}`, color: ACC,
                fontSize: '0.75rem', fontFamily: "'JetBrains Mono',monospace",
                minHeight: 48, overflow: 'hidden' }}>
              <span className="truncate">{contactData.email}</span>
              <span className="flex-shrink-0">↗</span>
            </a>
            {/* Stats */}
            <div className="flex gap-2">
              <Stat n="16+" label="Yrs" />
              <Stat n="50+" label="Projects" />
              <Stat n="30+" label="Clients" />
            </div>
            {/* Scroll hint */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="scroll-line-anim w-px h-7 flex-shrink-0"
                style={{ background: `linear-gradient(to bottom, ${ACC}, transparent)` }} />
              <span className="font-mono uppercase" style={{ fontSize: '0.52rem', letterSpacing: '0.22em', color: MUT }}>Scroll</span>
            </div>
          </div>

          {/* ── Desktop bottom (≥ sm) ────── */}
          <div className="hero-meta hidden sm:grid grid-cols-3 items-end gap-8">
            <p className="font-sans text-sm leading-7 font-light" style={{ color: T2 }}>
              Crafting digital experiences<br />that define modern brands.
            </p>
            <div className="flex flex-col items-center gap-5">
              <a href={`mailto:${contactData.email}`}
                className="font-display font-semibold text-sm tracking-[0.04em] transition-all text-center"
                style={{ color: ACC, borderBottom: `1px solid ${BDG}`, paddingBottom: 2 }}
                onMouseEnter={e => (e.currentTarget.style.color = ACC2)}
                onMouseLeave={e => (e.currentTarget.style.color = ACC)}>
                {contactData.email}
              </a>
              <div className="flex flex-col items-center gap-2">
                <div className="scroll-line-anim w-px h-12"
                  style={{ background: `linear-gradient(to bottom, ${ACC}, transparent)` }} />
                <span className="font-mono uppercase" style={{ fontSize: '0.55rem', letterSpacing: '0.22em', color: MUT }}>Scroll</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-end">
              {[['16+','Years experience'],['50+','Projects delivered'],['30+','Happy clients']].map(([n,l]) => (
                <div key={l} className="text-right">
                  <div className="font-display text-2xl font-black leading-none text-gradient">{n}</div>
                  <div className="font-mono uppercase mt-0.5" style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: MUT }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MARQUEE ──────────────────────────────────────────────── */}
        <div className="relative overflow-hidden py-3 sm:py-4"
          style={{ zIndex: 1, background: 'rgba(3,3,8,0.60)',
            borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}` }}>
          <div className="marquee-track flex gap-6 sm:gap-10 whitespace-nowrap w-max">
            {[...marqueeItems,...marqueeItems,...marqueeItems].map((item, i) => (
              <span key={i} className="font-display font-bold uppercase"
                style={{ fontSize: item === '✦' ? '0.45rem' : '0.72rem',
                  letterSpacing: item === '✦' ? 0 : '0.07em',
                  color: item === '✦' ? ACC : MUT }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─── SERVICES ─────────────────────────────────────────────── */}
        <section className="relative" style={{ zIndex: 1,
          backgroundColor: 'rgba(7,7,26,0.75)',
          padding: 'clamp(3rem,6vw,8rem) 0', borderTop: `1px solid ${BDR}` }}>
          <div className="container">
            <div className="reveal flex flex-wrap items-baseline gap-3 sm:gap-8 mb-8 sm:mb-16">
              <Tag>Services</Tag>
              <h2 className="font-display font-bold leading-[0.95] tracking-[-0.02em] flex-1"
                style={{ fontSize: FS_H2, color: T }}>
                What I Do
              </h2>
            </div>

            <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ border: `1px solid ${BDR}` }}>
              {services.map(svc => (
                <div key={svc.num} className="svc-card reveal-item group"
                  style={{ padding: 'clamp(1.25rem,3.5vw,2.8rem)' }}>
                  <div className="svc-fill" />
                  <div className="svc-content flex flex-col gap-4 sm:gap-5"
                    style={{ minHeight: 'clamp(180px,24vw,280px)' }}>
                    <span className="svc-text font-mono uppercase tracking-[0.18em]"
                      style={{ fontSize: FS_LABEL, color: ACC }}>{svc.num}</span>
                    <h3 className="svc-text font-display font-bold leading-[1.05] tracking-[-0.01em]"
                      style={{ fontSize: 'clamp(1.2rem,2.5vw,2rem)', color: T, whiteSpace: 'pre-line' }}>
                      {svc.title}
                    </h3>
                    <p className="svc-muted font-sans leading-7 flex-1"
                      style={{ fontSize: FS_BODY, color: T2 }}>{svc.detail}</p>
                    <span className="svc-arrow font-sans text-xl transition-transform duration-300 inline-block"
                      style={{ color: ACC }}>↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* ══════════ END SCENE CONTAINER ═══════════════════════════════ */}

      {/* ─── SELECTED WORK — FOLDER ────────────────────────────────── */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG,
        padding: 'clamp(3rem,6vw,8rem) 0', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <div className="reveal flex flex-wrap items-baseline gap-3 sm:gap-8 mb-10 sm:mb-16">
            <Tag color={ACC2} bg="rgba(56,189,248,0.06)" bdr="rgba(56,189,248,0.35)">Portfolio</Tag>
            <h2 className="font-display font-bold leading-[0.95] tracking-[-0.02em] flex-1"
              style={{ fontSize: FS_H2, color: T }}>
              Selected Work
            </h2>
          </div>
          <div className="reveal">
            <ProjectFolder />
          </div>
          <p className="text-center mt-6 sm:mt-8 font-mono uppercase tracking-[0.22em]"
            style={{ fontSize: FS_LABEL, color: MUT }}>
            Open the folder to explore all projects
          </p>
        </div>
      </section>

      {/* ─── WHY — STORY SCROLL ────────────────────────────────────── */}
      <div className="relative" style={{ zIndex: 1 }}>
        <FlowArt aria-label="Why work with Abderrahmane">
          {whyItems.map((item, idx) => {
            const bgs  = [BG, SURF, BG, '#0a0a1e'] as const;
            const accs = [ACC, ACC2, '#a78bfa', ACC] as const;
            return (
              <FlowSection key={item.num} aria-label={item.title}
                style={{ backgroundColor: bgs[idx], color: T, borderTop: `1px solid ${BDR}` }}>
                {/* Top label */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing: '0.28em', color: accs[idx] }}>
                    {item.num} — Why work with me
                  </span>
                  <span className="font-mono" style={{ fontSize: FS_LABEL, letterSpacing: '0.18em', color: MUT }}>
                    {idx + 1}/{whyItems.length}
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: `1px solid ${BDR}` }} />

                {/* Big heading */}
                <div className="flex-1 flex items-center overflow-hidden">
                  <h2 className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em] break-words"
                    style={{ fontSize: 'clamp(2.2rem,8vw,10rem)', whiteSpace: 'pre-line', color: T}}>
                    {item.title}
                  </h2>
                </div>

                <hr style={{ border: 'none', borderTop: `1px solid ${BDR}` }} />

                {/* Detail */}
                <p className="font-sans leading-7"
                  style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1.15rem)', color: T2, maxWidth: '55ch' }}>
                  {item.detail}
                </p>
              </FlowSection>
            );
          })}
        </FlowArt>
      </div>

      {/* ─── BRANDS ────────────────────────────────────────────────── */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG,
        padding: 'clamp(3rem,5vw,6rem) 0', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono uppercase text-center mb-8 sm:mb-10 tracking-[0.32em]"
            style={{ fontSize: FS_LABEL, color: MUT }}>
            Trusted by studios &amp; companies
          </p>
          <div className="reveal-group flex flex-wrap justify-center gap-x-5 gap-y-3 sm:gap-x-10">
            {logoPartners.map(name => (
              <span key={name}
                className="reveal-item font-display font-bold uppercase cursor-default transition-all duration-300"
                style={{ fontSize: 'clamp(0.9rem,2.5vw,2rem)', letterSpacing: '-0.01em', color: MUT }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.color=T; el.style.textShadow=`0 0 20px ${ACC}`; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.color=MUT; el.style.textShadow='none'; }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ zIndex: 1, backgroundColor: SURF,
        padding: 'clamp(3.5rem,6vw,9rem) 0', borderTop: `1px solid ${BDR}` }}>
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 rounded-full glow-orb"
          style={{ width: 'min(400px,80vw)', height: 'min(400px,80vw)',
            background: 'radial-gradient(circle, rgba(129,140,248,0.10) 0%, transparent 65%)' }} />
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 rounded-full glow-orb-rev"
          style={{ width: 'min(320px,60vw)', height: 'min(320px,60vw)',
            background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 65%)' }} />

        <div className="container relative z-10">
          {/* Heading — full width, never bleeds */}
          <p className="reveal font-mono uppercase mb-4 sm:mb-6"
            style={{ fontSize: FS_LABEL, letterSpacing: '0.32em', color: ACC }}>
            Ready to start?
          </p>
          <h2 className="reveal font-display font-black leading-[0.88] tracking-[-0.03em] uppercase break-words"
            style={{ fontSize: 'clamp(2.2rem,5.5vw,7rem)', color: T }}>
            Let&apos;s Create<br />
            <span className="text-gradient">Something</span><br />
            Remarkable.
          </h2>

          {/* Divider + button + contacts */}
          <div className="reveal mt-8 sm:mt-10 pt-7 sm:pt-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-14"
            style={{ borderTop: `1px solid ${BDR}` }}>
            {/* CTA button — full-width on mobile */}
            <Link href="/contact"
              className="flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all flex-shrink-0"
              style={{ fontSize: 'clamp(0.7rem,1.5vw,0.8rem)',
                background: 'linear-gradient(135deg,#6366f1,#38bdf8)', color: '#fff',
                boxShadow: '0 0 32px rgba(99,102,241,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(99,102,241,0.60)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.35)')}>
              Start a Project <span className="text-base leading-none">↗</span>
            </Link>

            {/* Contact info — grid, truncates email safely */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 flex-1 min-w-0">
              {[
                { label: 'Email',        val: contactData.email,        href: `mailto:${contactData.email}` },
                { label: 'Location',     val: contactData.location,     href: null as string | null },
                { label: 'Availability', val: contactData.availability, href: null as string | null },
              ].map(({ label, val, href }) => (
                <div key={label} className="min-w-0">
                  <p className="font-mono uppercase mb-1.5" style={{ fontSize: '0.55rem', letterSpacing: '0.20em', color: MUT }}>{label}</p>
                  {href ? (
                    <a href={href} className="font-sans text-sm font-medium block truncate transition-colors"
                      style={{ color: T2 }} title={val}
                      onMouseEnter={e => (e.currentTarget.style.color = ACC)}
                      onMouseLeave={e => (e.currentTarget.style.color = T2)}>{val}</a>
                  ) : (
                    <p className="font-sans text-sm font-medium" style={{ color: T2 }}>{val}</p>
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
