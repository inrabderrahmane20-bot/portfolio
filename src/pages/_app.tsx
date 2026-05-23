import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Lenis from 'lenis';
import '../../styles/globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
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

  /* ── Zoom lock — blocks all pinch-zoom and double-tap-zoom ─────────── */
  useEffect(() => {
    /* Prevent pinch zoom (multi-touch) */
    const blockPinch = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault(); };
    /* Prevent double-tap zoom on iOS */
    const blockGesture = (e: Event) => e.preventDefault();
    document.addEventListener('touchmove',    blockPinch,   { passive: false });
    document.addEventListener('gesturestart', blockGesture, { passive: false });
    document.addEventListener('gesturechange',blockGesture, { passive: false });
    return () => {
      document.removeEventListener('touchmove',    blockPinch);
      document.removeEventListener('gesturestart', blockGesture);
      document.removeEventListener('gesturechange',blockGesture);
    };
  }, []);

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
      duration:    0.85,   /* snappier — less CPU time on each scroll event */
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch:   false,  /* native touch scrolling — fastest on mobile */
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
    <>
    <Head>
      <title>— Brand &amp; Web Design Specialist</title>
      <meta name="description" content="Abderrahmane Charak — Software engineer and digital product designer crafting elegant web systems from Marrakech, Morocco." />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#030308" />
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="AC — Brand &amp; Web Design Specialist" />
      <meta property="og:description" content="Software engineer and digital product designer crafting elegant web systems." />
      <meta property="og:image" content="/android-chrome-512x512.png" />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="AC — Brand &amp; Web Design Specialist" />
      <meta name="twitter:description" content="Software engineer and digital product designer crafting elegant web systems." />
      <meta name="twitter:image" content="/android-chrome-512x512.png" />
    </Head>
    <LanguageProvider>
    <div className="relative min-h-screen" style={{ backgroundColor: '#030308', color: '#ffffff' }}>
      {/* Gradient progress bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[1000] h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="scroll-progress h-full"
          style={{ transform: `scaleX(${scrollProgress})`, transformOrigin: 'left' }}
        />
      </div>

      <CustomCursor />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
    </LanguageProvider>
    </>
  );
}
