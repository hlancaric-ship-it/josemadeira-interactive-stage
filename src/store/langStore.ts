import { create } from 'zustand';

export type Lang = 'cs' | 'en';

interface LangStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

const stored = typeof window !== 'undefined' ? (localStorage.getItem('madeira_lang') as Lang | null) : null;

export const useLangStore = create<LangStore>((set, get) => ({
  lang: stored === 'en' ? 'en' : 'cs',
  setLang: (lang) => {
    localStorage.setItem('madeira_lang', lang);
    set({ lang });
  },
  toggle: () => {
    const next = get().lang === 'cs' ? 'en' : 'cs';
    localStorage.setItem('madeira_lang', next);
    set({ lang: next });
  },
}));
