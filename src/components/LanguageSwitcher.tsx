import { useEffect, useRef, useState } from 'react';
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
const NAMES:  Record<Lang, string> = { en: 'English', fr: 'Français', es: 'Español' };
const LANGS:  Lang[] = ['en', 'fr', 'es'];

interface Props {
  /** 'nav'   = compact desktop navbar row
   *  'mobile'= pill row inside mobile drawer
   *  'flag'  = single flag button with dropdown (mobile top-bar) */
  variant?: 'nav' | 'mobile' | 'flag';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'nav', className }: Props) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click/tap */
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [open]);

  /* ── Flag variant: single flag button + dropdown ── */
  if (variant === 'flag') {
    return (
      <div ref={ref} className={className} style={{ position: 'relative' }}>
        {/* Trigger */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Select language"
          aria-expanded={open}
          style={{
            width:        40,
            height:       40,
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            borderRadius: '50%',
            border:       `1px solid ${open ? 'rgba(129,140,248,0.40)' : 'rgba(255,255,255,0.14)'}`,
            background:   open ? 'rgba(129,140,248,0.12)' : 'rgba(255,255,255,0.06)',
            cursor:       'pointer',
            touchAction:  'manipulation',
            transition:   'background 180ms ease, border-color 180ms ease',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {FLAGS[lang]}
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{
            position:           'absolute',
            top:                'calc(100% + 8px)',
            right:              0,
            background:         'rgba(7,7,26,0.97)',
            border:             '1px solid rgba(255,255,255,0.10)',
            borderRadius:       12,
            padding:            '4px',
            backdropFilter:     'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            minWidth:           152,
            zIndex:             300,
            boxShadow:          '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(129,140,248,0.08)',
          }}>
            {LANGS.map((l) => {
              const active = lang === l;
              return (
                <button
                  key={l}
                  onClick={() => { setLang(l); setOpen(false); }}
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            10,
                    width:          '100%',
                    padding:        '10px 12px',
                    borderRadius:   8,
                    border:         'none',
                    cursor:         'pointer',
                    background:     active ? 'rgba(129,140,248,0.15)' : 'transparent',
                    color:          active ? '#818cf8' : 'rgba(255,255,255,0.72)',
                    fontFamily:     "'Space Grotesk', sans-serif",
                    fontSize:       '0.875rem',
                    fontWeight:     active ? 600 : 400,
                    touchAction:    'manipulation',
                    transition:     'background 150ms ease, color 150ms ease',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  {FLAGS[l]}
                  <span>{NAMES[l]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ── Pill variants: nav (desktop) and mobile (drawer) ── */
  const isMobile = variant === 'mobile';

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Select language"
      className={className}
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          2,
        background:   'rgba(255,255,255,0.06)',
        border:       '1px solid rgba(255,255,255,0.10)',
        borderRadius: 999,
        padding:      isMobile ? '3px' : '2px',
      }}
    >
      {LANGS.map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-label={`Switch to ${NAMES[l]}`}
            aria-pressed={active}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          isMobile ? 6 : 4,
              padding:      isMobile ? '8px 14px' : '4px 10px',
              borderRadius: 999,
              border:       'none',
              cursor:       'pointer',
              transition:   'background 180ms ease, color 180ms ease',
              background:   active ? 'rgba(255,255,255,0.14)' : 'transparent',
              color:        active ? '#ffffff' : 'rgba(255,255,255,0.40)',
              fontFamily:   "'JetBrains Mono', monospace",
              fontSize:     isMobile ? '0.72rem' : '0.60rem',
              fontWeight:   active ? 600 : 400,
              letterSpacing: '0.10em',
              minHeight:    isMobile ? 44 : 0,
              touchAction:  'manipulation',
              userSelect:   'none',
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
