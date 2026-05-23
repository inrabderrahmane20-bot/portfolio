import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useRef } from 'react';
import { workItems, caseStudyContent } from '@/lib/content';
import AuroraBackground from '@/components/AuroraBackground';

const BG   = '#030308';
const SURF = '#07071a';
const T    = '#ffffff';
const T2   = 'rgba(255,255,255,0.62)';
const MUT  = 'rgba(255,255,255,0.32)';
const BDR  = 'rgba(255,255,255,0.07)';
const BDG  = 'rgba(129,140,248,0.38)';
const ACC  = '#818cf8';

const FS_HERO  = 'clamp(2.2rem,8.5vw,11rem)';
const FS_H2    = 'clamp(1.5rem,3.5vw,3.5rem)';
const FS_LABEL = '0.625rem';
const FS_BODY  = '0.875rem';
const SP       = 'clamp(2.5rem,5vw,5rem)';

interface Props {
  item:     { title:string; category:string; year:string; summary:string; gradient:string; image?:string };
  details:  { intro:string; challenge:string; goal:string; process:string; result:string };
  nextItem: { slug:string; title:string; gradient:string } | null;
}

const SECTIONS = [
  { key:'challenge', label:'Challenge' },
  { key:'goal',      label:'Goal'      },
  { key:'process',   label:'Process'   },
  { key:'result',    label:'Result'    },
] as const;

export default function CaseStudy({ item, details, nextItem }: Props) {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from('.hero-word', { y: '110%', duration: 1.1, stagger: 0.08, ease: 'power4.out', delay: 0.1 });
        gsap.from('.hero-meta', { opacity: 0, y: 14, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: 0.45 });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  return (
    <div style={{ backgroundColor: BG, overflowX: 'hidden', position: 'relative' }}>
      <AuroraBackground />

      {/* Hero */}
      <section ref={heroRef}
        className="relative flex flex-col justify-between px-5 sm:px-[5vw] pt-24 sm:pt-28 pb-10 sm:pb-14 overflow-hidden"
        style={{ zIndex: 1, minHeight: '52vh', color: T }}>
        <div aria-hidden className="pointer-events-none absolute top-0 right-0 opacity-40"
          style={{ width: 'min(45vw,400px)', height: 'min(45vw,400px)',
            background: 'radial-gradient(circle at 65% 20%, rgba(129,140,248,0.12), transparent 65%)' }} />

        {/* Breadcrumb */}
        <div className="hero-meta relative z-10 flex items-center gap-3 flex-wrap">
          <Link href="/work" className="font-mono uppercase transition-colors"
            style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}
            onMouseEnter={e => (e.currentTarget.style.color = T)}
            onMouseLeave={e => (e.currentTarget.style.color = MUT)}>Work</Link>
          <span style={{ color: MUT }}>/</span>
          <span className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: ACC }}>{item.category}</span>
        </div>

        <div className="relative z-10 py-6 sm:py-8">
          <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: FS_HERO, color: T }}>
            {item.title.split(' ').map(w => (
              <div key={w} className="overflow-hidden">
                <span className="hero-word block">{w}</span>
              </div>
            ))}
          </h1>
        </div>

        <div className="hero-meta relative z-10 flex flex-wrap gap-4 sm:gap-10">
          {[{ label:'Category', value:item.category }, { label:'Year', value:item.year }].map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono uppercase mb-1" style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: MUT }}>{label}</p>
              <p className="font-display font-bold text-sm px-3 py-0.5 rounded-full"
                style={{ letterSpacing: '0.04em', color: ACC, border: `1px solid ${BDG}`, background:'rgba(129,140,248,0.07)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Full-width screenshot */}
      <div className="relative" style={{ zIndex: 1, borderTop: `1px solid ${BDR}` }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: '21/8', width: '100%' }}>
          {item.image ? (
            <>
              <img src={item.image} alt={item.title}
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', display:'block' }} />
              <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(3,3,8,0.65), transparent)' }} />
            </>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
          )}
        </div>
      </div>

      {/* Intro */}
      <section className="relative" style={{ zIndex: 1,
        backgroundColor: 'rgba(7,7,26,0.80)', backdropFilter: 'blur(4px)',
        padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div className="container grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 sm:gap-14 lg:gap-20">
          <div className="reveal">
            <p className="font-mono uppercase mb-3" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}>Overview</p>
            <p className="font-sans leading-7" style={{ fontSize: FS_BODY, color: T2 }}>{item.summary}</p>
          </div>
          <blockquote className="reveal font-display font-bold leading-[0.95] tracking-[-0.02em] break-words"
            style={{ fontSize: 'clamp(1.25rem,3vw,3rem)', color: T }}>
            {details.intro}
          </blockquote>
        </div>
      </section>

      {/* Case study grid */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, paddingBottom: SP, borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ borderTop: `1px solid ${BDR}` }}>
            {SECTIONS.map(({ key, label }, idx) => (
              <div key={key} className="reveal-item py-7 sm:py-10 pr-0 sm:pr-10"
                style={{ borderBottom:`1px solid ${BDR}`, borderRight: idx%2===0 ? `1px solid ${BDR}` : 'none' }}>
                <p className="font-mono uppercase mb-4" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: ACC }}>{label}</p>
                <p className="font-sans leading-8 font-light" style={{ fontSize: FS_BODY, color: T2 }}>{details[key]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: SURF, padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono uppercase mb-8" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}>Deliverables</p>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label:'Strategy & Direction', desc:'Brand architecture, user research, information hierarchy, and creative direction aligned to business goals.' },
              { label:'Motion & Interaction', desc:'Scroll animations, micro-interactions, page transitions, and gesture-driven components for fluid UX.' },
              { label:'Interface & Systems', desc:'Production-ready front-end, responsive layouts, design tokens, and accessible component library.' },
            ].map(({ label, desc }) => (
              <div key={label} className="reveal-item glass-card p-5 sm:p-7">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-5"
                  style={{ border: `1px solid ${BDG}`, background: 'rgba(129,140,248,0.08)' }}>
                  <span style={{ color: ACC, fontSize: '0.75rem' }}>⬡</span>
                </div>
                <h3 className="font-display font-bold text-sm sm:text-base tracking-[-0.01em] mb-2.5" style={{ color: T }}>{label}</h3>
                <p className="font-sans leading-6" style={{ fontSize: FS_BODY, color: T2 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono uppercase mb-8" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}>Visual Gallery</p>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[0,1,2].map(i => (
              <div key={i} className={`reveal-item overflow-hidden rounded-xl ${i===0?'sm:col-span-2':''}`}
                style={{ border: `1px solid ${BDR}` }}>
                {item.image ? (
                  <img src={item.image} alt={`${item.title} view ${i+1}`}
                    className={i===0?'aspect-[16/9]':'aspect-[4/5]'}
                    style={{ width:'100%', objectFit:'cover', objectPosition:'top', display:'block' }} />
                ) : (
                  <div className={`bg-gradient-to-br ${item.gradient} ${i===0?'aspect-[16/9]':'aspect-[4/5]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next project */}
      <section className="relative overflow-hidden" style={{ zIndex: 1, backgroundColor: SURF, padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div aria-hidden className="pointer-events-none absolute -bottom-10 -left-10 rounded-full glow-orb"
          style={{ width:'min(260px,55vw)', height:'min(260px,55vw)',
            background:'radial-gradient(circle, rgba(129,140,248,0.09), transparent 65%)' }} />
        <div className="container relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div>
            <p className="font-mono uppercase mb-3" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}>
              {nextItem ? 'Next project' : 'Back to portfolio'}
            </p>
            <h2 className="font-display font-bold leading-[0.9] tracking-[-0.02em] uppercase break-words"
              style={{ fontSize: 'clamp(1.8rem,4.5vw,5rem)', color: T }}>
              {nextItem ? nextItem.title : 'View All Work'}
            </h2>
          </div>
          <Link href={nextItem ? `/work/${nextItem.slug}` : '/work'}
            className="flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all flex-shrink-0"
            style={{ fontSize: '0.72rem', background:'linear-gradient(135deg,#6366f1,#38bdf8)',
              color:'#fff', boxShadow:'0 0 28px rgba(99,102,241,0.30)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 46px rgba(99,102,241,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(99,102,241,0.30)')}>
            {nextItem ? 'Next Project' : 'All Projects'} <span className="text-base leading-none">↗</span>
          </Link>
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
  const slug    = params?.slug as string;
  const item    = workItems.find(e => e.slug === slug);
  const details = caseStudyContent[slug] ?? null;
  if (!item || !details) return { notFound: true };
  const idx  = workItems.findIndex(e => e.slug === slug);
  const next = workItems[(idx + 1) % workItems.length];
  const nextItem = next && next.slug !== slug
    ? { slug: next.slug, title: next.title, gradient: next.gradient }
    : null;
  return { props: { item, details, nextItem } };
};
