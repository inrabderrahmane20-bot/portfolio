import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  aboutProfile, awards, philosophy,
  experienceItems, educationItems, skillsList, languageSkills, contactData,
} from '@/lib/content';
import AuroraBackground from '@/components/AuroraBackground';

/* ── Design tokens ───────────────────────────────────────────────────── */
const BG      = '#030308';
const SURF    = '#07071a';
const TEXT    = '#ffffff';
const TEXT2   = 'rgba(255,255,255,0.62)';
const MUTED   = 'rgba(255,255,255,0.32)';
const BDR     = 'rgba(255,255,255,0.07)';
const BDRGLOW = 'rgba(129,140,248,0.38)';
const ACCENT  = '#818cf8';
const ACCENT2 = '#38bdf8';

export default function About() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from('.hero-word', { y: '115%', duration: 1.1, stagger: 0.08, ease: 'power4.out', delay: 0.15 });
        gsap.from('.hero-meta', { opacity: 0, y: 16, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.5 });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  return (
    <div className="overflow-x-hidden relative" style={{ backgroundColor: BG, color: TEXT }}>

      {/* Fixed aurora — ambient animated background for the whole about page */}
      <AuroraBackground />

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] sm:min-h-[65vh] flex flex-col justify-between px-5 sm:px-[5vw] pt-28 pb-12 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Ambient glow spots */}
        <div aria-hidden className="pointer-events-none absolute top-0 right-0"
          style={{ width: 'clamp(200px,40vw,500px)', height: 'clamp(200px,40vw,500px)',
            background: 'radial-gradient(circle at 60% 30%, rgba(129,140,248,0.12), transparent 65%)' }} />

        <div className="hero-meta relative z-10 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em]" style={{ color: ACCENT }}>About</span>
          <span className="block w-6 h-px" style={{ backgroundColor: BDRGLOW }} />
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em]" style={{ color: MUTED }}>{contactData.location}</span>
        </div>

        <div className="relative z-10 py-8 sm:py-10">
          <h1
            className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3rem,10vw,12rem)', color: TEXT }}
          >
            {['Developer', 'Designer', 'Engineer'].map((line) => (
              <div key={line} className="overflow-hidden">
                <span className="hero-word block">{line}</span>
              </div>
            ))}
          </h1>
        </div>

        <p className="hero-meta relative z-10 font-sans text-sm leading-7 font-light max-w-lg" style={{ color: TEXT2 }}>
          {aboutProfile.headline}
        </p>
      </section>

      {/* ─────────────────────────── BIO ──────────────────────────── */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: 'rgba(7,7,26,0.80)', backdropFilter: 'blur(4px)', padding: '5rem 0', borderTop: `1px solid ${BDR}` }}>
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-8" style={{ color: ACCENT }}>Profile</p>
            {aboutProfile.bio.map((para, i) => (
              <p key={i} className="reveal font-sans text-base leading-8 mb-6 font-light" style={{ color: TEXT2 }}>{para}</p>
            ))}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Quick Facts */}
            <div className="reveal glass-card" style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] mb-5" style={{ color: MUTED }}>Quick Facts</p>
              {[
                { label: 'Location',     value: contactData.location },
                { label: 'Email',        value: contactData.email },
                { label: 'GitHub',       value: contactData.socials[0] },
                { label: 'Availability', value: contactData.availability },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 py-3.5"
                  style={{ borderBottom: `1px solid ${BDR}` }}>
                  <span className="font-mono text-[0.60rem] uppercase tracking-[0.18em]" style={{ color: MUTED }}>{label}</span>
                  <span className="font-sans text-sm break-all sm:break-normal sm:text-right" style={{ color: TEXT2 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="reveal glass-card" style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] mb-5" style={{ color: MUTED }}>Languages</p>
              {languageSkills.map((lang) => (
                <div key={lang.label} className="flex justify-between items-center py-3.5"
                  style={{ borderBottom: `1px solid ${BDR}` }}>
                  <span className="font-display font-bold text-sm" style={{ color: TEXT }}>{lang.label}</span>
                  <span className="font-mono text-[0.60rem] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
                    style={{ color: ACCENT, border: `1px solid ${BDRGLOW}`, background: 'rgba(129,140,248,0.07)' }}>
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── PHILOSOPHY ──────────────────────── */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, padding: '5rem 0', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-8" style={{ color: ACCENT }}>Philosophy</p>
          <blockquote
            className="reveal font-display font-bold leading-[0.92] tracking-[-0.02em] mb-12 sm:mb-16 max-w-5xl"
            style={{ fontSize: 'clamp(1.6rem,4.5vw,4.5rem)', color: TEXT }}
          >
            &ldquo;{philosophy.heading}&rdquo;
          </blockquote>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ borderTop: `1px solid ${BDR}` }}>
            {philosophy.points.map((point, i) => (
              <div key={i} className="reveal-item py-7 sm:py-8 pr-0 sm:pr-8"
                style={{ borderBottom: `1px solid ${BDR}`, borderRight: i % 2 === 0 ? `1px solid ${BDR}` : 'none' }}>
                <span className="font-mono text-[0.58rem] block mb-4 tracking-[0.15em] uppercase" style={{ color: ACCENT }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-sans text-sm leading-7 font-light" style={{ color: TEXT2 }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────── AWARDS ─────────────────────────── */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: SURF, padding: '4rem 0 5rem', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-10" style={{ color: MUTED }}>
            Recognition &amp; Awards
          </p>
          <div className="reveal-group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {awards.map((award) => (
              <div key={award.body} className="reveal-item p-5 sm:p-6 text-center award-card glass-card">
                <div className="font-display font-black leading-none tracking-[-0.02em] mb-3 text-gradient"
                  style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                  {award.count}
                </div>
                <p className="font-sans text-xs leading-5" style={{ color: TEXT2 }}>{award.body}</p>
                <p className="font-mono text-[0.55rem] tracking-[0.12em] mt-2 uppercase" style={{ color: MUTED }}>{award.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── EXPERIENCE ────────────────────────── */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: BG, padding: '5rem 0', borderTop: `1px solid ${BDR}` }}>
        <div className="container">
          <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-12" style={{ color: ACCENT }}>Experience</p>
          <div className="reveal-group" style={{ borderTop: `1px solid ${BDR}` }}>
            {experienceItems.map((item) => (
              <div key={item.title} className="reveal-item grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-4 sm:gap-8 py-8 sm:py-10"
                style={{ borderBottom: `1px solid ${BDR}` }}>
                <div>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.20em] mb-3" style={{ color: MUTED }}>{item.subtitle}</p>
                  <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.05]"
                    style={{ fontSize: 'clamp(1rem,2vw,1.5rem)', color: TEXT }}>
                    {item.title}
                  </h3>
                </div>
                <p className="font-sans text-sm leading-7 font-light" style={{ color: TEXT2 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── SKILLS + EDUCATION ────────────────────── */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: SURF, padding: '4rem 0 5rem', borderTop: `1px solid ${BDR}` }}>
        <div className="container grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12">
          <div>
            <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-7" style={{ color: MUTED }}>Skills</p>
            <div className="reveal-group" style={{ borderTop: `1px solid ${BDR}` }}>
              {skillsList.map((skill) => (
                <div key={skill} className="reveal-item flex items-center gap-3 py-3.5"
                  style={{ borderBottom: `1px solid ${BDR}` }}>
                  <span className="block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
                  <span className="font-sans text-sm" style={{ color: TEXT2 }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-7" style={{ color: MUTED }}>Education</p>
            <div className="reveal-group" style={{ borderTop: `1px solid ${BDR}` }}>
              {educationItems.map((item) => (
                <div key={item.title} className="reveal-item py-5 sm:py-6" style={{ borderBottom: `1px solid ${BDR}` }}>
                  <h3 className="font-display font-bold text-sm sm:text-base leading-[1.2] mb-2" style={{ color: TEXT }}>{item.title}</h3>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em]" style={{ color: MUTED }}>{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── CTA ────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ zIndex: 1, backgroundColor: BG, padding: '5rem 0 6rem', borderTop: `1px solid ${BDR}` }}>
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 rounded-full glow-orb"
          style={{ width: 320, height: 320, background: 'radial-gradient(circle, rgba(129,140,248,0.10) 0%, transparent 65%)' }} />
        <div className="container relative z-10">
          <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-6 sm:mb-8" style={{ color: ACCENT }}>
            Let&apos;s work together
          </p>
          <h2
            className="reveal font-display font-black leading-[0.88] tracking-[-0.03em] uppercase mb-8 sm:mb-12 max-w-3xl"
            style={{ fontSize: 'clamp(2.2rem,6vw,7rem)', color: TEXT }}
          >
            Ready to build<br /><span className="text-gradient">something great?</span>
          </h2>
          <Link
            href="/contact"
            className="reveal flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all"
            style={{
              fontSize: 'clamp(0.68rem,1.5vw,0.75rem)',
              background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
              color: '#fff',
              boxShadow: '0 0 32px rgba(99,102,241,0.35)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(99,102,241,0.60)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.35)')}
          >
            Get in Touch <span className="text-base leading-none">↗</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
