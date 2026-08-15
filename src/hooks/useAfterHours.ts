import { useEffect, useState } from 'react';
import { useSecretStore } from '../store/secretStore';

export const useAfterHours = () => {
  const unlocked = useSecretStore((s) => s.unlocked);
  const [isAfterHours, setIsAfterHours] = useState(false);

  useEffect(() => {
    // Deliberately does NOT touch document.documentElement: a `filter` on any
    // ancestor (including <html>) creates a new containing block for
    // `position: fixed` descendants, which broke the fixed nav/hamburger
    // site-wide. Callers apply the `.after-hours` class themselves, scoped
    // to an element that has no fixed-positioned descendants.
    const check = () => {
      const h = new Date().getHours();
      const timeActive = h >= 2 && h < 5;
      // Finding the "madeira" secret grants permanent after-hours access,
      // not just the 2am-5am window.
      setIsAfterHours(unlocked || timeActive);
    };
    check();
    const iv = setInterval(check, 60000);
    return () => clearInterval(iv);
  }, [unlocked]);

  return { isAfterHours };
};
