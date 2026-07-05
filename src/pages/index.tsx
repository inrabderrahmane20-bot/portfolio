import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  identity, contactData, capabilities, experienceItems,
  ledgerFacts, clients,
} from '@/lib/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { bootDelay } from '@/lib/motion';
import HeroField from '@/components/HeroField';
import WorkIndex from '@/components/WorkIndex';
import Marquee from '@/components/Marquee';
import Magnetic from '@/components/Magnetic';
import ScrambleText from '@/components/ScrambleText';
import Stamp from '@/components/Stamp';

/* Small vermilion asterisk used as a typographic separator */
function Aster({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden
      style={{ flexShrink: 0, color: 'var(--verm)' }}>
      {[0, 45, 90, 135].map(a => (
        <rect key={a} x={9} y={1} width={2} height={18} fill="currentColor"
          transform={`rotate(${a} 10 10)`} />
      ))}
    </svg>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const pinRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const philRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  /* ── Hero entrance ─────────────────────────────────────────────────── */
  useEffect(() => {
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const d = bootDelay();
        gsap.from('.mask-line > span', {
          y: '112%', duration: 1.25, stagger: 0.1, ease: 'power4.out', delay: d,
        });
        gsap.from('.hero-meta', {
          opacity: 0, y: 16, duration: 1, stagger: 0.08, ease: 'power3.out', delay: d + 0.55,
        });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  /* ── Career ledger — pinned horizontal scroll (desktop) ────────────── */
  useEffect(() => {
    let ctx: any;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced || window.innerWidth < 900) return;
      const track = trackRef.current, pin = pinRef.current;
      if (!track || !pin) return;
      ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, pin);
    });
    return () => ctx?.revert?.();
  }, []);

  /* ── Philosophy — word-by-word scrub reveal ────────────────────────── */
  useEffect(() => {
    let ctx: any;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      if (!philRef.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo('.phil-w', { opacity: 0.13 }, {
          opacity: 1, stagger: 0.05, ease: 'none',
          scrollTrigger: {
            trigger: philRef.current, start: 'top 78%', end: 'top 22%', scrub: 0.8,
          },
        });
      }, philRef);
    });
    return () => ctx?.revert?.();
  }, [t]);

  const marqueeTokens = t('marquee').split('|');
  const philWords = t('phil.quote').split(' ');

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', overflowX: 'hidden' }}>

      {/* ═══ HERO ════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex flex-col"
        style={{ minHeight: '100svh', paddingTop: '6rem' }}>
        <HeroField />

        <div className="container relative flex-1 flex flex-col" style={{ zIndex: 1 }}>

          {/* Dossier header */}
          <div className="hero-meta flex items-center justify-between flex-wrap gap-3"
            style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.9rem' }}>
            <ScrambleText className="o-label" text={t('hero.file')} />
            <span className="o-label hidden sm:inline-flex" style={{ alignItems: 'center', gap: 8 }}>
              <i className="status-dot" style={{ width: 6, height: 6, borderRadius: '50%',
                background: 'var(--verm)', display: 'inline-block' }} />
              {t('hero.status')}
            </span>
            <ScrambleText className="o-label hidden md:block" text={identity.coords} />
          </div>

          {/* Name */}
          <div className="flex-1 flex flex-col justify-center" style={{ padding: 'clamp(2rem,4vw,4rem) 0' }}>
            <div className="relative">
              <h1 className="font-serif" style={{ letterSpacing: '-0.03em', lineHeight: 0.92, fontWeight: 380 }}>
                <span className="mask-line">
                  <span style={{ fontSize: 'var(--fs-mega)' }}>ABDERRAHMANE</span>
                </span>
                <span className="mask-line">
                  <span style={{ fontSize: 'var(--fs-mega)', display: 'flex', alignItems: 'baseline', gap: '0.18em', flexWrap: 'wrap' }}>
                    <em className="it" style={{ color: 'var(--verm)' }}>CHARAK</em>
                    <span className="font-mono hidden sm:inline" style={{
                      fontSize: 'clamp(0.6rem, 1vw, 0.85rem)', letterSpacing: '0.3em',
                      color: 'var(--mut)', fontStyle: 'normal' }}>
                      {t('hero.paren')}
                    </span>
                  </span>
                </span>
              </h1>
              <div className="hero-meta hidden xl:block"
                style={{ position: 'absolute', right: '1vw', top: '-3.5rem' }}>
                <Stamp size={132}
                  text={`${identity.name.toUpperCase()} — ${identity.role.toUpperCase()} — MARRAKECH — `} />
              </div>
            </div>
          </div>

          {/* Under-headline row */}
          <div className="pb-8 grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-8 items-end">
            <p className="hero-meta font-sans" style={{
              fontSize: 'var(--fs-body)', lineHeight: 1.75, color: 'var(--fg-2)', maxWidth: '46ch' }}>
              {t('hero.tagline')}
            </p>

            <div className="hero-meta flex flex-wrap gap-2">
              {[t('hero.chip1'), t('hero.chip2'), t('hero.chip3')].map(chip => (
                <span key={chip} className="font-mono" style={{
                  fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  border: '1px solid var(--line-2)', padding: '0.5rem 0.85rem', color: 'var(--fg-2)' }}>
                  {chip}
                </span>
              ))}
            </div>

            <div className="hero-meta hidden md:flex flex-col items-end gap-2">
              <span className="o-label">{t('hero.scroll')}</span>
              <svg width="14" height="44" viewBox="0 0 14 44" aria-hidden>
                <line x1="7" y1="0" x2="7" y2="36" stroke="var(--verm)" strokeWidth="1" />
                <path d="M2 32 L7 40 L12 32" fill="none" stroke="var(--verm)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═════════════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        padding: '1.1rem 0', background: 'var(--paper)' }}>
        <Marquee duration={34}>
          {marqueeTokens.map((token, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '2.2rem', paddingRight: '2.2rem' }}>
              {i % 2 === 0 ? (
                <span className="font-serif it" style={{ fontSize: '1.35rem', color: 'var(--ink)' }}>{token}</span>
              ) : (
                <span className="font-mono" style={{ fontSize: '0.72rem', letterSpacing: '0.3em',
                  textTransform: 'uppercase', color: 'var(--fg-2)' }}>{token}</span>
              )}
              <Aster />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ═══ SELECTED WORK ═══════════════════════════════════════════ */}
      <section className="container" style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
        <div className="reveal flex items-end justify-between gap-6 flex-wrap" style={{ marginBottom: 'clamp(2rem,4vw,4rem)' }}>
          <div>
            <p className="o-label" style={{ marginBottom: '1.1rem' }}>
              <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('work.label')} — 001–005
            </p>
            <h2 className="font-serif" style={{ fontSize: 'var(--fs-h2)', fontWeight: 400,
              lineHeight: 0.98, letterSpacing: '-0.02em' }}>
              {t('work.h1')} <em className="it" style={{ color: 'var(--verm)' }}>{t('work.h2')}</em>
            </h2>
          </div>
          <Link href="/work" className="font-mono u-sweep" data-cursor={t('ui.view')}
            style={{ fontSize: '0.66rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>
            {t('work.all')} →
          </Link>
        </div>
        <WorkIndex />
      </section>

      {/* ═══ CAPABILITIES ════════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container" style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
          <div className="reveal" style={{ marginBottom: 'clamp(2rem,4vw,4rem)' }}>
            <p className="o-label" style={{ marginBottom: '1.1rem' }}>
              <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('cap.label')}
            </p>
            <h2 className="font-serif" style={{ fontSize: 'var(--fs-h2)', fontWeight: 400,
              lineHeight: 0.98, letterSpacing: '-0.02em', maxWidth: '16ch' }}>
              {t('cap.h1')} <em className="it" style={{ color: 'var(--verm)' }}>{t('cap.h2')}</em>
            </h2>
          </div>

          <div className="reveal-group" style={{ borderTop: '1px solid var(--line)' }}>
            {capabilities.map((cap) => (
              <div key={cap.id}
                className="idx-row reveal-item grid-cols-1 md:grid-cols-[minmax(3rem,6rem)_1.2fr_1.6fr_minmax(0,16rem)] items-start gap-x-6 gap-y-3"
                style={{ padding: 'clamp(1.6rem,3.4vw,2.8rem) clamp(0.25rem,1vw,1rem)' }}>
                <span className="idx-num font-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.2em',
                  color: 'var(--mut)', transition: 'color 0.35s ease' }}>
                  {cap.num}
                </span>
                <h3 className="font-serif" style={{ fontSize: 'clamp(1.5rem,3vw,2.6rem)', fontWeight: 430,
                  lineHeight: 1.05, letterSpacing: '-0.015em', whiteSpace: 'pre-line' }}>
                  {t(`${cap.id}.title`)}
                </h3>
                <p className="idx-mut font-sans" style={{ fontSize: 'var(--fs-body)', lineHeight: 1.7,
                  color: 'var(--fg-2)', transition: 'color 0.35s ease, opacity 0.35s ease', maxWidth: '52ch' }}>
                  {t(`${cap.id}.detail`)}
                </p>
                <span className="idx-mut font-mono md:text-right" style={{ fontSize: '0.6rem',
                  letterSpacing: '0.14em', color: 'var(--mut)', lineHeight: 2,
                  transition: 'color 0.35s ease, opacity 0.35s ease' }}>
                  {cap.tools.join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CAREER LEDGER — pinned horizontal scroll ════════════════ */}
      <section data-theme="ink" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <div ref={pinRef} style={{ overflow: 'hidden' }}>
          <div className="container" style={{ paddingTop: 'clamp(3rem,6vw,5rem)', paddingBottom: '1rem' }}>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="o-label" style={{ marginBottom: '1.1rem' }}>
                  <span style={{ color: 'var(--acc)' }}>{'//'}</span> {t('ledger.label')}
                </p>
                <h2 className="font-serif" style={{ fontSize: 'var(--fs-h2)', fontWeight: 380,
                  lineHeight: 0.98, letterSpacing: '-0.02em' }}>
                  {t('ledger.h1')} <em className="it" style={{ color: 'var(--acc)' }}>2022 → 2026</em>
                </h2>
              </div>
              <span className="o-label hidden md:block">{t('ledger.hint')}</span>
            </div>
          </div>

          {/* Track — horizontal on desktop, vertical stack on mobile */}
          <div ref={trackRef}
            className="flex flex-col md:flex-row md:flex-nowrap md:w-max gap-6 md:gap-8"
            style={{ padding: 'clamp(2rem,4vw,3.5rem) var(--pad)' }}>
            {experienceItems.map((exp, i) => (
              <article key={exp.id}
                className="flex flex-col md:w-[min(78vw,560px)] flex-shrink-0"
                style={{ border: '1px solid var(--line)', background: 'var(--card)',
                  padding: 'clamp(1.4rem,3vw,2.4rem)', minHeight: 'min(58vh, 460px)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                  <span className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.22em', color: 'var(--acc)' }}>
                    {String(i + 1).padStart(2, '0')} / {exp.period}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.22em', color: 'var(--mut)' }}>
                    {exp.place.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-serif" style={{ fontSize: 'clamp(1.6rem,2.6vw,2.4rem)', fontWeight: 400,
                  lineHeight: 1.05, letterSpacing: '-0.015em', marginBottom: '0.6rem' }}>
                  {exp.org}
                </h3>
                <p className="font-mono" style={{ fontSize: '0.66rem', letterSpacing: '0.24em',
                  textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: '1.4rem' }}>
                  {t(exp.roleKey)}
                </p>
                <p className="font-sans flex-1" style={{ fontSize: 'var(--fs-small)', lineHeight: 1.75, color: 'var(--fg-2)' }}>
                  {t(exp.descKey)}
                </p>
                <div className="flex flex-wrap gap-1.5" style={{ marginTop: '1.6rem' }}>
                  {exp.stack.map(s => (
                    <span key={s} className="font-mono" style={{ fontSize: '0.56rem', letterSpacing: '0.14em',
                      border: '1px solid var(--line)', padding: '0.35rem 0.6rem', color: 'var(--mut)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </article>
            ))}

            {/* End card → resume */}
            <Link href="/resume" data-cursor={t('ui.open')}
              className="flex flex-col items-start justify-between md:w-[min(60vw,420px)] flex-shrink-0 group"
              style={{ border: '1px solid var(--line-2)', background: 'var(--acc)', color: '#FFF7F2',
                padding: 'clamp(1.4rem,3vw,2.4rem)', minHeight: 'min(58vh, 460px)' }}>
              <span className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.24em' }}>
                {t('ledger.cv.label')}
              </span>
              <span className="font-serif" style={{ fontSize: 'clamp(1.9rem,3.4vw,3rem)', fontWeight: 400,
                lineHeight: 1.02, letterSpacing: '-0.02em' }}>
                {t('ledger.cv.title')}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"
                  style={{ marginLeft: '0.3em' }}>↗</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Verified numbers */}
        <div className="container" style={{ borderTop: '1px solid var(--line)', paddingTop: '2.2rem', paddingBottom: '3rem' }}>
          <div className="reveal-group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8">
            {ledgerFacts.map(f => (
              <div key={f.labelKey} className="reveal-item">
                <p className="font-serif" style={{ fontSize: 'clamp(1.7rem,3vw,2.6rem)', fontWeight: 380,
                  lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {f.value}
                </p>
                <p className="font-mono" style={{ fontSize: '0.56rem', letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: 'var(--mut)', marginTop: '0.6rem' }}>
                  {t(f.labelKey)}
                </p>
              </div>
            ))}
          </div>
          <p className="reveal font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em',
            color: 'var(--mut)', marginTop: '2.4rem', textTransform: 'uppercase' }}>
            {t('ledger.clients')} — {clients.join(' · ')}
          </p>
        </div>
      </section>

      {/* ═══ PHILOSOPHY ══════════════════════════════════════════════ */}
      <section ref={philRef} className="container"
        style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
        <p className="o-label" style={{ marginBottom: '2rem' }}>
          <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('phil.label')}
        </p>
        <blockquote className="font-serif" style={{ fontSize: 'clamp(1.7rem,4.6vw,4.4rem)', fontWeight: 400,
          lineHeight: 1.14, letterSpacing: '-0.02em', maxWidth: '24ch' }}>
          {philWords.map((w, i) => {
            const emph = w.startsWith('*') && w.endsWith('*');
            const clean = emph ? w.slice(1, -1) : w;
            return (
              <span key={i} className="phil-w" style={emph
                ? { fontStyle: 'italic', color: 'var(--verm)' }
                : undefined}>
                {clean}{' '}
              </span>
            );
          })}
        </blockquote>
        <div className="reveal flex items-center gap-4" style={{ marginTop: '3rem' }}>
          <Magnetic>
            <Link href="/contact" className="btn-slab" data-cursor={t('ui.write')}>
              <span>{t('phil.cta')}</span>
              <span className="arr" aria-hidden>↗</span>
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  );
}
