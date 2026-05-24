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

const BUDGET_KEYS = ['b1', 'b2', 'b3', 'b4'] as const;
const WA_NUMBER = '212711374861';

function IconEmail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="2,4 12,13 22,4"/>
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [contactMethod, setContactMethod] = useState<'email' | 'whatsapp'>('email');
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetKey, setBudgetKey] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brief, setBrief] = useState('');
  const heroRef = useRef<HTMLElement | null>(null);
  const budgetRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();
  const headLines = t('con.heads').split('|').filter(Boolean);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setBudgetOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = budgetKey ? t(`con.${budgetKey}`) : 'Not specified';
    const msg = `Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\nProject Brief:\n${brief}`;

    if (contactMethod === 'whatsapp') {
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      const subject = encodeURIComponent(`Portfolio Inquiry — ${name}`);
      window.location.href = `mailto:${contactData.email}?subject=${subject}&body=${encodeURIComponent(msg)}`;
    }
    setSubmitted(true);
  };

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
              <form onSubmit={handleSubmit} className="reveal space-y-6 sm:space-y-7">

                {/* Send via toggle */}
                <div>
                  <span className="font-mono uppercase block mb-3"
                    style={{ fontSize: FS_LABEL, letterSpacing: '0.22em', color: MUT }}>
                    Send via
                  </span>
                  <div className="flex gap-2 p-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BDR}`, display: 'inline-flex' }}>
                    {(['email', 'whatsapp'] as const).map(method => {
                      const active = contactMethod === method;
                      return (
                        <button key={method} type="button" onClick={() => setContactMethod(method)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 18px', borderRadius: '9999px', cursor: 'pointer',
                            fontFamily: 'inherit', fontSize: FS_LABEL,
                            fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                            transition: 'all 0.2s ease',
                            background: active ? 'linear-gradient(135deg,#6366f1,#38bdf8)' : 'transparent',
                            color: active ? '#fff' : T2,
                            boxShadow: active ? '0 0 18px rgba(99,102,241,0.35)' : 'none',
                            border: 'none',
                          }}>
                          {method === 'email' ? <IconEmail /> : <IconWhatsApp />}
                          {method === 'email' ? 'Email' : 'WhatsApp'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="font-mono uppercase block mb-3"
                      style={{ fontSize: FS_LABEL, letterSpacing: '0.22em', color: MUT }}>{t('con.name')}</span>
                    <input type="text" required placeholder="Your name" value={name}
                      onChange={e => setName(e.target.value)}
                      style={inputBase}
                      onFocus={e => (e.target.style.borderBottomColor = ACC)}
                      onBlur={e  => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
                  </label>
                  <label className="block">
                    <span className="font-mono uppercase block mb-3"
                      style={{ fontSize: FS_LABEL, letterSpacing: '0.22em', color: MUT }}>{t('con.email')}</span>
                    <input type="email" required placeholder="hello@example.com" value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={inputBase}
                      onFocus={e => (e.target.style.borderBottomColor = ACC)}
                      onBlur={e  => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
                  </label>
                </div>

                {/* Budget custom dropdown */}
                <div>
                  <span className="font-mono uppercase block mb-3"
                    style={{ fontSize: FS_LABEL, letterSpacing: '0.22em', color: MUT }}>{t('con.budget')}</span>
                  <div ref={budgetRef} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setBudgetOpen(v => !v)}
                      style={{
                        ...inputBase,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', paddingBottom: '0.75rem',
                        borderBottomColor: budgetOpen ? ACC : 'rgba(255,255,255,0.15)',
                        color: budgetKey ? T : MUT,
                      }}>
                      <span>{budgetKey ? t(`con.${budgetKey}`) : t('con.b.ph')}</span>
                      <ChevronDown open={budgetOpen} />
                    </button>

                    {budgetOpen && (
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0, zIndex: 50,
                        background: 'rgba(8,8,28,0.95)',
                        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(129,140,248,0.18)',
                        borderRadius: 14,
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(129,140,248,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                      }}>
                        {/* Placeholder row */}
                        <div style={{
                          padding: '12px 16px',
                          fontSize: FS_BODY, color: MUT,
                          fontFamily: 'inherit',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: 'rgba(129,140,248,0.05)',
                          pointerEvents: 'none',
                          userSelect: 'none',
                        }}>
                          {t('con.b.ph')}
                        </div>
                        {BUDGET_KEYS.map((k, i) => {
                          const isSelected = budgetKey === k;
                          const isLast = i === BUDGET_KEYS.length - 1;
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => { setBudgetKey(k); setBudgetOpen(false); }}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                width: '100%', textAlign: 'left',
                                padding: '13px 16px',
                                fontSize: FS_BODY, color: isSelected ? '#c7d2fe' : T2,
                                fontFamily: 'inherit', cursor: 'pointer',
                                background: isSelected ? 'rgba(99,102,241,0.15)' : 'transparent',
                                borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
                                border: 'none',
                                transition: 'background 0.15s ease, color 0.15s ease',
                              }}
                              onMouseEnter={e => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = 'rgba(129,140,248,0.10)';
                                  e.currentTarget.style.color = T;
                                }
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = isSelected ? 'rgba(99,102,241,0.15)' : 'transparent';
                                e.currentTarget.style.color = isSelected ? '#c7d2fe' : T2;
                              }}>
                              <span>{t(`con.${k}`)}</span>
                              {isSelected && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                  stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Brief */}
                <label className="block">
                  <span className="font-mono uppercase block mb-3"
                    style={{ fontSize: FS_LABEL, letterSpacing: '0.22em', color: MUT }}>{t('con.brief')}</span>
                  <textarea required rows={4} placeholder={t('con.brief.ph')} value={brief}
                    onChange={e => setBrief(e.target.value)}
                    style={{ ...inputBase, resize: 'none' }}
                    onFocus={e => (e.target.style.borderBottomColor = ACC)}
                    onBlur={e  => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
                </label>

                {/* Submit */}
                <button type="submit"
                  className="flex sm:inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full font-display font-bold uppercase tracking-[0.1em] transition-all"
                  style={{ fontSize: '0.72rem',
                    background: contactMethod === 'whatsapp'
                      ? 'linear-gradient(135deg,#25d366,#128c7e)'
                      : 'linear-gradient(135deg,#6366f1,#38bdf8)',
                    color: '#fff',
                    boxShadow: contactMethod === 'whatsapp'
                      ? '0 0 28px rgba(37,211,102,0.35)'
                      : '0 0 28px rgba(99,102,241,0.35)',
                    minHeight: 52, transition: 'box-shadow 0.25s ease, background 0.3s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = contactMethod === 'whatsapp'
                    ? '0 0 46px rgba(37,211,102,0.60)'
                    : '0 0 46px rgba(99,102,241,0.60)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = contactMethod === 'whatsapp'
                    ? '0 0 28px rgba(37,211,102,0.35)'
                    : '0 0 28px rgba(99,102,241,0.35)')}>
                  {contactMethod === 'whatsapp' ? <IconWhatsApp /> : <IconEmail />}
                  {contactMethod === 'whatsapp' ? 'Send via WhatsApp' : t('con.submit')}
                  <span className="text-base leading-none">&#8599;</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
