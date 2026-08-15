import { useEffect, useState } from 'react';
import { useSecretStore } from '../store/secretStore';

export const useAfterHours = () => {
  const unlocked = useSecretStore((s) => s.unlocked);
  const [isAfterHours, setIsAfterHours] = useState(false);

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      const timeActive = h >= 2 && h < 5;
      // Finding the "madeira" secret grants permanent after-hours access,
      // not just the 2am-5am window.
      const active = unlocked || timeActive;
      setIsAfterHours(active);

      if (active) {
        document.documentElement.classList.add('after-hours');
      } else {
        document.documentElement.classList.remove('after-hours');
      }
    };
    check();
    const iv = setInterval(check, 60000);
    return () => clearInterval(iv);
  }, [unlocked]);

  return { isAfterHours };
};
