import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useRef } from 'react';
import { workItems, caseStudyContent } from '@/lib/content';

interface Props {
  item:     { title: string; category: string; year: string; summary: string; gradient: string };
  details:  { intro: string; challenge: string; goal: string; process: string; result: string };
  nextItem: { slug: string; title: string; gradient: string } | null;
}

const SECTIONS = [
  { key: 'challenge', label: 'Challenge' },
  { key: 'goal',      label: 'Goal'      },
  { key: 'process',   label: 'Process'   },
  { key: 'result',    label: 'Result'    },
] as const;

export default function CaseStudy({ item, details, nextItem }: Props) {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from('.hero-word', { y: '115%', duration: 1.1, stagger: 0.08, ease: 'power4.out', delay: 0.1 });
        gsap.from('.hero-meta', { opacity: 0, y: 16, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.45 });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: '#F3EFE7' }}>

      {/* HERO */}
      <section ref={heroRef}
        className="relative min-h-[62vh] flex flex-col justify-between px-[5vw] pt-28 pb-16 overflow-hidden"
        style={{ backgroundColor: '#F3EFE7', color: '#FFFFFF' }}>
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 rounded-full opacity-12"
          style={{ width: 380, height: 380, background: 'radial-gradient(circle at 40% 40%, rgba(30,30,30,0.08), transparent 65%)' }} />

        <div className="hero-meta relative z-10 flex items-center gap-3">
          <Link href="/work" className="font-sans text-[0.62rem] uppercase tracking-[0.3em] transition-colors hover:opacity-60" style={{ color: '#8A8178' }}>
            Work
          </Link>
          <span style={{ color: '#CBB8A0' }}>/</span>
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: '#8A8178' }}>{item.category}</span>
        </div>

        <div className="relative z-10 py-10">
          <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3rem,9vw,11rem)', color: '#FFFFFF' }}>
            {item.title.split(' ').map((word) => (
              <div key={word} className="overflow-hidden">
                <span className="hero-word block">{word}</span>
              </div>
            ))}
          </h1>
        </div>

        <div className="hero-meta relative z-10 flex flex-wrap gap-10">
          {[{ label: 'Category', value: item.category }, { label: 'Year', value: item.year }].map(({ label, value }) => (
            <div key={label}>
              <p className="font-sans text-[0.58rem] uppercase tracking-[0.25em] mb-1" style={{ color: '#8A8178' }}>{label}</p>
              <p className="font-display font-bold text-sm tracking-[0.04em]" style={{ color: '#FFFFFF' }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FULL-WIDTH VISUAL */}
      <div className={`w-full aspect-[21/9] bg-gradient-to-br ${item.gradient}`} />

      {/* INTRO */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '5rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20">
          <div className="reveal">
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-4" style={{ color: '#8A8178' }}>Overview</p>
            <p className="font-sans text-xs leading-6" style={{ color: '#8A8178' }}>{item.summary}</p>
          </div>
          <blockquote className="reveal font-display font-bold leading-[0.95] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(1.6rem,3.5vw,3rem)', color: '#FFFFFF' }}>
            {details.intro}
          </blockquote>
        </div>
      </section>

      {/* CASE STUDY GRID */}
      <section style={{ backgroundColor: '#F3EFE7', paddingBottom: '5rem', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ borderTop: '1px solid #CBB8A0' }}>
            {SECTIONS.map(({ key, label }) => (
              <div key={key} className="reveal-item py-10 pr-0 sm:pr-12"
                style={{ borderBottom: '1px solid #CBB8A0', borderRight: '1px solid #CBB8A0' }}>
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-6" style={{ color: '#8A8178' }}>{label}</p>
                <p className="font-sans text-sm leading-8 font-light" style={{ color: '#6E5846' }}>{details[key]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '5rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-12" style={{ color: '#8A8178' }}>Deliverables</p>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-3" style={{ borderTop: '1px solid #CBB8A0' }}>
            {['Strategy & Direction', 'Motion & Interaction', 'Interface & Systems'].map((label) => (
              <div key={label} className="reveal-item py-8 px-0 sm:pr-10"
                style={{ borderBottom: '1px solid #CBB8A0', borderRight: '1px solid #CBB8A0', backgroundColor: '#FFFFFF', padding: '2rem' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-6"
                  style={{ border: '1px solid #CBB8A0' }}>
                  <span className="text-xs" style={{ color: '#8A8178' }}>↗</span>
                </div>
                <h3 className="font-display font-bold text-lg tracking-[-0.01em] mb-3" style={{ color: '#FFFFFF' }}>{label}</h3>
                <p className="font-sans text-xs leading-6" style={{ color: '#8A8178' }}>
                  A refined system built to amplify the brand&apos;s premium positioning and strategic vision.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section style={{ backgroundColor: '#F3EFE7', padding: '5rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-12" style={{ color: '#8A8178' }}>Visual Gallery</p>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`reveal-item overflow-hidden rounded-sm ${i === 0 ? 'sm:col-span-2' : ''}`}
                style={{ border: '1px solid #CBB8A0' }}>
                <div className={`bg-gradient-to-br ${item.gradient} opacity-80 ${i === 0 ? 'aspect-[16/9]' : 'aspect-[4/5]'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEXT PROJECT */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '6rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
          <div>
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-5" style={{ color: '#8A8178' }}>
              {nextItem ? 'Next project' : 'Back to portfolio'}
            </p>
            <h2 className="font-display font-bold leading-[0.9] tracking-[-0.02em] uppercase"
              style={{ fontSize: 'clamp(2rem,5vw,5rem)', color: '#FFFFFF' }}>
              {nextItem ? nextItem.title : 'View All Work'}
            </h2>
          </div>
          <Link
            href={nextItem ? `/work/${nextItem.slug}` : '/work'}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-[0.75rem] uppercase tracking-[0.1em] transition-opacity hover:opacity-80 flex-shrink-0"
            style={{ backgroundColor: '#1E1E1E', color: '#FFFFFF' }}>
            {nextItem ? 'Next Project' : 'All Projects'}
            <span className="text-base leading-none">↗</span>
          </Link>
        </div>
      </section>

    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: workItems.map((item) => ({ params: { slug: item.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug    = params?.slug as string;
  const item    = workItems.find((e) => e.slug === slug);
  const details = caseStudyContent[slug] ?? null;
  if (!item || !details) return { notFound: true };
  const idx  = workItems.findIndex((e) => e.slug === slug);
  const next = workItems[(idx + 1) % workItems.length];
  const nextItem = next && next.slug !== slug
    ? { slug: next.slug, title: next.title, gradient: next.gradient }
    : null;
  return { props: { item, details, nextItem } };
};
