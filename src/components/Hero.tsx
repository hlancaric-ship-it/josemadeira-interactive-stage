import { useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useAudioStore } from '../store/audioStore';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';
import { LangSwitch } from './LangSwitch';
import { GlowLogo } from './GlowLogo';
import joseAvatar from '../assets/jose-avatar.jpg';
import logoReal from '../assets/logo-real.svg';

export const Hero = ({ onEnter }: { onEnter: () => void }) => {
  const [, setEntering] = useState(false);
  const { hardStart } = useAudioStore();
  const { lang } = useLangStore();
  const t = translations[lang];

  const handleEnter = async () => {
    setEntering(true);
    hardStart();

    const tl = gsap.timeline({ onComplete: onEnter });

    tl.to('.hero-overlay', {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.4,
      ease: 'power4.inOut',
    })
    .to('.hero-inner', {
      opacity: 0,
      scale: 1.15,
      filter: 'blur(18px)',
      duration: 0.9,
      ease: 'power3.in',
    }, '-=1.1');
  };

  return (
    <div className="hero-overlay" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
      <nav className="hidden sm:grid fixed top-0 left-0 right-0 z-10 grid-cols-[1fr_auto_1fr] items-center px-5 py-5 sm:px-8 sm:py-7 mono text-[11px] tracking-[3px] text-white/50">
        <span />
        <img src={logoReal} alt="Jose Madeira" className="justify-self-center h-3 w-auto opacity-90" />
        <div className="flex items-center justify-end gap-8">
          <div className="hidden sm:flex gap-8">
            <span className="hover:text-[#C81E2C] transition-colors">{t.nav.tour}</span>
            <span className="hover:text-[#C81E2C] transition-colors">{t.nav.music}</span>
            <span className="hover:text-[#C81E2C] transition-colors">{t.nav.about}</span>
            <span className="hover:text-[#C81E2C] transition-colors">{t.nav.soundcloud}</span>
          </div>
          <LangSwitch />
        </div>
      </nav>

      <div className="hero-inner grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] items-center gap-10 sm:gap-14 md:gap-20 max-w-6xl w-full px-6 sm:px-8">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 mono text-[11px] sm:text-[13px] tracking-[3px] sm:tracking-[5px] text-[#C81E2C] mb-5 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C81E2C] shadow-[0_0_8px_#C81E2C]" />
            {t.liveOnSoundcloud}
          </div>

          <h1 className="mb-5">
            <GlowLogo className="w-full max-w-[520px] mx-auto md:mx-0" />
          </h1>

          <p className="max-w-[50ch] mx-auto md:mx-0 text-white/60 font-light text-base sm:text-[18px] leading-relaxed mb-8 sm:mb-10">
            {t.bio}
          </p>

          <div className="h-px bg-white/10 mb-8 sm:mb-10" />

          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto md:mx-0 mb-10 sm:mb-12">
            <div>
              <div className="stat-label text-[10px] sm:text-[12px]">{t.stats.genre}</div>
              <div className="stat-value text-base sm:text-lg">{t.stats.genreValue}</div>
            </div>
            <div>
              <div className="stat-label text-[10px] sm:text-[12px]">{t.stats.residency}</div>
              <div className="stat-value text-base sm:text-lg">{t.stats.residencyValue}</div>
            </div>
            <div>
              <div className="stat-label text-[10px] sm:text-[12px]">{t.stats.basedIn}</div>
              <div className="stat-value text-base sm:text-lg">{t.stats.basedInValue}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-5 sm:gap-8">
            <button
              onClick={handleEnter}
              className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-[19px] bg-[#C81E2C] text-white text-sm mono tracking-[3px] uppercase font-bold hover:bg-[#A91824] active:scale-[0.985] transition-all shadow-[0_10px_30px_rgba(200,30,44,0.35)]"
            >
              {t.enterVibe}
            </button>
            <LangSwitch />
          </div>
        </div>

        <motion.div
          initial={{ y: -460, scale: 0.2, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 110, damping: 13, mass: 1.3, delay: 0.2 }}
          className="portrait-wrap justify-self-center w-[220px] sm:w-[300px] md:w-[380px] relative"
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.85 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 mono text-[10px] tracking-[4px] text-white/50 whitespace-nowrap"
          >
            LOADING
          </motion.div>
          <div className="coin-flip">
            <div className="portrait-ring" />
            <img
              src={joseAvatar}
              alt="Jose Madeira"
              className="w-full aspect-square rounded-full object-cover border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
