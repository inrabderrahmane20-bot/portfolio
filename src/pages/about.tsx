import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  identity, contactData, experienceItems, educationItems,
  certifications, coreSkills, toolsTech, languageSkills,
} from '@/lib/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { bootDelay } from '@/lib/motion';
import Marquee from '@/components/Marquee';
import Magnetic from '@/components/Magnetic';
import ScrambleText from '@/components/ScrambleText';
import Stamp from '@/components/Stamp';

export default function About() {
  const heroRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const d = bootDelay();
        gsap.from('.mask-line > span', { y: '112%', duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: d });
        gsap.from('.hero-meta', { opacity: 0, y: 16, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: d + 0.5 });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  const heads = t('about.heads').split('|').filter(Boolean);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', overflowX: 'hidden' }}>

      {/* ═══ HERO ════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex flex-col" style={{ minHeight: '72svh', paddingTop: '6rem' }}>
        <div className="container flex-1 flex flex-col">
          <div className="hero-meta flex items-center justify-between flex-wrap gap-3"
            style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.9rem' }}>
            <ScrambleText className="o-label" text={t('about.file')} />
            <ScrambleText className="o-label hidden md:block" text={identity.coords} />
          </div>

          <div className="flex-1 flex flex-col justify-center" style={{ padding: 'clamp(2rem,4vw,3.5rem) 0' }}>
            <h1 className="font-serif" style={{ letterSpacing: '-0.03em', lineHeight: 0.94, fontWeight: 380 }}>
              {heads.map((w, i) => (
                <span key={w} className="mask-line">
                  <span style={{ fontSize: 'var(--fs-hero)' }}>
                    {i === heads.length - 1
                      ? <em className="it" style={{ color: 'var(--verm)' }}>{w}</em>
                      : w}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <p className="hero-meta font-sans pb-10" style={{ fontSize: 'var(--fs-body)', lineHeight: 1.75,
            color: 'var(--fg-2)', maxWidth: '52ch' }}>
            {t('about.headline')}
          </p>
        </div>
      </section>

      {/* ═══ PROFILE + FACTS ═════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20"
          style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>

          <div>
            <p className="reveal o-label" style={{ marginBottom: '2rem' }}>
              <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('about.profile')}
            </p>
            {[t('about.p1'), t('about.p2'), t('about.p3')].map((para, i) => (
              <p key={i} className="reveal font-sans"
                style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.35rem)', lineHeight: 1.7,
                  color: i === 0 ? 'var(--ink)' : 'var(--fg-2)', marginBottom: '1.6rem',
                  fontWeight: i === 0 ? 500 : 400 }}>
                {para}
              </p>
            ))}

            {/* Core skill meters */}
            <div className="reveal-group" style={{ marginTop: '3rem', borderTop: '1px solid var(--line)' }}>
              {coreSkills.map(s => (
                <div key={s.label} className="reveal-item flex items-center gap-4"
                  style={{ padding: '1rem 0', borderBottom: '1px solid var(--line)' }}>
                  <span className="font-mono flex-shrink-0" style={{ fontSize: '0.66rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase', width: 'min(46%, 240px)' }}>
                    {s.label}
                  </span>
                  <span className="flex-1" style={{ height: 1, background: 'var(--line)', position: 'relative' }}>
                    <span style={{ position: 'absolute', inset: 0, width: `${s.pct}%`, background: 'var(--verm)' }} />
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--mut)', letterSpacing: '0.1em' }}>
                    {s.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dossier facts */}
          <div className="flex flex-col gap-10">
            <div className="reveal" style={{ border: '1px solid var(--line-2)', padding: 'clamp(1.3rem,2.5vw,2rem)',
              position: 'relative', background: 'var(--paper-2)' }}>
              <Stamp size={92} className="absolute -top-10 -right-6 hidden sm:block" />
              <p className="o-label" style={{ marginBottom: '1.4rem' }}>{t('about.facts')}</p>
              {[
                [t('about.name'),  identity.name],
                [t('about.role'),  t('about.role.v')],
                [t('about.loc'),   contactData.location],
                [t('about.mail'),  contactData.email],
                ['GitHub',         identity.github],
                [t('about.avail'), t('footer.open')],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5"
                  style={{ padding: '0.7rem 0', borderBottom: '1px solid var(--line)' }}>
                  <span className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: 'var(--mut)' }}>{k}</span>
                  <span className="font-sans" style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="reveal">
              <p className="o-label" style={{ marginBottom: '1.2rem' }}>{t('about.langs')}</p>
              {languageSkills.map(l => (
                <div key={l.label} className="flex justify-between items-center"
                  style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--line)' }}>
                  <span className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 470 }}>{l.label}</span>
                  <span className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.24em',
                    textTransform: 'uppercase', color: 'var(--acc-text)' }}>
                    {t(l.levelKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TOOLS TICKER ════════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '1rem 0' }}>
        <Marquee duration={46}>
          {toolsTech.map(tool => (
            <span key={tool} className="font-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--fg-2)', paddingRight: '3.2rem',
              display: 'inline-flex', alignItems: 'center', gap: '3.2rem' }}>
              {tool} <span style={{ color: 'var(--verm)' }}>·</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ═══ EXPERIENCE — ink dossier ════════════════════════════════ */}
      <section data-theme="ink" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <div className="container" style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
          <p className="reveal o-label" style={{ marginBottom: '2.5rem' }}>
            <span style={{ color: 'var(--acc)' }}>{'//'}</span> {t('about.exp')}
          </p>
          <div className="reveal-group" style={{ borderTop: '1px solid var(--line)' }}>
            {experienceItems.map((exp, i) => (
              <div key={exp.id}
                className="reveal-item grid grid-cols-1 md:grid-cols-[minmax(9rem,12rem)_1fr_minmax(0,18rem)] gap-x-8 gap-y-3"
                style={{ padding: 'clamp(1.6rem,3vw,2.6rem) 0', borderBottom: '1px solid var(--line)' }}>
                <div>
                  <p className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--acc)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.14em',
                    color: 'var(--mut)', marginTop: '0.5rem' }}>
                    {exp.period}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif" style={{ fontSize: 'clamp(1.4rem,2.6vw,2.2rem)', fontWeight: 400,
                    lineHeight: 1.08, letterSpacing: '-0.015em' }}>
                    {exp.org}
                  </h3>
                  <p className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.24em',
                    textTransform: 'uppercase', color: 'var(--fg-2)', margin: '0.6rem 0 1rem' }}>
                    {t(exp.roleKey)} — {exp.place}
                  </p>
                  <p className="font-sans" style={{ fontSize: 'var(--fs-small)', lineHeight: 1.75,
                    color: 'var(--fg-2)', maxWidth: '62ch' }}>
                    {t(exp.descKey)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 content-start md:justify-end">
                  {exp.stack.map(s => (
                    <span key={s} className="font-mono self-start" style={{ fontSize: '0.56rem', letterSpacing: '0.14em',
                      border: '1px solid var(--line)', padding: '0.35rem 0.6rem', color: 'var(--mut)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EDUCATION + CERTIFICATIONS ══════════════════════════════ */}
      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-14"
          style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
          <div>
            <p className="reveal o-label" style={{ marginBottom: '2rem' }}>
              <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('about.edu')}
            </p>
            <div className="reveal-group" style={{ borderTop: '1px solid var(--line)' }}>
              {educationItems.map(e => (
                <div key={e.id} className="reveal-item" style={{ padding: '1.4rem 0', borderBottom: '1px solid var(--line)' }}>
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h3 className="font-serif" style={{ fontSize: 'clamp(1.15rem,2vw,1.5rem)', fontWeight: 450, lineHeight: 1.15 }}>
                      {t(e.titleKey)}
                    </h3>
                    <span className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'var(--acc-text)' }}>
                      {e.year}
                    </span>
                  </div>
                  <p className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'var(--mut)', marginTop: '0.5rem' }}>
                    {e.org}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="reveal o-label" style={{ marginBottom: '2rem' }}>
              <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('about.cert')}
            </p>
            <div className="reveal-group" style={{ borderTop: '1px solid var(--line)' }}>
              {certifications.map((c, i) => (
                <div key={c} className="reveal-item flex items-center gap-4"
                  style={{ padding: '1.4rem 0', borderBottom: '1px solid var(--line)' }}>
                  <span className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--mut)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-sans" style={{ fontSize: '1rem' }}>{c}</span>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ marginTop: '3rem' }}>
              <Magnetic>
                <Link href="/contact" className="btn-slab" data-cursor={t('ui.write')}>
                  <span>{t('about.cta')}</span>
                  <span className="arr" aria-hidden>↗</span>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
