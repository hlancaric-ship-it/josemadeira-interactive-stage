import { create } from 'zustand';

interface SecretStore {
  unlocked: boolean;
  showGlitch: boolean;
  unlock: () => void;
  hideGlitch: () => void;
}

const stored = typeof window !== 'undefined' ? localStorage.getItem('madeira_secret') === '1' : false;

export const useSecretStore = create<SecretStore>((set) => ({
  unlocked: stored,
  showGlitch: false,
  unlock: () => {
    localStorage.setItem('madeira_secret', '1');
    set({ unlocked: true, showGlitch: true });
  },
  hideGlitch: () => set({ showGlitch: false }),
}));
