import { useEffect } from 'react';
import { useSecretStore } from '../store/secretStore';

export const useKonamiCode = () => {
  const { showGlitch, unlocked, unlock, hideGlitch } = useSecretStore();

  useEffect(() => {
    let seq: string[] = [];
    const target = ['m', 'a', 'd', 'e', 'i', 'r', 'a'];

    const handler = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (!k.match(/[a-z]/)) return;
      seq = [...seq, k].slice(-target.length);
      if (seq.join('') === target.join('')) {
        unlock();
        setTimeout(hideGlitch, 4000);
        seq = [];
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [unlock, hideGlitch]);

  return { showGlitch, unlocked };
};
