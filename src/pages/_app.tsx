import type { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Lenis from 'lenis';
import '../../styles/globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';

/* ── IntersectionObserver scroll reveal ─────────────────────────────── */
function setupReveal(): { disconnect: () => void } {
  const groupObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target
          .querySelectorAll<HTMLElement>('.reveal-item')
          .forEach((item, i) => setTimeout(() => item.classList.add('is-visible'), i * 80));
        groupObs.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
  );

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
  return { disconnect: () => { groupObs.disconnect(); singleObs.disconnect(); } };
}

export default function App({ Component, pageProps }: AppProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const curtainRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* ── Zoom lock ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const blockPinch = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault(); };
    const blockGesture = (e: Event) => e.preventDefault();
    document.addEventListener('touchmove', blockPinch, { passive: false });
    document.addEventListener('gesturestart', blockGesture, { passive: false });
    document.addEventListener('gesturechange', blockGesture, { passive: false });
    return () => {
      document.removeEventListener('touchmove', blockPinch);
      document.removeEventListener('gesturestart', blockGesture);
      document.removeEventListener('gesturechange', blockGesture);
    };
  }, []);

  /* ── Route curtain — ink wipe between pages ────────────────────────── */
  useEffect(() => {
    const el = curtainRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cover = () => {
      if (reduced) return;
      el.style.transition = 'transform 0.42s cubic-bezier(0.76, 0, 0.24, 1)';
      el.style.transform  = 'translateY(0)';
    };
    const reveal = () => {
      if (reduced) return;
      setTimeout(() => {
        el.style.transition = 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)';
        el.style.transform  = 'translateY(-101%)';
        setTimeout(() => {
          el.style.transition = 'none';
          el.style.transform  = 'translateY(101%)';
        }, 600);
      }, 120);
    };

    router.events.on('routeChangeStart', cover);
    router.events.on('routeChangeComplete', reveal);
    router.events.on('routeChangeError', reveal);
    return () => {
      router.events.off('routeChangeStart', cover);
      router.events.off('routeChangeComplete', reveal);
      router.events.off('routeChangeError', reveal);
    };
  }, [router.events]);

  /* ── Scroll reveals — re-run per navigation ────────────────────────── */
  useEffect(() => {
    let obs = setupReveal();
    const onComplete = () => {
      obs.disconnect();
      setTimeout(() => { obs = setupReveal(); }, 150);
    };
    router.events.on('routeChangeComplete', onComplete);
    return () => { obs.disconnect(); router.events.off('routeChangeComplete', onComplete); };
  }, [router.events]);

  /* ── Lenis smooth scroll + GSAP ScrollTrigger sync ─────────────────── */
  useEffect(() => {
    let useRaf = true;
    let rafId  = -1;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });

    const raf = (time: number) => {
      if (!useRaf) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

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
    <>
      <Head>
        <title>Abderrahmane Charak — Software Engineer</title>
        <meta name="description" content="Abderrahmane Charak — state-certified software engineer building full-stack web and mobile products end to end, from Marrakech, Morocco." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#EFEBE2" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Abderrahmane Charak — Software Engineer" />
        <meta property="og:description" content="Full-stack web & mobile products, engineered end to end — Marrakech, Morocco." />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Abderrahmane Charak — Software Engineer" />
        <meta name="twitter:description" content="Full-stack web & mobile products, engineered end to end — Marrakech, Morocco." />
        <meta name="twitter:image" content="/android-chrome-512x512.png" />
      </Head>
      <LanguageProvider>
        <div className="relative min-h-screen" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
          {/* Architectural hairlines + film grain */}
          <div className="page-rules" aria-hidden><i /><i /><i /><i /><i /></div>
          <div className="grain" aria-hidden />

          {/* Reading progress — hairline vermilion */}
          <div className="pointer-events-none fixed inset-x-0 top-0 z-[1000] h-[2px]">
            <div className="h-full" style={{
              transform: `scaleX(${scrollProgress})`, transformOrigin: 'left',
              background: 'var(--verm)', transition: 'transform 0.1s linear' }} />
          </div>

          <CustomCursor />
          <Preloader />
          <div ref={curtainRef} className="curtain" aria-hidden />

          <Navbar />
          <main id="main">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </>
  );
}
