import { useEffect, useState } from 'react';

export const useAfterHours = () => {
  const [isAfterHours, setIsAfterHours] = useState(false);

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      const active = h >= 2 && h < 5;
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
  }, []);

  return { isAfterHours };
};
