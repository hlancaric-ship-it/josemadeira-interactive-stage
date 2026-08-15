import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAudioStore } from '../store/audioStore';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';
import joseAvatar from '../assets/jose-avatar.jpg';

const Coin = () => (
  <div className="coin-flip">
    <div className="portrait-ring" />
    <img
      src={joseAvatar}
      alt="Jose Madeira"
      className="w-full aspect-square rounded-full object-cover border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
    />
  </div>
);

export const Preloader = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const hardStart = useAudioStore((s) => s.hardStart);
  const { lang } = useLangStore();
  const t = translations[lang];

  useEffect(() => {
    let raf: number;
    let p = 0;
    let loaded = document.readyState === 'complete';
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener('load', onLoad);

    const start = performance.now();
    const tick = (t: number) => {
      const elapsed = t - start;
      // Real page load finishes it; otherwise creep toward 92% so it never looks "done" too early
      const target = loaded ? 100 : Math.min(92, elapsed / 18);
      p += (target - p) * 0.1;

      if (p >= 99.3) {
        setProgress(100);
        window.removeEventListener('load', onLoad);
        setReady(true);
        return;
      }
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('load', onLoad);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleEnter = () => {
    hardStart();
    onDone();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#0A0808] flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -520, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 130, damping: 15, mass: 1.2 }}
        className="portrait-wrap w-[220px] relative"
      >
        {/* Dim base layer, always fully visible at 35% */}
        <div className="opacity-35">
          <Coin />
        </div>

        {/* Full-opacity layer, revealed bottom-up as loading progresses */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
        >
          <Coin />
        </div>
      </motion.div>

      {!ready ? (
        <div className="mt-12 mono text-xs tracking-[4px] text-white/50 tabular-nums">
          LOADING {Math.round(progress)}%
        </div>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleEnter}
          className="mt-12 px-10 sm:px-12 py-4 sm:py-[19px] bg-[#C81E2C] text-white text-sm mono tracking-[3px] uppercase font-bold hover:bg-[#A91824] active:scale-[0.985] transition-all shadow-[0_10px_30px_rgba(200,30,44,0.35)]"
        >
          {t.enterVibe}
        </motion.button>
      )}
    </motion.div>
  );
};
