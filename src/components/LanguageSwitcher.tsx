import { useLanguage } from '@/contexts/LanguageContext';
import { Lang } from '@/lib/translations';

/* ── Inline SVG country flags ──────────────────────────────────────── */
function FlagEN() {
  return (
    <svg viewBox="0 0 60 36" width="20" height="12" aria-hidden>
      <rect width="60" height="36" fill="#012169" rx="1"/>
      <path d="M0,0 L60,36 M60,0 L0,36" stroke="#fff" strokeWidth="10"/>
      <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="6"/>
      <rect x="27" width="6" height="36" fill="#fff"/>
      <rect y="15" width="60" height="6" fill="#fff"/>
      <rect x="28.5" width="3" height="36" fill="#C8102E"/>
      <rect y="16.5" width="60" height="3" fill="#C8102E"/>
    </svg>
  );
}
function FlagFR() {
  return (
    <svg viewBox="0 0 3 2" width="20" height="14" aria-hidden>
      <rect width="1" height="2" fill="#002395"/>
      <rect x="1" width="1" height="2" fill="#fff"/>
      <rect x="2" width="1" height="2" fill="#ED2939"/>
    </svg>
  );
}
function FlagES() {
  return (
    <svg viewBox="0 0 3 2" width="20" height="14" aria-hidden>
      <rect width="3" height="2" fill="#AA151B"/>
      <rect y="0.5" width="3" height="1" fill="#F1BF00"/>
    </svg>
  );
}

const FLAGS: Record<Lang, React.ReactNode> = {
  en: <FlagEN />,
  fr: <FlagFR />,
  es: <FlagES />,
};

const LABELS: Record<Lang, string> = { en: 'EN', fr: 'FR', es: 'ES' };
const LANGS: Lang[] = ['en', 'fr', 'es'];

interface Props {
  /** 'nav'   = compact desktop navbar version
   *  'mobile'= larger touch-friendly mobile version */
  variant?: 'nav' | 'mobile';
}

export default function LanguageSwitcher({ variant = 'nav' }: Props) {
  const { lang, setLang } = useLanguage();

  const isMobile = variant === 'mobile';

  return (
    <div
      role="group"
      aria-label="Select language"
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             2,
        background:      'rgba(255,255,255,0.06)',
        border:          '1px solid rgba(255,255,255,0.10)',
        borderRadius:    999,
        padding:         isMobile ? '3px' : '2px',
      }}
    >
      {LANGS.map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-label={`Switch to ${l === 'en' ? 'English' : l === 'fr' ? 'French' : 'Spanish'}`}
            aria-pressed={active}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            isMobile ? 6 : 4,
              padding:        isMobile ? '8px 14px' : '4px 10px',
              borderRadius:   999,
              border:         'none',
              cursor:         'pointer',
              transition:     'background 180ms ease, color 180ms ease',
              background:     active ? 'rgba(255,255,255,0.14)' : 'transparent',
              color:          active ? '#ffffff' : 'rgba(255,255,255,0.40)',
              fontFamily:     "'JetBrains Mono', monospace",
              fontSize:       isMobile ? '0.72rem' : '0.60rem',
              fontWeight:     active ? 600 : 400,
              letterSpacing:  '0.10em',
              minHeight:      isMobile ? 44 : 0,
              touchAction:    'manipulation',
              userSelect:     'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {FLAGS[l]}
            <span>{LABELS[l]}</span>
          </button>
        );
      })}
    </div>
  );
}
