import { useState, useEffect, useRef } from 'react';
import { contactData } from '@/lib/content';
import { useLanguage } from '@/contexts/LanguageContext';
import AuroraBackground from '@/components/AuroraBackground';

const BG   = '#030308'; const SURF = '#07071a';
const T    = '#ffffff'; const T2   = 'rgba(255,255,255,0.62)';
const MUT  = 'rgba(255,255,255,0.32)';
const BDR  = 'rgba(255,255,255,0.07)';
const BDG  = 'rgba(129,140,248,0.38)'; const ACC = '#818cf8';
const FS_LABEL = '0.625rem'; const FS_BODY = '0.875rem';
const SP = 'clamp(2.5rem,5vw,6rem)';

const inputBase: React.CSSProperties = {
  background: 'transparent', border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.15)',
  color: T, width: '100%', paddingBottom: '0.75rem',
  fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.25s ease', minHeight: 44, colorScheme: 'dark',
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const { t } = useLanguage();
  const headLines = t('con.heads').split('|').filter(Boolean);

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

      <section ref={heroRef}
        className="relative flex flex-col justify-between px-5 sm:px-[5vw] pt-24 sm:pt-28 pb-10 sm:pb-14 overflow-hidden"
        style={{ zIndex: 1, minHeight: '50vh', color: T }}>
        <div aria-hidden className="pointer-events-none absolute top-0 left-0"
          style={{ width: 'min(45vw,380px)', height: 'min(45vw,380px)',
            background: 'radial-gradient(circle at 30% 30%, rgba(129,140,248,0.10), transparent 65%)' }} />

        <div className="hero-meta relative z-10 flex items-center gap-3 flex-wrap">
          <span className="font-mono uppercase" style={{ fontSize: FS_LABEL, letterSpacing: '0.32em', color: ACC }}>
            {t('con.label')}
          </span>
          <span className="block w-5 h-px" style={{ backgroundColor: BDG }} />
          <span className="font-mono" style={{ fontSize: FS_LABEL, letterSpacing: '0.32em', color: MUT }}>
            {contactData.availability}
          </span>
        </div>

        <div className="relative z-10 py-6 sm:py-10">
          <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(1.4rem,7vw,11rem)', color: T }}>
            {headLines.map(w => (
              <div key={w} className="overflow-hidden">
                <span className="hero-word block">{w}</span>
              </div>
            ))}
          </h1>
        </div>

        <p className="hero-meta relative z-10 font-sans leading-7 font-light max-w-lg"
          style={{ fontSize: FS_BODY, color: T2 }}>{t('con.tag')}</p>
      </section>

      <section className="relative"
        style={{ zIndex: 1, backgroundColor: 'rgba(7,7,26,0.78)',
          padding: `${SP} 0`, borderTop: `1px solid ${BDR}` }}>
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20">
          <div>
            <p className="reveal font-mono uppercase mb-7 sm:mb-9"
              style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}>{t('con.direct')}</p>
            <div className="reveal" style={{ borderTop: `1px solid ${BDR}` }}>
              {([
                { lk: 'con.email', val: contactData.email,              href: `mailto:${contactData.email}` },
                { lk: 'con.phone', val: contactData.phones.join(' · '), href: null },
                { lk: 'con.loc',   val: contactData.location,           href: null },
                { lk: 'con.avail', val: contactData.availability,       href: null },
              ] as { lk: string; val: string; href: string | null }[]).map(({ lk, val, href }) => (
                <div key={lk} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 py-4"
                  style={{ borderBottom: `1px solid ${BDR}` }}>
                  <span className="font-mono uppercase flex-shrink-0"
                    style={{ fontSize: FS_LABEL, letterSpacing: '0.20em', color: MUT }}>{t(lk)}</span>
                  {href
                    ? <a href={href} className="font-sans text-sm transition-colors break-all sm:break-normal sm:text-right"
                        style={{ color: T2 }}
                        onMouseEnter={e => (e.currentTarget.style.color = ACC)}
                        onMouseLeave={e => (e.currentTarget.style.color = T2)}>{val}</a>
                    : <span className="font-sans text-sm sm:text-right" style={{ color: T2 }}>{val}</span>}
                </div>
              ))}
            </div>
            <div className="reveal mt-7 relative overflow-hidden p-5 sm:p-7 glass-card">
              <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 rounded-full"
                style={{ width: 120, height: 120,
                  background: 'radial-gradient(circle, rgba(129,140,248,0.15), transparent 70%)' }} />
              <div className="flex items-center gap-3 mb-2.5">
                <span className="status-dot block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ACC }} />
                <p className="font-display font-bold text-lg sm:text-xl" style={{ color: T }}>{t('con.open')}</p>
              </div>
              <p className="font-sans leading-6" style={{ fontSize: FS_BODY, color: T2 }}>
                {t('con.open.d').split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>
          </div>

          <div>
            <p className="reveal font-mono uppercase mb-7 sm:mb-9"
              style={{ fontSize: FS_LABEL, letterSpacing: '0.30em', color: MUT }}>{t('con.form')}</p>
            {submitted ? (
              <div className="flex flex-col items-start gap-5" style={{ minHeight: 200 }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#38bdf8)' }}>
                  <span className="text-white text-lg font-bold">&#10003;</span>
                </div>
                <p className="font-display font-black text-2xl tracking-[-0.01em]" style={{ color: T }}>{t('con.ok.h')}</p>
                <p className="font-sans" style={{ fontSize: FS_BODY, color: T2 }}>{t('con.ok.b')}</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
                className="reveal space-y-6 sm:space-y-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { lk: 'con.name', type: 'text',  ph: 'Your name' },
                    { lk: 'con.email', type: 'email', ph: 'hello@example.com' },
                  ].map(f => (
                    <label key={f.lk} className="block">
                      <span className="font-mono uppercase block mb-3"
                        style={{ fontSize: FS_LABEL, letterSpacing: '0.22em', color: MUT }}>{t(f.lk)}</span>
                      <input type={f.type} required placeholder={f.ph} style={inputBase}
                        onFocus={e => (e.target.style.borderBottomColor = ACC)}
                        onBlur={e  => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
                    </label>
                  ))}
                </div>
                <label className="block">
                  <span className="font-mono uppercase block mb-3"
                    style={{ fontSize: FS_LABEL, letterSpacing: '0.22em', color: MUT }}>{t('con.budget')}</span>
                  <select style={{ ...inputBase, cursor: 'pointer' }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = ACC)}
                    onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)')}>
                    <option value="" style={{ backgroundColor: SURF }}>{t('con.b.ph')}</option>
                    {(['b1','b2','b3','b4'] as const).map(k => (
                      <option key={k} style={{ backgroundColor: SURF }}>{t(`con.${k}`)}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="font-mono uppercase block mb-3"
                    style={{ fontSize: FS_LABEL, letterSpacing: '0.22em', color: MUT }}>{t('con.brief')}</span>
                  <textarea required rows={4} placeholder={t('con.brief.ph')}
                    style={{ ...inputBase, resize: 'none' }}
                    onFocus={e => (e.target.style.borderBottomColor = ACC)}
                    onBlur={e  => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
                </label>
                <button type="submit"
                  className="flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all"
                  style={{ fontSize: '0.72rem',
                    background: 'linear-gradient(135deg,#6366f1,#38bdf8)', color: '#fff',
                    boxShadow: '0 0 28px rgba(99,102,241,0.35)', minHeight: 52 }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 46px rgba(99,102,241,0.60)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(99,102,241,0.35)')}>
                  {t('con.submit')} <span className="text-base leading-none">&#8599;</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
