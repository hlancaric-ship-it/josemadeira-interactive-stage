import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';
import { LangSwitch } from './LangSwitch';
import logoReal from '../assets/logo-real.svg';

interface NavLink {
  key: string;
  panel: string;
}

const LINKS: NavLink[] = [
  { key: 'tour', panel: 'panel-tour' },
  { key: 'about', panel: 'panel-about' },
  { key: 'collab', panel: 'panel-collab' },
  { key: 'streaming', panel: 'panel-streaming' },
  { key: 'music', panel: 'panel-music' },
  { key: 'gallery', panel: 'panel-gallery' },
  { key: 'contact', panel: 'panel-contact' },
];

const jumpTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
};

export const MainNav = () => {
  const { lang } = useLangStore();
  const t = translations[lang];
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center px-5 py-4 sm:px-8 sm:py-6 mono text-xs tracking-[3px] text-gray-500 bg-[#0A0808]/70 backdrop-blur-md border-b border-white/5">
        {/* Desktop: full link list */}
        <div className="hidden lg:flex items-center gap-6">
          {LINKS.map((link) => (
            <button
              key={link.key}
              onClick={() => jumpTo(link.panel)}
              className="hover:text-[#C81E2C] transition-colors"
            >
              {t.nav[link.key as keyof typeof t.nav]}
            </button>
          ))}
        </div>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Menu"
          className="lg:hidden justify-self-start flex flex-col gap-[5px] p-1"
        >
          <span className="w-5 h-[2px] bg-white/70" />
          <span className="w-5 h-[2px] bg-white/70" />
          <span className="w-3.5 h-[2px] bg-white/70" />
        </button>

        <img src={logoReal} alt="Jose Madeira" className="justify-self-center h-3 w-auto opacity-90" />

        <div className="flex items-center justify-end gap-4 sm:gap-6">
          <span className="hidden sm:inline">{t.topNav.residency}</span>
          <LangSwitch />
        </div>
      </div>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0A0808] flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-5 right-5 text-white/60 text-3xl leading-none p-2"
            >
              ×
            </button>
            {LINKS.map((link, i) => (
              <motion.button
                key={link.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  jumpTo(link.panel);
                  setOpen(false);
                }}
                className="mono text-2xl tracking-[3px] text-white/80 hover:text-[#C81E2C] transition-colors"
              >
                {t.nav[link.key as keyof typeof t.nav]}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
