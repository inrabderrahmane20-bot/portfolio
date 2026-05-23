import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { services, contactData } from '@/lib/content';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroOrbs from '@/components/HeroOrbs';
import AuroraBackground from '@/components/AuroraBackground';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import ProjectFolder from '@/components/ProjectFolder';

const BG   = '#030308';
const SURF = '#07071a';
const T    = '#ffffff';
const T2   = 'rgba(255,255,255,0.62)';
const MUT  = 'rgba(255,255,255,0.32)';
const BDR  = 'rgba(255,255,255,0.07)';
const BDG  = 'rgba(129,140,248,0.38)';
const ACC  = '#818cf8';
const ACC2 = '#38bdf8';
const FS_HERO  = 'clamp(1.4rem, 7vw, 11rem)';
const FS_H2    = 'clamp(1.75rem, 5vw, 4.5rem)';
const FS_LABEL = '0.625rem';
const FS_BODY  = '0.875rem';

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center py-3 px-2 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BDR}`, minWidth: 0 }}>
      <span className="font-display font-black leading-none text-gradient"
        style={{ fontSize: 'clamp(1.1rem,5vw,1.5rem)' }}>{n}</span>
      <span className="font-mono uppercase tracking-wider mt-1"
        style={{ fontSize: '0.52rem', color: MUT }}>{label}</span>
    </div>
  );
}

function Tag({ children, color=ACC, bg='rgba(129,140,248,0.06)', bdr=BDG }:
  { children: React.ReactNode; color?: string; bg?: string; bdr?: string }) {
  return (
    <span className="font-mono uppercase inline-flex items-center px-3 py-1 rounded-full"
      style={{ fontSize: FS_LABEL, letterSpacing:'0.22em', color, border:`1px solid ${bdr}`, background:bg }}>
      {children}
    </span>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { t } = useLanguage();

  const marqueeItems = t('marquee').split('|')
    .flatMap(item => [item, '✦']).slice(0, -1);

  const WHY_NUMS = ['01','02','03','04'] as const;
  const WHY_BG   = [BG, SURF, BG, '#0a0a1e'] as const;
  const WHY_ACC  = [ACC, ACC2, '#a78bfa', ACC] as const;

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

      {/* ══ SCENE CONTAINER ══════════════════════════════════════════ */}
      <div data-scene className="relative" style={{ overflowX: 'hidden' }}>
        <HeroOrbs />

        {/* ─── HERO ────────────────────────────────────────────────── */}
        <section ref={heroRef}
          className="relative flex flex-col px-5 sm:px-[5vw] pt-24 sm:pt-28 pb-8 sm:pb-12"
          style={{ zIndex: 1, color: T, minHeight: '100svh' }}>
          <div aria-hidden className="pointer-events-none absolute top-0 right-0 opacity-40"
            style={{ width:'min(50vw,320px)', height:'min(50vw,320px)',
              background:'radial-gradient(circle at 65% 25%, rgba(129,140,248,0.12), transparent 65%)' }} />

          {/* Status row */}
          <div className="hero-meta flex items-center justify-between mb-6 sm:mb-0">
            <div className="flex items-center gap-2">
              <span className="status-dot block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ACC }} />
              <span className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing:'0.32em', color: MUT }}>
                {t('hero.status')}
              </span>
            </div>
            <span className="font-mono" style={{ fontSize: FS_LABEL, letterSpacing:'0.18em', color: MUT }}>2026</span>
          </div>

          {/* Title */}
          <div className="flex-1 flex items-center py-4 sm:py-8">
            <h1 className="font-display font-black uppercase leading-[0.87] tracking-[-0.03em]"
              style={{ fontSize: FS_HERO, color: T }}>
              <div className="overflow-hidden"><span className="hero-word block">{t('hero.line1')}</span></div>
              <div className="overflow-hidden">
                <span className="hero-word block">
                  {t('hero.line2')}{' '}
                  <span className="hero-pill"><span className="text-gradient">{t('hero.line3')}</span></span>
                </span>
              </div>
              <div className="overflow-hidden"><span className="hero-word block">{t('hero.line4')}</span></div>
            </h1>
          </div>

          {/* Mobile bottom */}
          <div className="hero-meta sm:hidden flex flex-col gap-3">
            <p className="font-sans leading-6" style={{ fontSize: FS_BODY, color: T2 }}>
              {t('hero.tagline')}
            </p>
            <a href={`mailto:${contactData.email}`}
              className="flex items-center justify-between gap-2 px-4 rounded-2xl"
              style={{ background:'rgba(129,140,248,0.07)', border:`1px solid ${BDG}`, color: ACC,
                fontSize:'0.72rem', fontFamily:"'JetBrains Mono',monospace", minHeight: 48, overflow:'hidden' }}>
              <span className="truncate">{contactData.email}</span>
              <span className="flex-shrink-0">↗</span>
            </a>
            <div className="flex gap-2">
              <Stat n="16+" label={t('hero.stat1')} />
              <Stat n="50+" label={t('hero.stat2')} />
              <Stat n="30+" label={t('hero.stat3')} />
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <div className="scroll-line-anim w-px h-7 flex-shrink-0"
                style={{ background:`linear-gradient(to bottom, ${ACC}, transparent)` }} />
              <span className="font-mono uppercase" style={{ fontSize:'0.52rem', letterSpacing:'0.22em', color: MUT }}>
                {t('hero.scroll')}
              </span>
            </div>
          </div>

          {/* Desktop bottom */}
          <div className="hero-meta hidden sm:grid grid-cols-3 items-end gap-8">
            <p className="font-sans text-sm leading-7 font-light" style={{ color: T2 }}>
              {t('hero.tagline')}
            </p>
            <div className="flex flex-col items-center gap-5">
              <a href={`mailto:${contactData.email}`}
                className="font-display font-semibold text-sm tracking-[0.04em] transition-all text-center"
                style={{ color: ACC, borderBottom:`1px solid ${BDG}`, paddingBottom: 2 }}
                onMouseEnter={e => (e.currentTarget.style.color = ACC2)}
                onMouseLeave={e => (e.currentTarget.style.color = ACC)}>
                {contactData.email}
              </a>
              <div className="flex flex-col items-center gap-2">
                <div className="scroll-line-anim w-px h-12"
                  style={{ background:`linear-gradient(to bottom, ${ACC}, transparent)` }} />
                <span className="font-mono uppercase" style={{ fontSize:'0.55rem', letterSpacing:'0.22em', color: MUT }}>
                  {t('hero.scroll')}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-end">
              {(['1','2','3'] as const).map(n => (
                <div key={n} className="text-right">
                  <div className="font-display text-2xl font-black leading-none text-gradient">
                    {t(`hero.stat${n}`) === 'Yrs' || t(`hero.stat${n}`) === 'Ans' || t(`hero.stat${n}`) === 'Años'
                      ? '16+' : n === '2' ? '50+' : '30+'}
                  </div>
                  <div className="font-mono uppercase mt-0.5"
                    style={{ fontSize:'0.58rem', letterSpacing:'0.1em', color: MUT }}>
                    {t(`hero.stat${n}.long`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MARQUEE ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden py-3 sm:py-4"
          style={{ zIndex:1, background:'rgba(3,3,8,0.60)',
            borderTop:`1px solid ${BDR}`, borderBottom:`1px solid ${BDR}` }}>
          <div className="marquee-track flex gap-6 sm:gap-10 whitespace-nowrap w-max">
            {[...marqueeItems,...marqueeItems,...marqueeItems].map((item, i) => (
              <span key={i} className="font-display font-bold uppercase"
                style={{ fontSize:item==='✦'?'0.45rem':'0.72rem',
                  letterSpacing:item==='✦'?0:'0.07em',
                  color:item==='✦'?ACC:MUT }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─── SERVICES ────────────────────────────────────────────── */}
        <section className="relative"
          style={{ zIndex:1, backgroundColor:'rgba(7,7,26,0.75)',
            padding:'clamp(3rem,6vw,8rem) 0', borderTop:`1px solid ${BDR}` }}>
          <div className="container">
            <div className="reveal flex flex-wrap items-baseline gap-3 sm:gap-8 mb-8 sm:mb-16">
              <Tag>{t('section.services')}</Tag>
              <h2 className="font-display font-bold leading-[0.95] tracking-[-0.02em] flex-1"
                style={{ fontSize: FS_H2, color: T }}>{t('services.heading')}</h2>
            </div>

            <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ border:`1px solid ${BDR}` }}>
              {services.map(svc => (
                <div key={svc.num} className="svc-card reveal-item group"
                  style={{ padding:'clamp(1.25rem,3.5vw,2.8rem)' }}>
                  <div className="svc-fill" />
                  <div className="svc-content flex flex-col gap-4 sm:gap-5"
                    style={{ minHeight:'clamp(180px,24vw,280px)' }}>
                    <span className="svc-text font-mono uppercase tracking-[0.18em]"
                      style={{ fontSize: FS_LABEL, color: ACC }}>{svc.num}</span>
                    <h3 className="svc-text font-display font-bold leading-[1.05] tracking-[-0.01em]"
                      style={{ fontSize:'clamp(1.2rem,2.5vw,2rem)', color: T, whiteSpace:'pre-line' }}>
                      {t(`s${svc.num}.title`)}
                    </h3>
                    <p className="svc-muted font-sans leading-7 flex-1"
                      style={{ fontSize: FS_BODY, color: T2, textAlign:'justify', hyphens:'auto' }}>
                      {t(`s${svc.num}.detail`)}
                    </p>
                    <span className="svc-arrow font-sans text-xl transition-transform duration-300 inline-block"
                      style={{ color: ACC }}>↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* ══ END SCENE ════════════════════════════════════════════════ */}

      {/* ─── SELECTED WORK — FOLDER ──────────────────────────────── */}
      <section className="relative"
        style={{ zIndex:1, backgroundColor: BG,
          padding:'clamp(3rem,6vw,8rem) 0', borderTop:`1px solid ${BDR}` }}>
        <div className="container">
          <div className="reveal flex flex-wrap items-baseline gap-3 sm:gap-8 mb-10 sm:mb-16">
            <Tag color={ACC2} bg="rgba(56,189,248,0.06)" bdr="rgba(56,189,248,0.35)">
              {t('section.portfolio')}
            </Tag>
            <h2 className="font-display font-bold leading-[0.95] tracking-[-0.02em] flex-1"
              style={{ fontSize: FS_H2, color: T }}>{t('portfolio.heading')}</h2>
          </div>
          <div className="reveal">
            <ProjectFolder />
          </div>
          <p className="text-center mt-6 sm:mt-8 font-mono uppercase tracking-[0.22em]"
            style={{ fontSize: FS_LABEL, color: MUT }}>
            {t('folder.hint')}
          </p>
        </div>
      </section>

      {/* ─── WHY — STORY SCROLL ──────────────────────────────────── */}
      <div className="relative" style={{ zIndex:1 }}>
        <FlowArt aria-label={t('why.label')}>
          {WHY_NUMS.map((num, idx) => (
            <FlowSection key={num} aria-label={t(`w${num}.title`)}
              style={{ backgroundColor: WHY_BG[idx], color: T, borderTop:`1px solid ${BDR}` }}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing:'0.28em', color: WHY_ACC[idx] }}>
                  {num} — {t('why.label')}
                </span>
                <span className="font-mono" style={{ fontSize: FS_LABEL, letterSpacing:'0.18em', color: MUT }}>
                  {idx + 1}/{WHY_NUMS.length}
                </span>
              </div>
              <hr style={{ border:'none', borderTop:`1px solid ${BDR}` }} />
              <div className="flex-1 flex items-center overflow-hidden">
                <h2 className="font-display font-black leading-[0.88] tracking-[-0.03em]"
                  style={{ fontSize:'clamp(2.2rem,8vw,10rem)', whiteSpace:'pre-line', color: T }}>
                  {t(`w${num}.title`)}
                </h2>
              </div>
              <hr style={{ border:'none', borderTop:`1px solid ${BDR}` }} />
              <p className="font-sans leading-7"
                style={{ fontSize:'clamp(0.875rem,1.8vw,1.15rem)', color: T2, maxWidth:'55ch' }}>
                {t(`w${num}.detail`)}
              </p>
            </FlowSection>
          ))}
        </FlowArt>
      </div>

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden"
        style={{ zIndex:1, backgroundColor: SURF,
          padding:'clamp(3.5rem,6vw,9rem) 0', borderTop:`1px solid ${BDR}` }}>
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 rounded-full glow-orb"
          style={{ width:'min(400px,80vw)', height:'min(400px,80vw)',
            background:'radial-gradient(circle, rgba(129,140,248,0.10) 0%, transparent 65%)' }} />
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 rounded-full glow-orb-rev"
          style={{ width:'min(320px,60vw)', height:'min(320px,60vw)',
            background:'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 65%)' }} />

        <div className="container relative z-10">
          <p className="reveal font-mono uppercase mb-4 sm:mb-6"
            style={{ fontSize: FS_LABEL, letterSpacing:'0.32em', color: ACC }}>
            {t('cta.label')}
          </p>
          <h2 className="reveal font-display font-black leading-[0.92] tracking-[-0.02em]"
            style={{ fontSize:'clamp(1.8rem,5.5vw,7rem)', color: T }}>
            {t('cta.line1')}<br />
            <span className="text-gradient">{t('cta.line2')}</span><br />
            {t('cta.line3')}
          </h2>

          <div className="reveal mt-8 sm:mt-10 pt-7 sm:pt-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-14"
            style={{ borderTop:`1px solid ${BDR}` }}>
            <Link href="/contact"
              className="flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all flex-shrink-0"
              style={{ fontSize:'clamp(0.7rem,1.5vw,0.8rem)',
                background:'linear-gradient(135deg,#6366f1,#38bdf8)', color:'#fff',
                boxShadow:'0 0 32px rgba(99,102,241,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow='0 0 50px rgba(99,102,241,0.60)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow='0 0 32px rgba(99,102,241,0.35)')}>
              {t('cta.button')} <span className="text-base leading-none">↗</span>
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 flex-1 min-w-0">
              {[
                { lk:'cta.email',  val: contactData.email,        href:`mailto:${contactData.email}` },
                { lk:'cta.loc',    val: contactData.location,     href:null as string|null },
                { lk:'cta.avail',  val: contactData.availability, href:null as string|null },
              ].map(({ lk, val, href }) => (
                <div key={lk} className="min-w-0">
                  <p className="font-mono uppercase mb-1.5" style={{ fontSize:'0.55rem', letterSpacing:'0.20em', color: MUT }}>
                    {t(lk)}
                  </p>
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
