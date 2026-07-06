import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { contactData, identity } from '@/lib/content';
import { Lang } from '@/lib/translations';
import LocalTime from '@/components/LocalTime';

const LANGS: Lang[] = ['en', 'fr', 'es'];

const PRIMARY = [
  { key: 'nav.work',    href: '/work' },
  { key: 'nav.about',   href: '/about' },
  { key: 'nav.contact', href: '/contact' },
];
const SECONDARY = [
  { key: 'nav.resume', href: '/resume' },
  { key: 'nav.cards',  href: '/business-cards' },
];

function LangRow({ inverted = false }: { inverted?: boolean }) {
  const { lang, setLang } = useLanguage();
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {LANGS.map(l => (
        <button key={l} onClick={() => setLang(l)} aria-label={l}
          className="font-mono touch-target"
          style={{
            fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            padding: '0.4rem 0.55rem', minWidth: 0, minHeight: 0,
            color: lang === l
              ? (inverted ? '#38BDF8' : 'currentColor')
              : (inverted ? 'rgba(238,241,255,0.4)' : 'currentColor'),
            opacity: lang === l ? 1 : (inverted ? 1 : 0.45),
            textDecoration: lang === l ? 'underline' : 'none',
            textUnderlineOffset: 4,
          }}>
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  /* Close on navigation, lock scroll while open */
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Skip link */}
      <a href="#main" className="font-mono"
        style={{ position: 'fixed', top: -60, left: 16, zIndex: 500, background: '#EEF1FF',
          color: '#08081F', padding: '0.6rem 1rem', fontSize: '0.65rem',
          letterSpacing: '0.2em', transition: 'top 0.2s ease' }}
        onFocus={e => (e.currentTarget.style.top = '12px')}
        onBlur={e => (e.currentTarget.style.top = '-60px')}>
        SKIP TO CONTENT
      </a>

      {/* Blended header — white text + difference = legible on paper AND ink */}
      <header className="fixed inset-x-0 top-0 z-[100]"
        style={{ mixBlendMode: 'difference', color: '#FFFFFF' }}>
        <div className="container flex items-center justify-between"
          style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}>

          <Link href="/" aria-label="Home" data-cursor={t('ui.home')} className="flex items-baseline gap-2">
            <span className="font-serif" style={{ fontSize: '1.28rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Charak
            </span>
            <span className="font-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.26em' }}>
              ©26
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <span className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.26em', opacity: 0.7 }}>
              {identity.coords}
            </span>
            <LocalTime className="font-mono" suffix=" GMT+1" />
          </div>

          <div className="flex items-center gap-2 sm:gap-5">
            <div className="hidden sm:block"><LangRow /></div>
            <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}
              className="font-mono touch-target"
              style={{ fontSize: '0.66rem', letterSpacing: '0.3em', display: 'inline-flex',
                alignItems: 'center', gap: '0.6rem' }}>
              <span aria-hidden style={{ display: 'inline-flex', flexDirection: 'column', gap: 5 }}>
                <i style={{ display: 'block', width: 26, height: 1, background: 'currentColor' }} />
                <i style={{ display: 'block', width: 16, height: 1, background: 'currentColor' }} />
              </span>
              {t('nav.menu')}
            </button>
          </div>
        </div>
      </header>

      {/* ── Ink overlay menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[200] flex flex-col"
            style={{ background: 'linear-gradient(160deg, #08081F 0%, #030308 100%)',
              color: '#EEF1FF', overflowY: 'auto' }}>

            {/* Top row */}
            <div className="container flex items-center justify-between flex-shrink-0"
              style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}>
              <span className="font-serif" style={{ fontSize: '1.28rem', fontWeight: 700 }}>Charak</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu"
                className="font-mono touch-target"
                style={{ fontSize: '0.66rem', letterSpacing: '0.3em', gap: '0.6rem', display: 'inline-flex' }}>
                <span aria-hidden style={{ position: 'relative', width: 18, height: 18, display: 'inline-block' }}>
                  <i style={{ position: 'absolute', inset: 0, margin: 'auto', width: 20, height: 1,
                    background: 'currentColor', transform: 'rotate(45deg)' }} />
                  <i style={{ position: 'absolute', inset: 0, margin: 'auto', width: 20, height: 1,
                    background: 'currentColor', transform: 'rotate(-45deg)' }} />
                </span>
                {t('nav.close')}
              </button>
            </div>

            {/* Body */}
            <div className="container flex-1 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 items-center"
              style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>

              {/* Primary links */}
              <nav aria-label="Primary" style={{ display: 'flex', flexDirection: 'column' }}>
                {PRIMARY.map((item, i) => {
                  const active = router.pathname.startsWith(item.href);
                  return (
                    <motion.div key={item.href}
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.18 + i * 0.07, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}>
                      <Link href={item.href} className="group flex items-baseline gap-5 py-2"
                        style={{ borderBottom: '1px solid rgba(238,241,255,0.14)' }}>
                        <span className="font-mono"
                          style={{ fontSize: '0.62rem', letterSpacing: '0.24em',
                            color: active ? '#38BDF8' : 'rgba(238,241,255,0.4)' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-serif transition-all duration-300 group-hover:translate-x-3 group-hover:[text-shadow:0_0_44px_rgba(129,140,248,0.65)]"
                          style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)', fontWeight: 700,
                            lineHeight: 1.14, letterSpacing: '-0.02em',
                            color: active ? '#38BDF8' : '#EEF1FF',
                            display: 'inline-block' }}>
                          {t(item.key)}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="flex gap-8 pt-6">
                  {SECONDARY.map((item, i) => (
                    <motion.div key={item.href}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.42 + i * 0.06, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}>
                      <Link href={item.href} className="font-mono u-sweep"
                        style={{ fontSize: '0.68rem', letterSpacing: '0.26em', textTransform: 'uppercase',
                          color: 'rgba(238,241,255,0.66)' }}>
                        {t(item.key)} ↗
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* Meta column */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="flex flex-col gap-7">
                <div>
                  <p className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.3em',
                    textTransform: 'uppercase', color: 'rgba(238,241,255,0.4)', marginBottom: '0.7rem' }}>
                    {t('menu.direct')}
                  </p>
                  <a href={`mailto:${contactData.email}`} className="u-sweep font-sans"
                    style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)' }}>
                    {contactData.email}
                  </a>
                  <p className="font-sans" style={{ fontSize: '0.9rem', color: 'rgba(238,241,255,0.6)', marginTop: '0.5rem' }}>
                    {contactData.phones[0]}
                  </p>
                </div>
                <div>
                  <p className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.3em',
                    textTransform: 'uppercase', color: 'rgba(238,241,255,0.4)', marginBottom: '0.7rem' }}>
                    {t('menu.elsewhere')}
                  </p>
                  <a href={identity.githubUrl} target="_blank" rel="noreferrer" className="u-sweep font-sans"
                    style={{ fontSize: '0.9rem', color: 'rgba(238,241,255,0.8)' }}>
                    GitHub ↗
                  </a>
                </div>
                <div>
                  <p className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.3em',
                    textTransform: 'uppercase', color: 'rgba(238,241,255,0.4)', marginBottom: '0.7rem' }}>
                    {t('menu.lang')}
                  </p>
                  <LangRow inverted />
                </div>
              </motion.div>
            </div>

            {/* Bottom strip */}
            <div className="container flex items-center justify-between flex-wrap gap-3 flex-shrink-0 safe-bottom"
              style={{ borderTop: '1px solid rgba(238,241,255,0.14)', paddingTop: '1rem', paddingBottom: '1.2rem' }}>
              <span className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.24em',
                color: 'rgba(238,241,255,0.45)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <i className="status-dot" style={{ width: 6, height: 6, borderRadius: '50%',
                  background: '#38BDF8', display: 'inline-block' }} />
                {t('nav.available')}
              </span>
              <span className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.24em',
                color: 'rgba(238,241,255,0.45)' }}>
                {identity.coords}
              </span>
              <LocalTime className="font-mono"
                suffix=" GMT+1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
