import Link from 'next/link';
import { contactData, identity } from '@/lib/content';
import { useLanguage } from '@/contexts/LanguageContext';
import LocalTime from '@/components/LocalTime';
import Magnetic from '@/components/Magnetic';
import Stamp from '@/components/Stamp';

export default function Footer() {
  const { t } = useLanguage();

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer data-theme="ink"
      style={{ background: 'var(--bg)', color: 'var(--fg)', position: 'relative', overflow: 'hidden' }}>

      {/* CTA block */}
      <div className="container" style={{ paddingTop: 'clamp(4rem, 9vw, 9rem)', paddingBottom: 'clamp(3rem, 6vw, 6rem)' }}>
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div style={{ maxWidth: '18ch' }}>
            <p className="o-label" style={{ marginBottom: '1.6rem' }}>
              <span style={{ color: 'var(--acc)' }}>{'//'}</span> {t('footer.label')}
            </p>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(2.6rem, 8vw, 8.5rem)', fontWeight: 380,
              lineHeight: 0.98, letterSpacing: '-0.025em' }}>
              {t('footer.cta1')}{' '}
              <em className="it" style={{ color: 'var(--acc)' }}>{t('footer.cta2')}</em>
            </h2>
          </div>
          <Stamp className="hidden lg:block" size={168} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8" style={{ marginTop: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <Magnetic>
            <a href={`mailto:${contactData.email}`} className="btn-slab" data-cursor={t('ui.write')}
              style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
              <span>{contactData.email}</span>
              <span className="arr" aria-hidden>↗</span>
            </a>
          </Magnetic>
          <a href={`https://wa.me/${contactData.whatsapp}`} target="_blank" rel="noreferrer"
            className="font-mono u-sweep"
            style={{ fontSize: '0.68rem', letterSpacing: '0.26em', textTransform: 'uppercase',
              color: 'var(--fg-2)', alignSelf: 'flex-start', padding: '0.8rem 0' }}>
            WhatsApp — {contactData.phones[0]}
          </a>
        </div>
      </div>

      {/* Link ledger */}
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8"
        style={{ borderTop: '1px solid var(--line)', paddingTop: '2.4rem', paddingBottom: '2.4rem' }}>
        <div>
          <p className="o-label" style={{ marginBottom: '1rem' }}>{t('footer.nav')}</p>
          <div className="flex flex-col gap-2.5">
            {[
              { key: 'nav.work', href: '/work' },
              { key: 'nav.about', href: '/about' },
              { key: 'nav.contact', href: '/contact' },
            ].map(({ key, href }) => (
              <Link key={href} href={href} className="u-sweep font-sans"
                style={{ fontSize: '0.9rem', color: 'var(--fg-2)', alignSelf: 'flex-start' }}>
                {t(key)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="o-label" style={{ marginBottom: '1rem' }}>{t('footer.docs')}</p>
          <div className="flex flex-col gap-2.5">
            <Link href="/resume" className="u-sweep font-sans"
              style={{ fontSize: '0.9rem', color: 'var(--fg-2)', alignSelf: 'flex-start' }}>
              {t('nav.resume')}
            </Link>
            <Link href="/business-cards" className="u-sweep font-sans"
              style={{ fontSize: '0.9rem', color: 'var(--fg-2)', alignSelf: 'flex-start' }}>
              {t('nav.cards')}
            </Link>
          </div>
        </div>
        <div>
          <p className="o-label" style={{ marginBottom: '1rem' }}>{t('footer.con')}</p>
          <div className="flex flex-col gap-2.5">
            <a href={identity.githubUrl} target="_blank" rel="noreferrer" className="u-sweep font-sans"
              style={{ fontSize: '0.9rem', color: 'var(--fg-2)', alignSelf: 'flex-start' }}>
              GitHub ↗
            </a>
            <span className="font-sans" style={{ fontSize: '0.9rem', color: 'var(--mut)' }}>
              {contactData.location}
            </span>
          </div>
        </div>
        <div>
          <p className="o-label" style={{ marginBottom: '1rem' }}>{t('footer.status')}</p>
          <span className="font-mono" style={{ fontSize: '0.66rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--fg-2)',
            display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <i className="status-dot" style={{ width: 6, height: 6, borderRadius: '50%',
              background: 'var(--acc)', display: 'inline-block' }} />
            {t('footer.open')}
          </span>
        </div>
      </div>

      {/* Colophon */}
      <div className="container safe-bottom flex items-center justify-between flex-wrap gap-3"
        style={{ borderTop: '1px solid var(--line)', paddingTop: '1.1rem', paddingBottom: '1.3rem' }}>
        <span className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.22em', color: 'var(--mut)' }}>
          © {new Date().getFullYear()} {identity.name.toUpperCase()}
        </span>
        <span className="font-mono hidden sm:inline" style={{ fontSize: '0.58rem', letterSpacing: '0.22em', color: 'var(--mut)' }}>
          {identity.coords}
        </span>
        <LocalTime className="font-mono" suffix=" GMT+1" />
        <button onClick={toTop} className="font-mono u-sweep touch-target" data-cursor="↑"
          style={{ fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--fg-2)', minWidth: 0 }}>
          {t('footer.top')} ↑
        </button>
      </div>

      {/* Watermark name */}
      <div aria-hidden className="select-none pointer-events-none"
        style={{ position: 'absolute', bottom: '-0.14em', left: 0, right: 0,
          textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden',
          fontFamily: 'Fraunces, serif', fontWeight: 500,
          fontSize: 'clamp(4rem, 16vw, 19rem)', lineHeight: 1,
          letterSpacing: '-0.03em', color: 'transparent',
          WebkitTextStroke: '1px rgba(239,235,226,0.09)' }}>
        CHARAK
      </div>
    </footer>
  );
}
