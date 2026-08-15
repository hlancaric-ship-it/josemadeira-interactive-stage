import { create } from 'zustand';

export type CookieConsent = 'accepted' | 'declined' | null;

interface CookieConsentStore {
  consent: CookieConsent;
  accept: () => void;
  decline: () => void;
}

const stored = typeof window !== 'undefined' ? (localStorage.getItem('madeira_cookie_consent') as CookieConsent) : null;

export const useCookieConsentStore = create<CookieConsentStore>((set) => ({
  consent: stored === 'accepted' || stored === 'declined' ? stored : null,
  accept: () => {
    localStorage.setItem('madeira_cookie_consent', 'accepted');
    set({ consent: 'accepted' });
  },
  decline: () => {
    localStorage.setItem('madeira_cookie_consent', 'declined');
    set({ consent: 'declined' });
  },
}));
