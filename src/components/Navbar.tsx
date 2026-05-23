import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const { pathname }            = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { t }                   = useLanguage();

  const navItems = [
    { key: 'nav.work',    href: '/work' },
    { key: 'nav.about',   href: '/about' },
    { key: 'nav.contact', href: '/contact' },
    { key: 'nav.cards',   href: '/business-cards' },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          backgroundColor:     scrolled ? 'rgba(3,3,8,0.90)' : 'transparent',
          backdropFilter:      scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter:scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom:        scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        }}
      >
        {/* Mobile: [hamburger | logo | flag]   Desktop: [logo | nav + lang] */}
        <div className="container flex items-center py-5 sm:py-6">

          {/* Mobile hamburger — left */}
          <button onClick={() => setOpen(true)} aria-label="Open menu"
            className="md:hidden flex flex-col gap-[5px] py-1 px-1 mr-1" style={{ touchAction: 'manipulation' }}>
            <span className="block h-px w-6 bg-white" />
            <span className="block h-px w-4" style={{ background: 'rgba(255,255,255,0.40)' }} />
          </button>

          {/* Logo — centered on mobile (flex-1 + justify-center), left on desktop */}
          <div className="flex-1 flex justify-center md:justify-start md:flex-none md:mr-auto">
            <Link href="/" className="flex items-center transition-all hover:opacity-80" aria-label="Home">
              <Image src="/LOGO.png" alt="AC" width={56} height={16} className="h-7 sm:h-8 w-auto object-contain" priority />
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Flag language switcher — mobile only */}
            <LanguageSwitcher variant="flag" className="md:hidden" />

            {/* Desktop nav + language switcher */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                {navItems.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href}
                      className="relative font-mono text-[0.65rem] uppercase tracking-[0.28em] transition-colors"
                      style={{ color: active ? '#818cf8' : 'rgba(255,255,255,0.50)' }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.50)'; }}
                    >
                      {t(item.key)}
                      {active && (
                        <span className="absolute -bottom-0.5 left-0 right-0 h-px"
                          style={{ background: 'linear-gradient(90deg,#818cf8,#38bdf8)' }} />
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)' }} aria-hidden />
              <LanguageSwitcher variant="nav" />
            </div>
          </div>

        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.52, ease: [0.16,1,0.3,1] }}
            className="fixed inset-0 z-[200] flex flex-col justify-between px-6 py-10"
            style={{ background: 'linear-gradient(160deg,#07071a 0%,#030308 100%)' }}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} aria-label="Home">
                <Image src="/LOGO.png" alt="AC" width={56} height={16} className="h-7 w-auto object-contain" />
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close menu"
                className="w-10 h-10 flex items-center justify-center"
                style={{ touchAction: 'manipulation' }}>
                <span className="relative block w-5 h-5">
                  <span className="absolute inset-0 m-auto block h-px w-5 rotate-45 bg-white" />
                  <span className="absolute inset-0 m-auto block h-px w-5 -rotate-45 bg-white" />
                </span>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-5">
              {navItems.map((item, i) => (
                <motion.div key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.08, ease: [0.16,1,0.3,1], duration: 0.6 }}>
                  <Link href={item.href} onClick={() => setOpen(false)}
                    className="font-display font-black uppercase leading-[0.92] tracking-[-0.03em] block transition-all"
                    style={{ fontSize: 'clamp(2rem,8vw,4.5rem)', color: '#ffffff' }}
                    onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background='linear-gradient(135deg,#818cf8,#38bdf8)'; (el.style as any).webkitBackgroundClip='text'; (el.style as any).webkitTextFillColor='transparent'; }}
                    onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background='none'; (el.style as any).webkitTextFillColor='#ffffff'; }}
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer strip */}
            <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em]"
                style={{ color: 'rgba(255,255,255,0.32)' }}>
                {t('nav.available')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
