import { useState, useEffect, useRef } from 'react';
import { contactData } from '@/lib/content';

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
    <div className="overflow-x-hidden" style={{ backgroundColor: '#F3EFE7' }}>

      {/* HERO */}
      <section ref={heroRef}
        className="relative min-h-[60vh] flex flex-col justify-between px-[5vw] pt-28 pb-16 overflow-hidden"
        style={{ backgroundColor: '#F3EFE7', color: '#1E1E1E' }}>
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 rounded-full opacity-15"
          style={{ width: 350, height: 350, background: 'radial-gradient(circle at 40% 40%, rgba(18,18,18,0.4), transparent 65%)' }} />
        <div className="hero-meta relative z-10 flex items-center gap-2.5">
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.32em]" style={{ color: '#8A8178' }}>Contact</span>
          <span className="block w-8 h-px" style={{ backgroundColor: '#CBB8A0' }} />
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.32em]" style={{ color: '#8A8178' }}>{contactData.availability}</span>
        </div>
        <div className="relative z-10 py-10">
          <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3.5rem,10vw,12rem)', color: '#1E1E1E' }}>
            {["Let's", 'Work', 'Together'].map((line) => (
              <div key={line} className="overflow-hidden">
                <span className="hero-word block">{line}</span>
              </div>
            ))}
          </h1>
        </div>
        <p className="hero-meta relative z-10 font-sans text-sm leading-7 font-light max-w-lg" style={{ color: '#8A8178' }}>
          Share a brief, ask a question, or start a conversation about your next digital project.
        </p>
      </section>

      {/* FORM + INFO */}
      <section style={{ backgroundColor: '#DDD2C3', padding: '6rem 0', borderTop: '1px solid #CBB8A0' }}>
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">

          {/* Info */}
          <div>
            <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-10" style={{ color: '#8A8178' }}>Direct contact</p>
            <div className="reveal" style={{ borderTop: '1px solid #CBB8A0' }}>
              {([
                { label: 'Email',        value: contactData.email,             href: `mailto:${contactData.email}` },
                { label: 'Phone',        value: contactData.phones.join(' · '), href: null },
                { label: 'Location',     value: contactData.location,          href: null },
                { label: 'Availability', value: contactData.availability,      href: null },
              ] as { label: string; value: string; href: string | null }[]).map(({ label, value, href }) => (
                <div key={label} className="flex justify-between items-baseline gap-6 py-5" style={{ borderBottom: '1px solid #CBB8A0' }}>
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.2em] flex-shrink-0" style={{ color: '#8A8178' }}>{label}</span>
                  {href
                    ? <a href={href} className="font-sans text-sm text-right transition-colors hover:opacity-70" style={{ color: '#6E5846' }}>{value}</a>
                    : <span className="font-sans text-sm text-right" style={{ color: '#6E5846' }}>{value}</span>
                  }
                </div>
              ))}
            </div>

            <div className="reveal mt-10 relative overflow-hidden p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBB8A0' }}>
              <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 rounded-full opacity-10"
                style={{ width: 160, height: 160, background: 'radial-gradient(circle, rgba(18,18,18,0.8), transparent 70%)' }} />
              <p className="font-display font-bold text-xl mb-2" style={{ color: '#1E1E1E' }}>Open to work</p>
              <p className="font-sans text-sm leading-6" style={{ color: '#8A8178' }}>
                Accepting new projects for Q3 2026.<br />Typical response within 24 hours.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <p className="reveal font-sans text-[0.62rem] uppercase tracking-[0.3em] mb-10" style={{ color: '#8A8178' }}>Send a message</p>

            {submitted ? (
              <div className="flex flex-col items-start justify-center h-64 gap-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#121212' }}>
                  <span className="text-white text-base font-bold">✓</span>
                </div>
                <p className="font-display font-black text-2xl tracking-[-0.01em]" style={{ color: '#1E1E1E' }}>Message received.</p>
                <p className="font-sans text-sm" style={{ color: '#8A8178' }}>I&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="reveal space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[{ name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                    { name: 'email', label: 'Email', type: 'email', placeholder: 'hello@example.com' }].map((f) => (
                    <label key={f.name} className="block">
                      <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] block mb-3" style={{ color: '#8A8178' }}>{f.label}</span>
                      <input type={f.type} required placeholder={f.placeholder}
                        className="w-full bg-transparent pb-3 font-sans text-sm focus:outline-none transition-colors"
                        style={{ borderBottom: '1px solid #CBB8A0', color: '#FFFFFF' }}
                        onFocus={e => (e.target.style.borderBottomColor = '#6E5846')}
                        onBlur={e => (e.target.style.borderBottomColor = '#CBB8A0')} />
                    </label>
                  ))}
                </div>

                <label className="block">
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] block mb-3" style={{ color: '#8A8178' }}>Budget</span>
                  <select className="w-full bg-transparent pb-3 font-sans text-sm cursor-pointer appearance-none focus:outline-none"
                    style={{ borderBottom: '1px solid #CBB8A0', color: '#8A8178' }}>
                    <option value="" style={{ backgroundColor: '#FFFFFF' }}>Select a range</option>
                    {['Under $5k', '$5k – $15k', '$15k – $30k', '$30k+'].map(o => (
                      <option key={o} style={{ backgroundColor: '#FFFFFF', color: '#6E5846' }}>{o}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] block mb-3" style={{ color: '#8A8178' }}>Project Brief</span>
                  <textarea required rows={5} placeholder="Describe the project, goals, audience, and timeline."
                    className="w-full bg-transparent pb-3 font-sans text-sm focus:outline-none transition-colors resize-none"
                    style={{ borderBottom: '1px solid #CBB8A0', color: '#FFFFFF' }}
                    onFocus={e => (e.target.style.borderBottomColor = '#6E5846')}
                    onBlur={e => (e.target.style.borderBottomColor = '#CBB8A0')} />
                </label>

                <button type="submit"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-[0.75rem] uppercase tracking-[0.1em] transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#1E1E1E', color: '#FFFFFF' }}>
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
