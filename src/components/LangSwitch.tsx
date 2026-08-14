import { useLangStore } from '../store/langStore';

export const LangSwitch = () => {
  const { lang, setLang } = useLangStore();

  return (
    <div className="flex items-center gap-1 mono text-[11px] tracking-[2px]">
      <button
        onClick={() => setLang('cs')}
        className={`px-1.5 transition-colors ${lang === 'cs' ? 'text-[#C81E2C]' : 'text-white/40 hover:text-white/70'}`}
      >
        CZ
      </button>
      <span className="text-white/20">/</span>
      <button
        onClick={() => setLang('en')}
        className={`px-1.5 transition-colors ${lang === 'en' ? 'text-[#C81E2C]' : 'text-white/40 hover:text-white/70'}`}
      >
        EN
      </button>
    </div>
  );
};
