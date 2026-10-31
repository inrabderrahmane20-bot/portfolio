import Link from 'next/link';
import type { Lang } from '@/lib/translations';
import { serviceCopy } from '@/lib/service-content';

type ServiceLanguage = Lang | 'ar';

const languagePaths: Record<ServiceLanguage, string> = {
  en: '/services',
  fr: '/fr/services',
  es: '/services',
  ar: '/ar/services',
};

const languages: { code: ServiceLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
];

export default function ServicesPage({ language }: { language: ServiceLanguage }) {
  const copy = serviceCopy[language];
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <article lang={language} dir={direction}
      style={{ background: 'transparent', color: 'var(--fg)', overflowX: 'hidden' }}>
      <header className="container" style={{ paddingTop: 'clamp(8rem,16vw,12rem)', paddingBottom: 'var(--section-y)' }}>
        <p className="o-label" style={{ marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--acc-text)' }}>{'//'}</span> {copy.label}
        </p>
        <h1 className="font-serif" style={{
          maxWidth: '14ch',
          fontSize: 'var(--fs-hero)',
          fontWeight: 800,
          lineHeight: 0.98,
          letterSpacing: '-0.03em',
        }}>
          {copy.title}
        </h1>
        <p className="font-sans" style={{
          maxWidth: '66ch',
          marginTop: '2rem',
          color: 'var(--fg-2)',
          fontSize: 'var(--fs-body)',
          lineHeight: 1.8,
        }}>
          {copy.intro}
        </p>
        <div aria-label="Available service page languages" className="flex flex-wrap gap-4"
          style={{ marginTop: '1.5rem' }}>
          {languages.map(({ code, label }) => (
            <Link key={code} href={languagePaths[code]} hrefLang={code}
              aria-current={language === code ? 'page' : undefined}
              className="u-sweep font-mono"
              style={{
                color: language === code ? 'var(--acc-text)' : 'var(--fg-2)',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
              {label}
            </Link>
          ))}
        </div>
        <Link href="/work" className="u-sweep font-mono" style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          color: 'var(--acc-text)',
          fontSize: '0.65rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}>
          {copy.projectsLink} ↗
        </Link>
      </header>

      <section className="container" style={{
        borderTop: '1px solid var(--line)',
        paddingTop: 'var(--section-y)',
        paddingBottom: 'var(--section-y)',
      }}>
        <h2 className="font-serif" style={{
          marginBottom: '2rem',
          fontSize: 'var(--fs-h2)',
          fontWeight: 700,
        }}>
          {copy.servicesTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderTop: '1px solid var(--line)' }}>
          {copy.services.map((service, index) => (
            <section id={`service-${index + 1}`} key={service.title} style={{
              padding: 'clamp(1.5rem,4vw,3rem)',
              borderBottom: '1px solid var(--line)',
              borderRight: index % 2 === 0 ? '1px solid var(--line)' : undefined,
            }}>
              <p className="o-label" style={{ marginBottom: '1.2rem', color: 'var(--acc-text)' }}>
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="font-serif" style={{
                marginBottom: '1rem',
                fontSize: 'clamp(1.5rem,3vw,2.4rem)',
                fontWeight: 600,
                lineHeight: 1.1,
              }}>
                {service.title}
              </h3>
              <p className="font-sans" style={{
                color: 'var(--fg-2)',
                fontSize: 'var(--fs-small)',
                lineHeight: 1.8,
              }}>
                {service.description}
              </p>
              <ul className="flex flex-wrap gap-2" style={{ marginTop: '1.5rem' }}>
                {service.technologies.map((technology) => (
                  <li key={technology} className="font-mono" style={{
                    border: '1px solid var(--line-2)',
                    padding: '0.4rem 0.65rem',
                    color: 'var(--mut)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}>
                    {technology}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="container" style={{
        borderTop: '1px solid var(--line)',
        paddingTop: 'var(--section-y)',
        paddingBottom: 'var(--section-y)',
      }}>
        <h2 className="font-serif" style={{
          marginBottom: '2rem',
          fontSize: 'var(--fs-h2)',
          fontWeight: 700,
        }}>
          {copy.faqTitle}
        </h2>
        <div style={{ borderTop: '1px solid var(--line)' }}>
          {copy.questions.map(({ question, answer }) => (
            <details key={question} style={{ borderBottom: '1px solid var(--line)', padding: '1.25rem 0' }}>
              <summary className="font-serif" style={{
                cursor: 'pointer',
                fontSize: 'clamp(1.1rem,2vw,1.45rem)',
                fontWeight: 600,
              }}>
                {question}
              </summary>
              <p className="font-sans" style={{
                maxWidth: '72ch',
                marginTop: '1rem',
                color: 'var(--fg-2)',
                fontSize: 'var(--fs-small)',
                lineHeight: 1.8,
              }}>
                {answer}
              </p>
            </details>
          ))}
        </div>
        <Link href="/contact" className="btn-slab" style={{ display: 'inline-flex', marginTop: '2.5rem' }}>
          <span>{copy.cta}</span>
          <span className="arr" aria-hidden>↗</span>
        </Link>
      </section>
    </article>
  );
}
