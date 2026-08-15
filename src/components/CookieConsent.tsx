import { useCookieConsentStore } from '../store/cookieConsentStore';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';

export const CookieConsent = () => {
  const { consent, accept, decline } = useCookieConsentStore();
  const { lang } = useLangStore();
  const t = translations[lang].cookies;

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-md border-t border-[#C81E2C]/30 px-5 py-4 sm:px-8 sm:py-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
        <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed flex-1 text-center sm:text-left">
          {t.text}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-5 py-2.5 mono text-[11px] tracking-[2px] text-white/50 border border-white/15 hover:border-white/30 hover:text-white/80 transition-colors"
          >
            {t.decline}
          </button>
          <button
            onClick={accept}
            className="px-6 py-2.5 bg-[#C81E2C] text-white mono text-[11px] tracking-[2px] font-bold hover:bg-[#A91824] transition-colors"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
};
