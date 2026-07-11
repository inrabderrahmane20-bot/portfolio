import { useEffect, useRef, useState } from 'react';
import { contactData, identity } from '@/lib/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { bootDelay } from '@/lib/motion';
import Magnetic from '@/components/Magnetic';
import ScrambleText from '@/components/ScrambleText';
import LocalTime from '@/components/LocalTime';

const BUDGET_KEYS = ['b1', 'b2', 'b3', 'b4'] as const;

function IconEmail() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Contact() {
  const heroRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const [submitted, setSubmitted] = useState(false);
  const [method, setMethod] = useState<'email' | 'whatsapp'>('email');
  const [budgetKey, setBudgetKey] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brief, setBrief] = useState('');

  useEffect(() => {
    let ctx: any;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const d = bootDelay();
        gsap.from('.mask-line > span', { y: '112%', duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: d });
        gsap.from('.hero-meta', { opacity: 0, y: 16, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: d + 0.5 });
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = budgetKey ? t(`con.${budgetKey}`) : '-';
    const msg = `Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\nProject brief:\n${brief}`;
    if (method === 'whatsapp') {
      window.open(`https://wa.me/${contactData.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      const subject = encodeURIComponent(`Portfolio inquiry - ${name}`);
      window.location.href = `mailto:${contactData.email}?subject=${subject}&body=${encodeURIComponent(msg)}`;
    }
    setSubmitted(true);
  };

  const heads = t('con.heads').split('|').filter(Boolean);

  return (
    <div style={{ background: 'transparent', color: 'var(--fg)', overflowX: 'hidden' }}>

      {/* ═══ HERO ════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex flex-col" style={{ minHeight: '58svh', paddingTop: '6rem' }}>
        <div className="container flex-1 flex flex-col">
          <div className="hero-meta flex items-center justify-between flex-wrap gap-3"
            style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.9rem' }}>
            <ScrambleText className="o-label" text={t('con.file')} />
            <span className="o-label hidden sm:inline-flex" style={{ alignItems: 'center', gap: 8 }}>
              <i className="status-dot" style={{ width: 6, height: 6, borderRadius: '50%',
                background: 'var(--verm)', display: 'inline-block' }} />
              {t('con.open')}
            </span>
            <LocalTime className="o-label hidden md:block" suffix=" GMT+1" />
          </div>

          <div className="flex-1 flex flex-col justify-center" style={{ padding: 'clamp(2rem,4vw,3.5rem) 0' }}>
            <h1 className="font-serif" style={{ letterSpacing: '-0.03em', lineHeight: 0.94, fontWeight: 800 }}>
              {heads.map((w, i) => (
                <span key={w} className="mask-line">
                  <span style={{ fontSize: 'var(--fs-hero)' }}>
                    {i === heads.length - 1
                      ? <em className="it" style={{ color: 'var(--verm)' }}>{w}</em>
                      : w}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <p className="hero-meta font-sans pb-10" style={{ fontSize: 'var(--fs-body)', lineHeight: 1.75,
            color: 'var(--fg-2)', maxWidth: '48ch' }}>
            {t('con.tag')}
          </p>
        </div>
      </section>

      {/* ═══ DIRECT + FORM ═══════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-14 lg:gap-24"
          style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>

          {/* Direct channel */}
          <div>
            <p className="reveal o-label" style={{ marginBottom: '2rem' }}>
              <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('con.direct')}
            </p>
            <div className="reveal" style={{ borderTop: '1px solid var(--line)' }}>
              {([
                [t('con.email'), contactData.email, `mailto:${contactData.email}`],
                [t('con.phone'), contactData.phones[0], `https://wa.me/${contactData.whatsapp}`],
                ['GitHub', identity.github, identity.githubUrl],
                [t('con.loc'), contactData.location, null],
              ] as [string, string, string | null][]).map(([k, v, href]) => (
                <div key={k} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1"
                  style={{ padding: '1.1rem 0', borderBottom: '1px solid var(--line)' }}>
                  <span className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.24em',
                    textTransform: 'uppercase', color: 'var(--mut)' }}>{k}</span>
                  {href
                    ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                        className="u-sweep font-sans" data-cursor={t('ui.open')}
                        style={{ fontSize: '0.92rem', wordBreak: 'break-word' }}>{v}</a>
                    : <span className="font-sans" style={{ fontSize: '0.92rem' }}>{v}</span>}
                </div>
              ))}
            </div>

            <div className="reveal" style={{ marginTop: '2.5rem', border: '1px solid var(--line-2)',
              background: 'var(--paper-2)', padding: 'clamp(1.3rem,2.5vw,2rem)' }}>
              <p className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: '0.6rem' }}>
                {t('con.open')}
              </p>
              <p className="font-sans" style={{ fontSize: 'var(--fs-small)', lineHeight: 1.7, color: 'var(--fg-2)' }}>
                {t('con.open.d').split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <p className="reveal o-label" style={{ marginBottom: '2rem' }}>
              <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {t('con.form')}
            </p>

            {submitted ? (
              <div className="reveal is-visible flex flex-col items-start gap-4" style={{ minHeight: 220 }}>
                <span className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.26em',
                  background: 'var(--verm)', color: '#FFFFFF', padding: '0.5rem 0.9rem' }}>
                  {t('con.ok.tag')}
                </span>
                <p className="font-serif" style={{ fontSize: 'clamp(1.8rem,3.4vw,2.8rem)', fontWeight: 400, lineHeight: 1.05 }}>
                  {t('con.ok.h')}
                </p>
                <p className="font-sans" style={{ fontSize: 'var(--fs-small)', color: 'var(--fg-2)' }}>{t('con.ok.b')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="reveal flex flex-col gap-8">

                {/* Channel toggle */}
                <div>
                  <span className="font-mono block" style={{ fontSize: '0.58rem', letterSpacing: '0.24em',
                    textTransform: 'uppercase', color: 'var(--mut)', marginBottom: '0.8rem' }}>
                    {t('con.via')}
                  </span>
                  <div className="inline-flex" style={{ border: '1px solid var(--line-2)' }}>
                    {(['email', 'whatsapp'] as const).map(m => {
                      const active = method === m;
                      return (
                        <button key={m} type="button" onClick={() => setMethod(m)}
                          className="font-mono touch-target"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '0.8rem 1.3rem', fontSize: '0.62rem', letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            background: active ? 'linear-gradient(135deg, #6366F1, #38BDF8)' : 'transparent',
                            color: active ? '#FFFFFF' : 'var(--fg-2)',
                            transition: 'background 0.25s ease, color 0.25s ease',
                          }}>
                          {m === 'email' ? <IconEmail /> : <IconWhatsApp />}
                          {m === 'email' ? 'Email' : 'WhatsApp'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <label className="block">
                    <span className="font-mono block" style={{ fontSize: '0.58rem', letterSpacing: '0.24em',
                      textTransform: 'uppercase', color: 'var(--mut)', marginBottom: '0.4rem' }}>
                      {t('con.name')} *
                    </span>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)}
                      placeholder={t('con.name.ph')} className="field" autoComplete="name" />
                  </label>
                  <label className="block">
                    <span className="font-mono block" style={{ fontSize: '0.58rem', letterSpacing: '0.24em',
                      textTransform: 'uppercase', color: 'var(--mut)', marginBottom: '0.4rem' }}>
                      {t('con.email')} *
                    </span>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="hello@example.com" className="field" autoComplete="email" inputMode="email" />
                  </label>
                </div>

                {/* Budget — segmented */}
                <div>
                  <span className="font-mono block" style={{ fontSize: '0.58rem', letterSpacing: '0.24em',
                    textTransform: 'uppercase', color: 'var(--mut)', marginBottom: '0.8rem' }}>
                    {t('con.budget')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_KEYS.map(k => {
                      const active = budgetKey === k;
                      return (
                        <button key={k} type="button" onClick={() => setBudgetKey(active ? '' : k)}
                          aria-pressed={active}
                          className="font-mono touch-target"
                          style={{
                            padding: '0.7rem 1.1rem', fontSize: '0.62rem', letterSpacing: '0.18em',
                            border: '1px solid var(--line-2)',
                            background: active ? 'var(--verm)' : 'transparent',
                            color: active ? '#FFFFFF' : 'var(--fg-2)',
                            borderColor: active ? 'var(--verm)' : 'var(--line-2)',
                            transition: 'all 0.25s ease',
                          }}>
                          {t(`con.${k}`)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brief */}
                <label className="block">
                  <span className="font-mono block" style={{ fontSize: '0.58rem', letterSpacing: '0.24em',
                    textTransform: 'uppercase', color: 'var(--mut)', marginBottom: '0.4rem' }}>
                    {t('con.brief')} *
                  </span>
                  <textarea required rows={4} value={brief} onChange={e => setBrief(e.target.value)}
                    placeholder={t('con.brief.ph')} className="field" style={{ resize: 'none' }} />
                </label>

                {/* Submit */}
                <Magnetic>
                  <button type="submit" className="btn-slab" data-cursor={t('ui.send')}
                    style={method === 'whatsapp' ? { background: '#128c7e', color: '#F0FFF9' } : undefined}>
                    {method === 'whatsapp' ? <IconWhatsApp /> : <IconEmail />}
                    <span>{t('con.submit')}</span>
                    <span className="arr" aria-hidden>↗</span>
                  </button>
                </Magnetic>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
