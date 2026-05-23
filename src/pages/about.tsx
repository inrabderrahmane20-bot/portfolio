import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  aboutProfile, awards, philosophy,
  experienceItems, educationItems, skillsList, languageSkills, contactData,
} from '@/lib/content';
import AuroraBackground from '@/components/AuroraBackground';

const BG   = '#030308';
const SURF = '#07071a';
const T    = '#ffffff';
const T2   = 'rgba(255,255,255,0.62)';
const MUT  = 'rgba(255,255,255,0.32)';
const BDR  = 'rgba(255,255,255,0.07)';
const BDG  = 'rgba(129,140,248,0.38)';
const ACC  = '#818cf8';
const ACC2 = '#38bdf8';

const FS_HERO  = 'clamp(2rem, 13vw, 13.5rem)';
const FS_H2    = 'clamp(1.6rem,4vw,4.5rem)';
const FS_LABEL = '0.625rem';
const FS_BODY  = '0.875rem';
const SP       = 'clamp(2.5rem,5vw,6rem)';

export default function About() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from('.hero-word', { y: '110%', duration: 1.1, stagger: 0.08, ease: 'power4.out', delay: 0.15 });
        gsap.from('.hero-meta', { opacity: 0, y: 14, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: 0.5 });
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
        style={{ zIndex: 1, minHeight: '55vh', color: T }}>
        <div aria-hidden className="pointer-events-none absolute top-0 right-0 opacity-40"
          style={{ width: 'min(45vw,400px)', height: 'min(45vw,400px)',
            background: 'radial-gradient(circle at 60% 30%, rgba(129,140,248,0.12), transparent 65%)' }} />

        <div className="hero-meta relative z-10 flex items-center gap-3 flex-wrap">
          <span className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing: '0.32em', color: ACC }}>About</span>
          <span className="block w-5 h-px" style={{ backgroundColor: BDG }} />
          <span className="font-mono" style={{ fontSize: FS_LABEL, letterSpacing: '0.32em', color: MUT }}>{contactData.location}</span>
        </div>

        <div className="relative z-10 py-6 sm:py-10">
          <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: FS_HERO, color: T }}>
            {['Developer','Designer','Engineer'].map(w => (
              <div key={w} className="overflow-hidden">
                <span className="hero-word block">{w}</span>
              </div>
            ))}
          </h1>
        </div>

        <p className="hero-meta relative z-10 font-sans leading-7 font-light max-w-lg"
          style={{ fontSize: FS_BODY, color: T2 }}>
          {aboutProfile.headline}
        </p>
      </section>

      {/* Bio */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: 'rgba(7,7,26,0.80)',
        backdropFilter:'blur(4px)', padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
          <div>
            <p className="reveal font-mono uppercase mb-7" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: ACC }}>Profile</p>
            {aboutProfile.bio.map((para, i) => (
              <p key={i} className="reveal font-sans leading-8 mb-5 font-light" style={{ fontSize: FS_BODY, color: T2 }}>{para}</p>
            ))}
          </div>
          <div className="space-y-4">
            {/* Quick facts */}
            <div className="reveal glass-card" style={{ padding: 'clamp(1.1rem,3vw,2rem)' }}>
              <p className="font-mono uppercase mb-5" style={{ fontSize: FS_LABEL, letterSpacing: '0.28em', color: MUT }}>Quick Facts</p>
              {[
                { label: 'Location',     value: contactData.location },
                { label: 'Email',        value: contactData.email },
                { label: 'GitHub',       value: contactData.socials[0] },
                { label: 'Availability', value: contactData.availability },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 py-3"
                  style={{ borderBottom: `1px solid ${BDR}` }}>
                  <span className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing: '0.18em', color: MUT }}>{label}</span>
                  <span className="font-sans text-sm break-all sm:break-normal sm:text-right" style={{ color: T2 }}>{value}</span>
                </div>
              ))}
            </div>
            {/* Languages */}
            <div className="reveal glass-card" style={{ padding: 'clamp(1.1rem,3vw,2rem)' }}>
              <p className="font-mono uppercase mb-5" style={{ fontSize: FS_LABEL, letterSpacing: '0.28em', color: MUT }}>Languages</p>
              {languageSkills.map(l => (
                <div key={l.label} className="flex justify-between items-center py-3"
                  style={{ borderBottom: `1px solid ${BDR}` }}>
                  <span className="font-display font-bold text-sm" style={{ color: T }}>{l.label}</span>
                  <span className="font-mono uppercase px-2.5 py-0.5 rounded-full"
                    style={{ fontSize: FS_LABEL, letterSpacing: '0.15em',
                      color: ACC, border: `1px solid ${BDG}`, background: 'rgba(129,140,248,0.07)' }}>
                    {l.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono uppercase mb-7" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: ACC }}>Philosophy</p>
          <blockquote className="reveal font-display font-bold leading-[0.92] tracking-[-0.02em] mb-10 sm:mb-14 break-words"
            style={{ fontSize: 'clamp(1.35rem,3.5vw,4rem)', color: T }}>
            &ldquo;{philosophy.heading}&rdquo;
          </blockquote>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ borderTop: `1px solid ${BDR}` }}>
            {philosophy.points.map((pt, i) => (
              <div key={i} className="reveal-item py-6 sm:py-8 sm:pr-8"
                style={{ borderBottom: `1px solid ${BDR}`, borderRight: i % 2 === 0 ? `1px solid ${BDR}` : 'none' }}>
                <span className="font-mono block mb-3 uppercase" style={{ fontSize: FS_LABEL, letterSpacing: '0.15em', color: ACC }}>
                  {String(i + 1).padStart(2,'0')}
                </span>
                <p className="font-sans leading-7 font-light" style={{ fontSize: FS_BODY, color: T2 }}>{pt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: SURF, padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono uppercase mb-8" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}>
            Recognition &amp; Awards
          </p>
          <div className="reveal-group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {awards.map(a => (
              <div key={a.body} className="reveal-item p-4 sm:p-5 text-center award-card glass-card">
                <div className="font-display font-black leading-none tracking-[-0.02em] mb-2 text-gradient"
                  style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)' }}>{a.count}</div>
                <p className="font-sans text-xs leading-5" style={{ color: T2 }}>{a.body}</p>
                <p className="font-mono uppercase mt-1.5" style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: MUT }}>{a.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono uppercase mb-10" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: ACC }}>Experience</p>
          <div className="reveal-group" style={{ borderTop: `1px solid ${BDR}` }}>
            {experienceItems.map(it => (
              <div key={it.title}
                className="reveal-item grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-4 sm:gap-8 py-7 sm:py-10"
                style={{ borderBottom: `1px solid ${BDR}` }}>
                <div>
                  <p className="font-mono uppercase mb-2.5" style={{ fontSize: FS_LABEL, letterSpacing: '0.20em', color: MUT }}>{it.subtitle}</p>
                  <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.05] break-words"
                    style={{ fontSize: 'clamp(0.95rem,2vw,1.5rem)', color: T }}>{it.title}</h3>
                </div>
                <p className="font-sans leading-7 font-light" style={{ fontSize: FS_BODY, color: T2 }}>{it.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills + Education */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: SURF, padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div className="container grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div>
            <p className="reveal font-mono uppercase mb-7" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}>Skills</p>
            <div className="reveal-group" style={{ borderTop: `1px solid ${BDR}` }}>
              {skillsList.map(s => (
                <div key={s} className="reveal-item flex items-center gap-3 py-3.5"
                  style={{ borderBottom: `1px solid ${BDR}` }}>
                  <span className="block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ACC }} />
                  <span className="font-sans" style={{ fontSize: FS_BODY, color: T2 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="reveal font-mono uppercase mb-7" style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}>Education</p>
            <div className="reveal-group" style={{ borderTop: `1px solid ${BDR}` }}>
              {educationItems.map(e => (
                <div key={e.title} className="reveal-item py-5" style={{ borderBottom: `1px solid ${BDR}` }}>
                  <h3 className="font-display font-bold text-sm sm:text-base leading-[1.2] mb-2 break-words" style={{ color: T }}>{e.title}</h3>
                  <p className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing: '0.18em', color: MUT }}>{e.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ zIndex: 1, backgroundColor: BG, padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div aria-hidden className="pointer-events-none absolute -bottom-14 -left-14 rounded-full glow-orb"
          style={{ width:'min(280px,60vw)', height:'min(280px,60vw)',
            background:'radial-gradient(circle, rgba(129,140,248,0.10), transparent 65%)' }} />
        <div className="container relative z-10">
          <p className="reveal font-mono uppercase mb-5 sm:mb-7"
            style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: ACC }}>Let&apos;s work together</p>
          <h2 className="reveal font-display font-black leading-[0.88] tracking-[-0.03em] uppercase mb-8 sm:mb-10 break-words"
            style={{ fontSize: 'clamp(2rem,5.5vw,7rem)', color: T }}>
            Ready to build<br /><span className="text-gradient">something great?</span>
          </h2>
          <Link href="/contact"
            className="reveal flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all"
            style={{ fontSize: '0.72rem', background:'linear-gradient(135deg,#6366f1,#38bdf8)',
              color:'#fff', boxShadow:'0 0 30px rgba(99,102,241,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 48px rgba(99,102,241,0.60)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.35)')}>
            Get in Touch <span className="text-base leading-none">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
