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

interface PageMetadata {
  title: string;
  description: string;
  language?: 'en' | 'fr' | 'es' | 'ar';
  noindex?: boolean;
}

const pageMetadata: Record<string, PageMetadata> = {
  '/': {
    title: 'Freelance Web Designer & Software Engineer | Abderrahmane Charak',
    description:
      'Abderrahmane Charak is a freelance web designer and software engineer based in Marrakech, Morocco, building websites, backend systems, and digital products for remote clients.',
  },
  '/about': {
    title: 'About Abderrahmane Charak | Web & Mobile Developer',
    description:
      'Meet Abderrahmane Charak, a state-certified software engineer in Marrakech, Morocco, building web and mobile products with engineering and product-design expertise.',
  },
  '/work': {
    title: 'Web Design, Development & Mobile App Portfolio | Abderrahmane Charak',
    description:
      'Explore selected web, mobile, backend, and product-design projects by Abderrahmane Charak, a software engineer based in Marrakech, Morocco.',
  },
  '/services': {
    title: 'Web Design, Development & Backend Services | Devariam',
    description:
      'Explore Abderrahmane Charak’s web development, backend API, product design, and applied AI services. Based in Marrakech and available for remote projects.',
  },
  '/fr/services': {
    title: 'Développement web, backend et design produit | Devariam',
    description:
      'Découvrez les services d’Abderrahmane Charak : plateformes web, API REST, design produit et IA appliquée. Basé à Marrakech, disponible à distance.',
    language: 'fr',
  },
  '/es/services': {
    title: 'Desarrollo web, backend y diseño de producto | Devariam',
    description:
      'Servicios de Abderrahmane Charak: plataformas web, API REST, diseño de producto e IA aplicada. Desde Marrakech, disponible para trabajo remoto.',
    language: 'es',
  },
  '/ar/services': {
    title: 'تصميم المواقع وتطوير البرمجيات | Devariam',
    description:
      'اكتشف خدمات Abderrahmane Charak في تطوير الويب والأنظمة الخلفية وواجهات REST وتصميم المنتجات والذكاء الاصطناعي. يعمل من مراكش عن بُعد.',
    language: 'ar',
  },
  '/contact': {
    title: 'Hire a Web Developer or Designer | Morocco & Europe',
    description:
      'Discuss a website, backend, or mobile app project with Abderrahmane Charak, a freelance software engineer based in Marrakech, Morocco.',
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
    noindex: true,
  },
};

function getPageMetadata(pathname: string) {
  const projectSlug = pathname.match(/^\/work\/([^/]+)$/)?.[1];
  if (projectSlug) {
    const project = workItems.find((item) => item.slug === projectSlug);
    if (project) {
      return {
        title: `${project.title} | Web Development Case Study`,
        description: shortenDescription(
          T.en[project.summaryKey] ?? pageMetadata['/work'].description,
        ),
      };
    }
  }

  return pageMetadata[pathname] ?? {
    title: 'Page not found | Devariam',
    description: 'The requested page could not be found.',
    noindex: true,
  };
}

function shortenDescription(description: string): string {
  const normalized = description.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 160) return normalized;
  const shortened = normalized.slice(0, 157);
  const wordBoundary = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, wordBoundary)}…`;
}

function getBreadcrumbs(pathname: string, pageTitle: string) {
  const language = pageMetadata[pathname]?.language ?? 'en';
  const homeLabel = language === 'fr'
    ? 'Accueil'
    : language === 'es'
      ? 'Inicio'
      : language === 'ar'
        ? 'الرئيسية'
        : 'Home';
  const items = [{ name: homeLabel, url: siteUrl }];
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'work' && segments.length > 1) {
    items.push({ name: 'Work', url: `${siteUrl}/work` });
    items.push({ name: pageTitle.split(' | ')[0], url: `${siteUrl}${pathname}` });
  } else if (segments.length > 0) {
    items.push({ name: pageTitle.split(' | ')[0], url: `${siteUrl}${pathname}` });
  }

  return items;
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
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const localeAlternates = [
    { language: 'en', path: '/services' },
    { language: 'fr', path: '/fr/services' },
    { language: 'es', path: '/es/services' },
    { language: 'ar', path: '/ar/services' },
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: identity.name,
        jobTitle: 'Web Designer and Software Engineer',
        description:
          'State-certified software engineer and product designer based in Marrakech, Morocco, building web and mobile products.',
        url: siteUrl,
        email: 'mailto:support@devariam.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Marrakech',
          addressCountry: 'MA',
        },
        areaServed: [
          'Morocco',
          'Europe',
          'Saudi Arabia',
          'Qatar',
          'United Arab Emirates',
          'Worldwide',
        ],
        knowsLanguage: ['English', 'French', 'Arabic'],
        knowsAbout: [
          'Web development',
          'Website design',
          'Mobile app development',
          'Backend development',
          'REST APIs',
          'Product design',
          'Applied AI and natural language processing',
        ],
        sameAs: [identity.githubUrl],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'Devariam',
        url: siteUrl,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      ...(pathname === '/services'
        ? [
            {
              '@type': 'Service',
              '@id': `${canonicalUrl}#service-1`,
              name: 'Web platforms and interfaces',
              serviceType: 'Web design and development',
              provider: { '@id': personId },
              areaServed: 'Worldwide',
              url: `${canonicalUrl}#service-1`,
            },
            {
              '@type': 'Service',
              '@id': `${canonicalUrl}#service-2`,
              name: 'Backend development and APIs',
              serviceType: 'Backend development and REST API development',
              provider: { '@id': personId },
              areaServed: 'Worldwide',
              url: `${canonicalUrl}#service-2`,
            },
            {
              '@type': 'Service',
              '@id': `${canonicalUrl}#service-3`,
              name: 'Product design and UX systems',
              serviceType: 'Product and interface design',
              provider: { '@id': personId },
              areaServed: 'Worldwide',
              url: `${canonicalUrl}#service-3`,
            },
            {
              '@type': 'Service',
              '@id': `${canonicalUrl}#service-4`,
              name: 'Applied AI and NLP',
              serviceType: 'Applied AI and natural language processing development',
              provider: { '@id': personId },
              areaServed: 'Worldwide',
              url: `${canonicalUrl}#service-4`,
            },
          ]
        : []),
      ...(!metadata.noindex
        ? [
            {
              '@type': 'WebPage',
              '@id': `${canonicalUrl}#webpage`,
              url: canonicalUrl,
              name: metadata.title,
              description: metadata.description,
              inLanguage: metadata.language ?? 'en',
              isPartOf: { '@id': websiteId },
              about: { '@id': personId },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: getBreadcrumbs(pathname, metadata.title).map(
                (item, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name: item.name,
                  item: item.url,
                }),
              ),
            },
          ]
        : []),
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
        {!metadata.noindex && <link rel="canonical" href={canonicalUrl} />}
        {metadata.noindex && <meta name="robots" content="noindex, nofollow" />}
        {localeAlternates.some((alternate) => alternate.path === pathname) &&
          localeAlternates.map(({ language, path }) => (
            <link key={language} rel="alternate" hrefLang={language} href={`${siteUrl}${path}`} />
          ))}
        {localeAlternates.some((alternate) => alternate.path === pathname) && (
          <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/services`} />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#030308" />
        <meta property="og:type" content="website" />
        <meta
          property="og:locale"
          content={
            metadata.language === 'fr'
              ? 'fr_FR'
              : metadata.language === 'es'
                ? 'es_ES'
                : metadata.language === 'ar'
                  ? 'ar_MA'
                  : 'en_US'
          }
        />
        <meta property="og:site_name" content="Devariam" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={`${siteUrl}/og-devariam.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Abderrahmane Charak, web designer and software engineer at Devariam" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={`${siteUrl}/og-devariam.png`} />
        <meta name="twitter:image:alt" content="Abderrahmane Charak, web designer and software engineer at Devariam" />
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
