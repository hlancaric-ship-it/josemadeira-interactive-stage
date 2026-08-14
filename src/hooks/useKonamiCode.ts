import { useEffect, useState } from 'react';

export const useKonamiCode = () => {
  const [showGlitch, setShowGlitch] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('madeira_secret') === '1') {
      setUnlocked(true);
    }

    let seq: string[] = [];
    const target = ['m', 'a', 'd', 'e', 'i', 'r', 'a'];

    const handler = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (!k.match(/[a-z]/)) return;
      seq = [...seq, k].slice(-target.length);
      if (seq.join('') === target.join('')) {
        setShowGlitch(true);
        setUnlocked(true);
        localStorage.setItem('madeira_secret', '1');
        setTimeout(() => setShowGlitch(false), 2100);
        seq = [];
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return { showGlitch, unlocked };
};
