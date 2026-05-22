import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useRef } from 'react';
import { workItems, caseStudyContent } from '@/lib/content';
import AuroraBackground from '@/components/AuroraBackground';

const BG      = '#030308';
const SURF    = '#07071a';
const TEXT    = '#ffffff';
const TEXT2   = 'rgba(255,255,255,0.62)';
const MUTED   = 'rgba(255,255,255,0.32)';
const BDR     = 'rgba(255,255,255,0.07)';
const BDRGLOW = 'rgba(129,140,248,0.38)';
const ACCENT  = '#818cf8';
const ACCENT2 = '#38bdf8';

interface Props {
  item:     { title: string; category: string; year: string; summary: string; gradient: string; image?: string };
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
    <div className="overflow-x-hidden relative" style={{ backgroundColor: BG }}>
      <AuroraBackground />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[62vh] flex flex-col justify-between px-5 sm:px-[5vw] pt-28 pb-12 overflow-hidden"
        style={{ zIndex: 1, color: TEXT }}
      >
        <div aria-hidden className="pointer-events-none absolute top-0 right-0"
          style={{ width: 'clamp(200px,40vw,500px)', height: 'clamp(200px,40vw,500px)',
            background: 'radial-gradient(circle at 60% 20%, rgba(129,140,248,0.10), transparent 65%)' }} />

        {/* Breadcrumb */}
        <div className="hero-meta relative z-10 flex items-center gap-3">
          <Link href="/work"
            className="font-mono text-[0.58rem] uppercase tracking-[0.30em] transition-colors hover:text-white"
            style={{ color: MUTED }}>
            Work
          </Link>
          <span style={{ color: MUTED }}>/</span>
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.30em]" style={{ color: ACCENT }}>{item.category}</span>
        </div>

        <div className="relative z-10 py-8 sm:py-10">
          <h1
            className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.8rem,9vw,11rem)', color: TEXT }}
          >
            {item.title.split(' ').map((word) => (
              <div key={word} className="overflow-hidden">
                <span className="hero-word block">{word}</span>
              </div>
            ))}
          </h1>
        </div>

        <div className="hero-meta relative z-10 flex flex-wrap gap-6 sm:gap-10">
          {[{ label: 'Category', value: item.category }, { label: 'Year', value: item.year }].map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] mb-1" style={{ color: MUTED }}>{label}</p>
              <p className="font-display font-bold text-sm tracking-[0.04em] px-3 py-1 rounded-full"
                style={{ color: ACCENT, border: `1px solid ${BDRGLOW}`, background: 'rgba(129,140,248,0.07)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FULL-WIDTH SCREENSHOT / VISUAL */}
      <div className="relative" style={{ zIndex: 1 }}>
        {item.image ? (
          <div className="w-full aspect-[21/9] overflow-hidden relative" style={{ borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}` }}>
            <img src={item.image} alt={item.title} className="w-full h-full object-cover object-top" />
            {/* Overlay gradient so text sections below blend well */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(3,3,8,0.6) 100%)' }} />
          </div>
        ) : (
          <div className={`w-full aspect-[21/9] bg-gradient-to-br ${item.gradient}`}
            style={{ borderTop: `1px solid ${BDR}` }} />
        )}
      </div>

      {/* INTRO */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: 'rgba(7,7,26,0.80)', backdropFilter: 'blur(4px)', padding: '4rem 0 5rem', borderTop: `1px solid ${BDR}` }}>
        <div className="container grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 lg:gap-20">
          <div className="reveal">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-4" style={{ color: MUTED }}>Overview</p>
            <p className="font-sans text-sm leading-7" style={{ color: TEXT2 }}>{item.summary}</p>
          </div>
          <blockquote
            className="reveal font-display font-bold leading-[0.95] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(1.4rem,3.5vw,3rem)', color: TEXT }}
          >
            {details.intro}
          </blockquote>
        </div>
      </section>

      {/* CASE STUDY GRID */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, paddingBottom: '4rem', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ borderTop: `1px solid ${BDR}` }}>
            {SECTIONS.map(({ key, label }, idx) => (
              <div key={key}
                className="reveal-item py-8 sm:py-10 pr-0 sm:pr-12"
                style={{
                  borderBottom: `1px solid ${BDR}`,
                  borderRight: idx % 2 === 0 ? `1px solid ${BDR}` : 'none',
                }}>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-5"
                  style={{ color: ACCENT }}>{label}</p>
                <p className="font-sans text-sm leading-8 font-light" style={{ color: TEXT2 }}>{details[key]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: SURF, padding: '4rem 0 5rem', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-10" style={{ color: MUTED }}>Deliverables</p>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '⬡', label: 'Strategy & Direction', desc: 'Brand architecture, user research, information hierarchy, and creative direction aligned to business goals.' },
              { icon: '◈', label: 'Motion & Interaction', desc: 'Scroll animations, micro-interactions, page transitions, and gesture-driven components for fluid UX.' },
              { icon: '◻', label: 'Interface & Systems', desc: 'Production-ready front-end, responsive layouts, design tokens, and accessible component library.' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="reveal-item glass-card p-6 sm:p-8">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-6"
                  style={{ border: `1px solid ${BDRGLOW}`, background: 'rgba(129,140,248,0.08)' }}>
                  <span className="text-xs" style={{ color: ACCENT }}>{icon}</span>
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg tracking-[-0.01em] mb-3" style={{ color: TEXT }}>{label}</h3>
                <p className="font-sans text-xs sm:text-sm leading-6" style={{ color: TEXT2 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — screenshot + gradient variants */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, padding: '4rem 0 5rem', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-10" style={{ color: MUTED }}>Visual Gallery</p>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i}
                className={`reveal-item overflow-hidden rounded-xl ${i === 0 ? 'sm:col-span-2' : ''}`}
                style={{ border: `1px solid ${BDR}` }}>
                {item.image ? (
                  <img src={item.image} alt={`${item.title} preview ${i + 1}`}
                    className={`w-full object-cover object-top ${i === 0 ? 'aspect-[16/9]' : 'aspect-[4/5]'}`} />
                ) : (
                  <div className={`bg-gradient-to-br ${item.gradient} opacity-80 ${i === 0 ? 'aspect-[16/9]' : 'aspect-[4/5]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEXT PROJECT */}
      <section className="relative overflow-hidden" style={{ zIndex: 1, backgroundColor: SURF, padding: '5rem 0', borderTop: `1px solid ${BDR}` }}>
        <div aria-hidden className="pointer-events-none absolute -bottom-12 -left-12 rounded-full glow-orb"
          style={{ width: 280, height: 280, background: 'radial-gradient(circle, rgba(129,140,248,0.10) 0%, transparent 65%)' }} />
        <div className="container relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-10">
          <div>
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-4 sm:mb-5" style={{ color: MUTED }}>
              {nextItem ? 'Next project' : 'Back to portfolio'}
            </p>
            <h2
              className="font-display font-bold leading-[0.9] tracking-[-0.02em] uppercase"
              style={{ fontSize: 'clamp(1.8rem,5vw,5rem)', color: TEXT }}
            >
              {nextItem ? nextItem.title : 'View All Work'}
            </h2>
          </div>
          <Link
            href={nextItem ? `/work/${nextItem.slug}` : '/work'}
            className="flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all flex-shrink-0"
            style={{
              fontSize: 'clamp(0.68rem,1.5vw,0.75rem)',
              background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
              color: '#fff',
              boxShadow: '0 0 32px rgba(99,102,241,0.30)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(99,102,241,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.30)')}
          >
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
