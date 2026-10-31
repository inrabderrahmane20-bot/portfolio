import type { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Lenis from 'lenis';
import '../../styles/globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { identity, workItems } from '@/lib/content';
import { T } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import SpaceBackdrop from '@/components/SpaceBackdrop';

const siteUrl = 'https://www.devariam.com';

const pageMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Freelance Web Developer & Designer in Morocco | Abderrahmane Charak',
    description:
      'Freelance web developer and designer in Marrakech, building fast websites, mobile apps, and digital products for businesses across Morocco and Europe.',
  },
  '/about': {
    title: 'About Abderrahmane Charak | Web & Mobile Developer',
    description:
      'Meet Abderrahmane Charak, a state-certified software engineer and freelance web developer in Marrakech, working with clients across Morocco and Europe.',
  },
  '/work': {
    title: 'Web Design, Development & Mobile App Portfolio | Abderrahmane Charak',
    description:
      'Explore website design, web development, and mobile app projects built for clients in Morocco and Europe.',
  },
  '/contact': {
    title: 'Hire a Web Developer or Designer | Morocco & Europe',
    description:
      'Discuss your website, design, or mobile app project with Abderrahmane Charak, a freelance developer based in Marrakech, Morocco.',
  },
  '/resume': {
    title: 'Résumé | Abderrahmane Charak - Software Engineer',
    description:
      'View the résumé of Abderrahmane Charak, a software engineer in Marrakech specializing in web development, mobile apps, and product design.',
  },
  '/business-cards': {
    title: 'Digital Business Card | Abderrahmane Charak',
    description:
      'Contact Abderrahmane Charak, freelance web and mobile app developer based in Marrakech, Morocco.',
  },
};

function getPageMetadata(pathname: string) {
  const projectSlug = pathname.match(/^\/work\/([^/]+)$/)?.[1];
  if (projectSlug) {
    const project = workItems.find((item) => item.slug === projectSlug);
    if (project) {
      return {
        title: `${project.title} | Web Development Case Study`,
        description: T.en[project.summaryKey] ?? pageMetadata['/work'].description,
      };
    }
  }

  return pageMetadata[pathname] ?? pageMetadata['/'];
}

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
  const pathname = new URL(router.asPath, siteUrl).pathname.replace(/\/$/, '') || '/';
  const metadata = getPageMetadata(pathname);
  const canonicalUrl = `${siteUrl}${pathname}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.name,
    jobTitle: 'Freelance Web Developer and Product Designer',
    url: siteUrl,
    email: 'mailto:support@devariam.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Marrakech',
      addressCountry: 'MA',
    },
    areaServed: ['Morocco', 'Europe'],
    knowsAbout: [
      'Web development',
      'Website design',
      'Mobile app development',
      'Product design',
      'Search engine optimization',
    ],
    sameAs: [identity.githubUrl],
  };

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
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#030308" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Abderrahmane Charak" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={`${siteUrl}/android-chrome-512x512.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={`${siteUrl}/android-chrome-512x512.png`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <LanguageProvider>
        {/* Root stays transparent — the body paints #030308 and the fixed
            backdrop lives at z-index -1, below ALL page content. */}
        <div className="relative min-h-screen" style={{ backgroundColor: 'transparent', color: 'var(--starlight)' }}>
          {/* Deep-field backdrop: starfield + aurora, then hairlines + grain */}
          <SpaceBackdrop />
          <div className="page-rules" aria-hidden><i /><i /><i /><i /><i /></div>
          <div className="grain" aria-hidden />

          {/* Reading progress — indigo→cyan hairline */}
          <div className="pointer-events-none fixed inset-x-0 top-0 z-[1000] h-[2px]">
            <div className="h-full" style={{
              transform: `scaleX(${scrollProgress})`, transformOrigin: 'left',
              background: 'linear-gradient(90deg, #818CF8, #38BDF8)',
              boxShadow: '0 0 12px rgba(99,102,241,0.6)',
              transition: 'transform 0.1s linear' }} />
          </div>

          <CustomCursor />
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
