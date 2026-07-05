import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { workItems, caseStudyContent } from '@/lib/content';
import { bootDelay } from '@/lib/motion';
import Magnetic from '@/components/Magnetic';
import ScrambleText from '@/components/ScrambleText';

type WorkItem = (typeof workItems)[number];

interface Props {
  item: WorkItem;
  details: { titleKey: string; introKey: string; challengeKey: string; goalKey: string; processKey: string; resultKey: string };
  nextItem: { slug: string; title: string; titleKey: string } | null;
  index: number;
}

const SECTIONS = [
  { key: 'challenge', label: 'cs.challenge' },
  { key: 'goal',      label: 'cs.goal' },
  { key: 'process',   label: 'cs.process' },
  { key: 'result',    label: 'cs.result' },
] as const;

export default function CaseStudy({ item, details, nextItem, index }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const d = bootDelay();
        gsap.from('.mask-line > span', { y: '112%', duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: d });
        gsap.from('.hero-meta', { opacity: 0, y: 16, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: d + 0.45 });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', overflowX: 'hidden' }}>

      {/* ═══ HERO ════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex flex-col" style={{ minHeight: '64svh', paddingTop: '6rem' }}>
        <div className="container flex-1 flex flex-col">
          <div className="hero-meta flex items-center justify-between flex-wrap gap-3"
            style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.9rem' }}>
            <span className="o-label" style={{ display: 'inline-flex', gap: '0.8rem' }}>
              <Link href="/work" className="u-sweep" style={{ color: 'var(--fg-2)' }}>{t('nav.work')}</Link>
              <span aria-hidden>/</span>
              <span style={{ color: 'var(--acc-text)' }}>{t(item.categoryKey)}</span>
            </span>
            <ScrambleText className="o-label" text={`FILE ${String(index + 1).padStart(3, '0')} — ${item.year}`} />
          </div>

          <div className="flex-1 flex flex-col justify-center" style={{ padding: 'clamp(2rem,4vw,3.5rem) 0' }}>
            <h1 className="font-serif" style={{ letterSpacing: '-0.03em', lineHeight: 0.96, fontWeight: 380 }}>
              {t(item.titleKey).split(' ').map((w, i, arr) => (
                <span key={`${w}-${i}`} className="mask-line">
                  <span style={{ fontSize: 'var(--fs-hero)' }}>
                    {i === arr.length - 1 && arr.length > 1
                      ? <em className="it" style={{ color: 'var(--verm)' }}>{w}</em>
                      : w}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div className="hero-meta flex flex-wrap items-center gap-x-8 gap-y-3 pb-10">
            {item.stack.map(s => (
              <span key={s} className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', border: '1px solid var(--line-2)', padding: '0.45rem 0.8rem',
                color: 'var(--fg-2)' }}>
                {s}
              </span>
            ))}
            {item.metric && (
              <span className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', background: 'var(--verm)', color: '#FFF7F2', padding: '0.5rem 0.85rem' }}>
                {item.metric}
              </span>
            )}
            {item.link && (
              <a href={item.link} target="_blank" rel="noreferrer" className="font-mono u-sweep"
                data-cursor={t('ui.visit')}
                style={{ fontSize: '0.66rem', letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'var(--acc-text)' }}>
                {t('cs.live')} ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ═══ PLATE ═══════════════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid var(--line)', background: 'var(--ink)', padding: 'clamp(0.6rem,2vw,1.4rem)' }}>
        <img src={item.image} alt={t(item.titleKey)}
          style={{ width: '100%', aspectRatio: '21/9', objectFit: 'cover', objectPosition: 'top' }} />
      </div>

      {/* ═══ INTRO ═══════════════════════════════════════════════════ */}
      <section className="container grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 lg:gap-20"
        style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
        <div className="reveal">
          <p className="o-label" style={{ marginBottom: '1.4rem' }}>
            <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('cs.overview')}
          </p>
          <p className="font-sans" style={{ fontSize: 'var(--fs-small)', lineHeight: 1.8, color: 'var(--fg-2)' }}>
            {t(item.summaryKey)}
          </p>
        </div>
        <blockquote className="reveal font-serif" style={{ fontSize: 'clamp(1.5rem,3.2vw,3rem)', fontWeight: 400,
          lineHeight: 1.18, letterSpacing: '-0.015em' }}>
          {t(details.introKey)}
        </blockquote>
      </section>

      {/* ═══ DOSSIER GRID ════════════════════════════════════════════ */}
      <section data-theme="ink" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <div className="container" style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
          <div className="reveal-group grid grid-cols-1 md:grid-cols-2" style={{ border: '1px solid var(--line)' }}>
            {SECTIONS.map(({ key, label }, idx) => (
              <div key={key} className="reveal-item"
                style={{ padding: 'clamp(1.6rem,3.4vw,3rem)',
                  borderRight: idx % 2 === 0 ? '1px solid var(--line)' : 'none',
                  borderBottom: idx < 2 ? '1px solid var(--line)' : 'none' }}>
                <div className="flex items-baseline justify-between" style={{ marginBottom: '1.4rem' }}>
                  <p className="o-label" style={{ color: 'var(--acc)' }}>{t(label)}</p>
                  <span className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--mut)' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="font-sans" style={{ fontSize: 'var(--fs-small)', lineHeight: 1.8, color: 'var(--fg-2)' }}>
                  {t(details[`${key}Key`])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═════════════════════════════════════════════════ */}
      <section className="container" style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
        <p className="reveal o-label" style={{ marginBottom: '2rem' }}>
          <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('cs.gallery')}
        </p>
        <div className="reveal-group grid grid-cols-1 sm:grid-cols-3 gap-4">
          {item.gallery.map((src, i) => {
            const wide = i === 0 || item.gallery.length === 1;
            return (
              <div key={src + i} className={`reveal-item ${wide ? 'sm:col-span-2' : ''}`}
                style={{ border: '1px solid var(--line-2)', background: 'var(--paper-2)', padding: 8 }}>
                <img src={src} alt={`${t(item.titleKey)} — ${i + 1}`}
                  loading="lazy"
                  style={{ width: '100%', objectFit: 'cover', objectPosition: 'top',
                    aspectRatio: wide ? '16/9' : '4/4.4', display: 'block' }} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ NEXT ════════════════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container flex flex-col sm:flex-row sm:items-end justify-between gap-8"
          style={{ paddingTop: 'clamp(3rem,6vw,5.5rem)', paddingBottom: 'clamp(3rem,6vw,5.5rem)' }}>
          <div>
            <p className="reveal o-label" style={{ marginBottom: '1.1rem' }}>
              <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {nextItem ? t('cs.next') : t('cs.back')}
            </p>
            <h2 className="reveal font-serif" style={{ fontSize: 'var(--fs-h2)', fontWeight: 400,
              lineHeight: 1, letterSpacing: '-0.02em' }}>
              {nextItem ? t(nextItem.titleKey) : t('cs.btn.a')}
            </h2>
          </div>
          <Magnetic>
            <Link href={nextItem ? `/work/${nextItem.slug}` : '/work'} className="btn-slab reveal"
              data-cursor={t('ui.open')}>
              <span>{nextItem ? t('cs.btn.n') : t('cs.btn.a')}</span>
              <span className="arr" aria-hidden>↗</span>
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: workItems.map(item => ({ params: { slug: item.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const item = workItems.find(e => e.slug === slug);
  const details = caseStudyContent[slug] ?? null;
  if (!item || !details) return { notFound: true };
  const idx = workItems.findIndex(e => e.slug === slug);
  const next = workItems[(idx + 1) % workItems.length];
  const nextItem = next && next.slug !== slug
    ? { slug: next.slug, title: next.title, titleKey: next.titleKey }
    : null;
  return { props: { item, details, nextItem, index: idx } };
};
