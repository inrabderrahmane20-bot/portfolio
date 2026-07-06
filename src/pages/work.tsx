import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { workItems } from '@/lib/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { bootDelay } from '@/lib/motion';
import WorkIndex from '@/components/WorkIndex';
import Magnetic from '@/components/Magnetic';
import ScrambleText from '@/components/ScrambleText';

export default function Work() {
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

  return (
    <div style={{ background: 'transparent', color: 'var(--fg)', overflowX: 'hidden' }}>

      {/* ═══ HERO ════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex flex-col" style={{ minHeight: '62svh', paddingTop: '6rem' }}>
        <div className="container flex-1 flex flex-col">
          <div className="hero-meta flex items-center justify-between flex-wrap gap-3"
            style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.9rem' }}>
            <ScrambleText className="o-label" text={t('work.file')} />
            <span className="o-label">{String(workItems.length).padStart(3, '0')} — {t('work.count')}</span>
          </div>

          <div className="flex-1 flex flex-col justify-center" style={{ padding: 'clamp(2rem,4vw,3.5rem) 0' }}>
            <h1 className="font-serif" style={{ letterSpacing: '-0.03em', lineHeight: 0.94, fontWeight: 800 }}>
              <span className="mask-line"><span style={{ fontSize: 'var(--fs-hero)' }}>{t('work.h1')}</span></span>
              <span className="mask-line">
                <span style={{ fontSize: 'var(--fs-hero)' }}>
                  <em className="it" style={{ color: 'var(--verm)' }}>{t('work.h2')}</em>
                </span>
              </span>
            </h1>
          </div>

          <p className="hero-meta font-sans pb-10" style={{ fontSize: 'var(--fs-body)', lineHeight: 1.75,
            color: 'var(--fg-2)', maxWidth: '48ch' }}>
            {t('work.tag')}
          </p>
        </div>
      </section>

      {/* ═══ LEDGER ══════════════════════════════════════════════════ */}
      <section className="container" style={{ paddingBottom: 'var(--section-y)' }}>
        <WorkIndex />
      </section>

      {/* ═══ CTA ═════════════════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container flex flex-col sm:flex-row sm:items-end justify-between gap-8"
          style={{ paddingTop: 'clamp(3rem,6vw,5.5rem)', paddingBottom: 'clamp(3rem,6vw,5.5rem)' }}>
          <div>
            <p className="reveal o-label" style={{ marginBottom: '1.1rem' }}>
              <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('work.cta.l')}
            </p>
            <h2 className="reveal font-serif" style={{ fontSize: 'var(--fs-h2)', fontWeight: 600,
              lineHeight: 1, letterSpacing: '-0.02em', maxWidth: '14ch' }}>
              {t('work.cta.h')} <em className="it" style={{ color: 'var(--verm)' }}>{t('work.cta.h2')}</em>
            </h2>
          </div>
          <Magnetic>
            <Link href="/contact" className="btn-slab reveal" data-cursor={t('ui.write')}>
              <span>{t('work.cta.btn')}</span>
              <span className="arr" aria-hidden>↗</span>
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  );
}
