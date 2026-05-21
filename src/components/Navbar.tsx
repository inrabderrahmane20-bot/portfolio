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
          backgroundColor: scrolled ? 'rgba(3,3,8,0.88)' : 'transparent',
          backdropFilter:  scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom:    scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        }}
      >
        <div className="container flex items-center justify-between py-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-black text-[0.72rem] uppercase tracking-[0.42em] transition-all hover:opacity-70"
            style={{
              background: 'linear-gradient(135deg, #818cf8, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AC.
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative font-mono text-[0.65rem] uppercase tracking-[0.28em] transition-colors"
                  style={{ color: active ? '#818cf8' : 'rgba(255,255,255,0.50)' }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.50)'; }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{ background: 'linear-gradient(90deg, #818cf8, #38bdf8)' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden flex flex-col gap-[5px] py-1"
          >
            <span className="block h-px w-6 bg-white" />
            <span className="block h-px w-4" style={{ background: 'rgba(255,255,255,0.40)' }} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] flex flex-col justify-between px-8 py-10"
            style={{
              background: 'linear-gradient(160deg, #07071a 0%, #030308 100%)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-display font-black text-[0.72rem] uppercase tracking-[0.42em]"
                style={{
                  background: 'linear-gradient(135deg, #818cf8, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AC.
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-9 h-9 flex items-center justify-center"
              >
                <span className="relative block w-5 h-5">
                  <span className="absolute inset-0 m-auto block h-px w-5 rotate-45 bg-white" />
                  <span className="absolute inset-0 m-auto block h-px w-5 -rotate-45 bg-white" />
                </span>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display font-black uppercase leading-[0.92] tracking-[-0.03em] transition-all"
                    style={{ fontSize: 'clamp(2.8rem,10vw,4.5rem)', color: '#ffffff' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'linear-gradient(135deg, #818cf8, #38bdf8)';
                      (el.style as any).webkitBackgroundClip = 'text';
                      (el.style as any).webkitTextFillColor  = 'transparent';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'none';
                      (el.style as any).webkitTextFillColor = '#ffffff';
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer strip */}
            <div className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-mono text-[0.60rem] uppercase tracking-[0.30em]" style={{ color: 'rgba(255,255,255,0.32)' }}>
                Marrakech, Morocco · Available for projects
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
