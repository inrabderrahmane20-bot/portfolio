import { useState, useEffect, useRef } from 'react';
import { contactData } from '@/lib/content';
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

const inputBase: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: `1px solid rgba(255,255,255,0.15)`,
  color: TEXT,
  width: '100%',
  paddingBottom: '0.75rem',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.25s ease',
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
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
    <div className="overflow-x-hidden relative" style={{ backgroundColor: BG }}>
      <AuroraBackground />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex flex-col justify-between px-5 sm:px-[5vw] pt-28 pb-12 overflow-hidden"
        style={{ zIndex: 1, color: TEXT }}
      >
        <div aria-hidden className="pointer-events-none absolute top-0 left-0"
          style={{ width: 'clamp(200px,40vw,500px)', height: 'clamp(200px,40vw,500px)',
            background: 'radial-gradient(circle at 30% 30%, rgba(129,140,248,0.10), transparent 65%)' }} />

        <div className="hero-meta relative z-10 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em]" style={{ color: ACCENT }}>Contact</span>
          <span className="block w-6 h-px" style={{ backgroundColor: BDRGLOW }} />
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em]" style={{ color: MUTED }}>{contactData.availability}</span>
        </div>

        <div className="relative z-10 py-8 sm:py-10">
          <h1
            className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3rem,10vw,12rem)', color: TEXT }}
          >
            {["Let's", 'Work', 'Together'].map((line) => (
              <div key={line} className="overflow-hidden">
                <span className="hero-word block">{line}</span>
              </div>
            ))}
          </h1>
        </div>

        <p className="hero-meta relative z-10 font-sans text-sm leading-7 font-light max-w-lg" style={{ color: TEXT2 }}>
          Share a brief, ask a question, or start a conversation about your next digital project.
        </p>
      </section>

      {/* FORM + INFO */}
      <section className="relative" style={{ zIndex: 1, backgroundColor: 'rgba(7,7,26,0.75)', backdropFilter: 'blur(4px)', padding: '5rem 0 6rem', borderTop: `1px solid ${BDR}` }}>
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Contact Info ── */}
          <div>
            <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-8 sm:mb-10" style={{ color: MUTED }}>Direct contact</p>

            <div className="reveal" style={{ borderTop: `1px solid ${BDR}` }}>
              {([
                { label: 'Email',        value: contactData.email,              href: `mailto:${contactData.email}` },
                { label: 'Phone',        value: contactData.phones.join(' · '), href: null },
                { label: 'Location',     value: contactData.location,           href: null },
                { label: 'Availability', value: contactData.availability,       href: null },
              ] as { label: string; value: string; href: string | null }[]).map(({ label, value, href }) => (
                <div key={label}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 py-4 sm:py-5"
                  style={{ borderBottom: `1px solid ${BDR}` }}>
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.20em] flex-shrink-0" style={{ color: MUTED }}>{label}</span>
                  {href ? (
                    <a href={href}
                      className="font-sans text-sm text-left sm:text-right transition-colors break-all sm:break-normal"
                      style={{ color: TEXT2 }}
                      onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                      onMouseLeave={e => (e.currentTarget.style.color = TEXT2)}
                    >{value}</a>
                  ) : (
                    <span className="font-sans text-sm sm:text-right" style={{ color: TEXT2 }}>{value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Availability card */}
            <div className="reveal mt-8 relative overflow-hidden p-6 sm:p-8 glass-card">
              <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 rounded-full"
                style={{ width: 120, height: 120, background: 'radial-gradient(circle, rgba(129,140,248,0.15), transparent 70%)' }} />
              <div className="flex items-center gap-3 mb-3">
                <span className="status-dot block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
                <p className="font-display font-bold text-lg sm:text-xl" style={{ color: TEXT }}>Open to work</p>
              </div>
              <p className="font-sans text-sm leading-6" style={{ color: TEXT2 }}>
                Accepting new projects for Q3 2026.<br />Typical response within 24 hours.
              </p>
            </div>
          </div>

          {/* ── Form ── */}
          <div>
            <p className="reveal font-mono text-[0.58rem] uppercase tracking-[0.30em] mb-8 sm:mb-10" style={{ color: MUTED }}>Send a message</p>

            {submitted ? (
              <div className="flex flex-col items-start justify-center h-64 gap-5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #38bdf8)' }}>
                  <span className="text-white text-lg font-bold">✓</span>
                </div>
                <p className="font-display font-black text-2xl sm:text-3xl tracking-[-0.01em]" style={{ color: TEXT }}>Message received.</p>
                <p className="font-sans text-sm" style={{ color: TEXT2 }}>I&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="reveal space-y-7 sm:space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { name: 'name',  label: 'Name',  type: 'text',  placeholder: 'Your name' },
                    { name: 'email', label: 'Email', type: 'email', placeholder: 'hello@example.com' },
                  ].map((f) => (
                    <label key={f.name} className="block">
                      <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] block mb-3" style={{ color: MUTED }}>
                        {f.label}
                      </span>
                      <input
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        style={{ ...inputBase, colorScheme: 'dark' }}
                        onFocus={e => (e.target.style.borderBottomColor = ACCENT)}
                        onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')}
                      />
                    </label>
                  ))}
                </div>

                <label className="block">
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] block mb-3" style={{ color: MUTED }}>Budget</span>
                  <select
                    style={{ ...inputBase, cursor: 'pointer', colorScheme: 'dark' }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)')}
                  >
                    <option value="" style={{ backgroundColor: '#07071a', color: TEXT2 }}>Select a range</option>
                    {['Under $5k', '$5k – $15k', '$15k – $30k', '$30k+'].map(o => (
                      <option key={o} style={{ backgroundColor: '#07071a', color: TEXT }}>{o}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] block mb-3" style={{ color: MUTED }}>Project Brief</span>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the project, goals, audience, and timeline."
                    style={{ ...inputBase, resize: 'none', colorScheme: 'dark' }}
                    onFocus={e => (e.target.style.borderBottomColor = ACCENT)}
                    onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')}
                  />
                </label>

                <button
                  type="submit"
                  className="flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all"
                  style={{
                    fontSize: 'clamp(0.68rem,1.5vw,0.75rem)',
                    background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                    color: '#fff',
                    boxShadow: '0 0 32px rgba(99,102,241,0.35)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(99,102,241,0.60)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.35)')}
                >
                  Send Message <span className="text-base leading-none">↗</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
