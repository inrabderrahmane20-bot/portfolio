import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Lang, T } from '@/lib/translations';

interface LangCtx {
  lang:   Lang;
  setLang: (l: Lang) => void;
  t:       (key: string) => string;
}

const Ctx = createContext<LangCtx>({
  lang:    'en',
  setLang: () => {},
  t:       (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  /* Restore saved preference */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('ac-lang') as Lang | null;
    if (saved && ['en', 'fr', 'es'].includes(saved)) setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('ac-lang', l);
  }, []);

  /* Look up key; fallback to English then to the raw key */
  const t = useCallback((key: string): string =>
    T[lang][key] ?? T['en'][key] ?? key,
  [lang]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLanguage = () => useContext(Ctx);
