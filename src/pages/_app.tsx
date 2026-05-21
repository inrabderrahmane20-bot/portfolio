import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Lenis from 'lenis';
import '../../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';

/* ── Intersection Observer-based scroll reveal ───────────────────────── */
function setupReveal(): { disconnect: () => void } {
  /* Stagger children of .reveal-group */
  const groupObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target
          .querySelectorAll<HTMLElement>('.reveal-item')
          .forEach((item, i) => {
            setTimeout(() => item.classList.add('is-visible'), i * 85);
          });
        groupObs.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
  );

  /* Single .reveal elements */
  const singleObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        singleObs.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' },
  );

  document.querySelectorAll('.reveal-group').forEach((el) => groupObs.observe(el));
  document.querySelectorAll('.reveal').forEach((el) => singleObs.observe(el));

  return {
    disconnect: () => { groupObs.disconnect(); singleObs.disconnect(); },
  };
}

export default function App({ Component, pageProps }: AppProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const router = useRouter();

  /* ── Scroll reveals — re-run on every page navigation ─────────────── */
  useEffect(() => {
    let obs = setupReveal();

    const onComplete = () => {
      obs.disconnect();
      setTimeout(() => { obs = setupReveal(); }, 120);
    };

    router.events.on('routeChangeComplete', onComplete);
    return () => {
      obs.disconnect();
      router.events.off('routeChangeComplete', onComplete);
    };
  }, [router.events]);

  /* ── Lenis smooth scroll + GSAP ScrollTrigger sync ────────────────── */
  useEffect(() => {
    let useRaf = true;
    let rafId  = -1;

    const lenis = new Lenis({
      duration:    1.2,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch:   true,
      autoRaf:     false,
    });

    /* Fallback RAF loop until GSAP loads */
    const raf = (time: number) => {
      if (!useRaf) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    /* Sync with GSAP ticker so ScrollTrigger reads correct position */
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        useRaf = false;
        cancelAnimationFrame(rafId);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time: number) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      },
    );

    /* Scroll progress bar */
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      useRaf = false;
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#F3EFE7', color: '#FFFFFF' }}>
      {/* Accent progress bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[1000] h-px overflow-hidden bg-divider">
        <div
          className="scroll-progress h-full bg-accent"
          style={{ transform: `scaleX(${scrollProgress})`, transformOrigin: 'left' }}
        />
      </div>

      <CustomCursor />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
