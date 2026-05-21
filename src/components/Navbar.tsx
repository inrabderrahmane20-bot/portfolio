import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { label: 'Work',    href: '/work' },
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { pathname }            = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

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
          backgroundColor: scrolled ? 'rgba(243,239,231,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid #CBB8A0' : '1px solid transparent',
        }}
      >
        <div className="container flex items-center justify-between py-6">
          <Link href="/"
            className="font-display font-bold text-[0.7rem] uppercase tracking-[0.42em] transition-opacity hover:opacity-60"
            style={{ color: '#FFFFFF' }}>
            AC.
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className="relative font-sans text-[0.68rem] uppercase tracking-[0.28em] transition-colors"
                  style={{ color: active ? '#FFFFFF' : '#8A8178' }}>
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px" style={{ backgroundColor: '#CBB8A0' }} />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden flex flex-col gap-[5px] py-1"
          >
            <span className="block h-px w-6" style={{ backgroundColor: '#FFFFFF' }} />
            <span className="block h-px w-4" style={{ backgroundColor: '#8A8178' }} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] flex flex-col justify-between px-8 py-10"
            style={{ backgroundColor: '#F3EFE7' }}
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)}
                className="font-display font-bold text-[0.7rem] uppercase tracking-[0.42em]"
                style={{ color: '#FFFFFF' }}>
                AC.
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close" className="w-9 h-9 flex items-center justify-center">
                <span className="relative block w-5 h-5">
                  <span className="absolute inset-0 m-auto block h-px w-5 rotate-45" style={{ backgroundColor: '#FFFFFF' }} />
                  <span className="absolute inset-0 m-auto block h-px w-5 -rotate-45" style={{ backgroundColor: '#FFFFFF' }} />
                </span>
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navItems.map((item, i) => (
                <motion.div key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}>
                  <Link href={item.href} onClick={() => setOpen(false)}
                    className="font-display font-black uppercase leading-[0.92] tracking-[-0.03em] transition-colors"
                    style={{ fontSize: 'clamp(2.8rem,10vw,4.5rem)', color: '#FFFFFF' }}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="pt-8" style={{ borderTop: '1px solid #CBB8A0' }}>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: '#8A8178' }}>
                Marrakech, Morocco · Available for projects
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
