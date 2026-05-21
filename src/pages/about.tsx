import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  aboutProfile, awards, philosophy,
  experienceItems, educationItems, skillsList, languageSkills, contactData,
} from '@/lib/content';

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
    <div className="overflow-x-hidden" style={{ backgroundColor: '#F3EFE7' }}>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[62vh] flex flex-col justify-between px-[5vw] pt-28 pb-16 overflow-hidden"
        style={{ backgroundColor: '#F3EFE7', color: '#1E1E1E' }}
      >
        <div aria-hidden className="pointer-events-none absolute top-0 right-0 rounded-full opacity-15"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle at 40% 40%, rgba(18,18,18,0.35), transparent 65%)' }} />
        <div className="hero-meta relative z-10 flex items-center gap-2.5">
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.32em]" style={{ color: '#8A8178' }}>About</span>
          <span className="block w-8 h-px" style={{ backgroundColor: '#CBB8A0' }} />
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.32em]" style={{ color: '#8A8178' }}>{contactData.location}</span>
        </div>
        <div className="relative z-10 py-10">
          <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3.5rem,10vw,12rem)', color: '#1E1E1E' }}>
            {['Developer', 'Designer', 'Engineer'].map((line) => (
              <div key={line} className="overflow-hidden">
                <span className="hero-word block">{line}</span>
              </div>
            ))}
          </h1>
        </div>
        <p className="hero-meta relative z-10 font-sans text-sm leading-7 font-light max-w-lg" style={{ color: '#8A8178' }}>
          {aboutProfile.headline}
        </p>
      </section>

      {/* BIO */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '6rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-8" style={{ color: '#8A8178' }}>Profile</p>
            {aboutProfile.bio.map((para, i) => (
              <p key={i} className="reveal font-sans text-base leading-8 mb-6 font-light" style={{ color: '#6E5846' }}>{para}</p>
            ))}
          </div>
          <div className="space-y-6">
            <div className="reveal" style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBB8A0', padding: '2rem' }}>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] mb-6" style={{ color: '#8A8178' }}>Quick Facts</p>
              {[
                { label: 'Location',     value: contactData.location },
                { label: 'Email',        value: contactData.email },
                { label: 'GitHub',       value: contactData.socials[0] },
                { label: 'Availability', value: contactData.availability },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4 py-4" style={{ borderBottom: '1px solid #CBB8A0' }}>
                  <span className="font-sans text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: '#8A8178' }}>{label}</span>
                  <span className="font-sans text-sm text-right" style={{ color: '#6E5846' }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="reveal" style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBB8A0', padding: '2rem' }}>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] mb-6" style={{ color: '#8A8178' }}>Languages</p>
              {languageSkills.map((lang) => (
                <div key={lang.label} className="flex justify-between py-4" style={{ borderBottom: '1px solid #CBB8A0' }}>
                  <span className="font-display font-bold text-sm" style={{ color: '#FFFFFF' }}>{lang.label}</span>
                  <span className="font-sans text-[0.7rem] uppercase tracking-[0.15em]" style={{ color: '#8A8178' }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section style={{ backgroundColor: '#F3EFE7', padding: '6rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-10" style={{ color: '#8A8178' }}>Philosophy</p>
          <blockquote
            className="reveal font-display font-bold leading-[0.92] tracking-[-0.02em] mb-16 max-w-5xl"
            style={{ fontSize: 'clamp(2rem,4.5vw,4.5rem)', color: '#1E1E1E' }}
          >
            &ldquo;{philosophy.heading}&rdquo;
          </blockquote>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2" style={{ borderTop: '1px solid #CBB8A0' }}>
            {philosophy.points.map((point, i) => (
              <div key={i} className="reveal-item py-8 pr-8" style={{ borderBottom: '1px solid #CBB8A0', borderRight: '1px solid #CBB8A0' }}>
                <span className="font-sans text-[0.62rem] block mb-4 tracking-[0.15em] uppercase" style={{ color: '#8A8178' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-sans text-sm leading-7 font-light" style={{ color: '#6E5846' }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '5rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-12" style={{ color: '#8A8178' }}>
            Recognition &amp; Awards
          </p>
          <div className="reveal-group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {awards.map((award) => (
              <div key={award.body} className="reveal-item p-6 text-center award-card" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="font-display font-black leading-none tracking-[-0.02em] mb-3"
                  style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: '#1E1E1E' }}>
                  {award.count}
                </div>
                <p className="font-sans text-xs leading-5" style={{ color: '#6E5846' }}>{award.body}</p>
                <p className="font-sans text-[0.58rem] tracking-[0.12em] mt-2 uppercase" style={{ color: '#8A8178' }}>{award.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section style={{ backgroundColor: '#F3EFE7', padding: '6rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-14" style={{ color: '#8A8178' }}>Experience</p>
          <div className="reveal-group" style={{ borderTop: '1px solid #CBB8A0' }}>
            {experienceItems.map((item) => (
              <div key={item.title} className="reveal-item grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-6 py-10"
                style={{ borderBottom: '1px solid #CBB8A0' }}>
                <div>
                  <p className="font-sans text-[0.62rem] uppercase tracking-[0.2em] mb-3" style={{ color: '#8A8178' }}>{item.subtitle}</p>
                  <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.05]"
                    style={{ fontSize: 'clamp(1.1rem,2vw,1.5rem)', color: '#1E1E1E' }}>
                    {item.title}
                  </h3>
                </div>
                <p className="font-sans text-sm leading-7 font-light" style={{ color: '#6E5846' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS + EDUCATION */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '5rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div>
            <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-8" style={{ color: '#8A8178' }}>Skills</p>
            <div className="reveal-group" style={{ borderTop: '1px solid #CBB8A0' }}>
              {skillsList.map((skill) => (
                <div key={skill} className="reveal-item flex items-center gap-4 py-4" style={{ borderBottom: '1px solid #CBB8A0' }}>
                  <span className="block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#8A8178' }} />
                  <span className="font-sans text-sm" style={{ color: '#6E5846' }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-8" style={{ color: '#8A8178' }}>Education</p>
            <div className="reveal-group" style={{ borderTop: '1px solid #CBB8A0' }}>
              {educationItems.map((item) => (
                <div key={item.title} className="reveal-item py-6" style={{ borderBottom: '1px solid #CBB8A0' }}>
                  <h3 className="font-display font-bold text-base leading-[1.2] mb-2" style={{ color: '#1E1E1E' }}>{item.title}</h3>
                  <p className="font-sans text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: '#8A8178' }}>{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#F3EFE7', padding: '6rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container">
          <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-8" style={{ color: '#8A8178' }}>Let&apos;s work together</p>
          <h2 className="reveal font-display font-black leading-[0.88] tracking-[-0.03em] uppercase mb-12 max-w-3xl"
            style={{ fontSize: 'clamp(2.5rem,6vw,7rem)', color: '#1E1E1E' }}>
            Ready to build<br />something great?
          </h2>
          <Link href="/contact"
            className="reveal inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-[0.75rem] uppercase tracking-[0.1em] transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#121212', color: '#F3EFE7' }}>
            Get in Touch <span className="text-base leading-none">↗</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
