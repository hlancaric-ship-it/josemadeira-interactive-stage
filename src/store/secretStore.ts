import { create } from 'zustand';

interface SecretStore {
  unlocked: boolean;
  showGlitch: boolean;
  unlock: () => void;
  hideGlitch: () => void;
}

// Session-only: unlocking "madeira" grants after-hours atmosphere for this
// visit, but resets back to normal on the next page load rather than
// persisting forever via localStorage.
export const useSecretStore = create<SecretStore>((set) => ({
  unlocked: false,
  showGlitch: false,
  unlock: () => set({ unlocked: true, showGlitch: true }),
  hideGlitch: () => set({ showGlitch: false }),
}));
