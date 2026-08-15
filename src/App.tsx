import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAudioStore } from './store/audioStore';
import { useKonamiCode } from './hooks/useKonamiCode';
import { useAfterHours } from './hooks/useAfterHours';
import { BackgroundPhotos } from './components/BackgroundPhotos';
import { StageAtmosphere } from './components/StageAtmosphere';
import { BottomSpectrum } from './components/BottomSpectrum';
import { LiveBanner } from './components/LiveBanner';
import { GallerySection } from './components/GallerySection';
import { HorizontalStage } from './components/HorizontalStage';
import { GlowLogo } from './components/GlowLogo';
import { Preloader } from './components/Preloader';
import { GlitchOverlay } from './components/GlitchOverlay';
import { AudioControls } from './components/AudioControls';
import { SoundCloudPlayer } from './components/SoundCloudPlayer';
import { ScrollShrinkHeading } from './components/ScrollShrinkHeading';
import { CookieConsent } from './components/CookieConsent';
import { useCookieConsentStore } from './store/cookieConsentStore';
import { MainNav } from './components/MainNav';
import { useLangStore } from './store/langStore';
import { translations } from './i18n/translations';
import joseAvatar from './assets/jose-avatar.jpg';

const socialLinks = [
  {
    key: 'facebook',
    href: 'https://www.facebook.com/josemadeiraofficialnew/',
    icon: (
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.2-1.5 1.5-1.5H16.5V4.2C16.2 4.2 15.2 4 14 4c-2.5 0-4 1.5-4 4.3V10.5H7.5v3H10V21h3.5z" />
    ),
  },
  {
    key: 'soundcloud',
    href: 'https://soundcloud.com/josemadeiraofficial',
    icon: (
      <path d="M9 17V9.5a.5.5 0 0 0-1 0V17h1zm-2.3 0v-5.8a.4.4 0 0 0-.8 0V17h.8zm4.6 0V8a.5.5 0 0 0-1 0v9h1zm2.3 0v-9a.5.5 0 0 0-1 0v9h1zm2.4 0v-6.5c0-2 1.6-3.5 3.6-3.5 1.9 0 3.5 1.5 3.6 3.4a2.9 2.9 0 0 1 1-.2c1.6 0 2.8 1.3 2.8 2.9 0 1.5-1.2 2.8-2.7 2.9H16z" />
    ),
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/josemadeiraofficialnew',
    icon: (
      <path d="M12 4c-2.2 0-2.5 0-3.4.05-.9.05-1.5.2-2 .4a4 4 0 0 0-1.5 1 4 4 0 0 0-1 1.5c-.2.5-.35 1.1-.4 2C3.65 9.9 3.65 10.2 3.65 12s0 2.1.05 3.05c.05.9.2 1.5.4 2a4 4 0 0 0 1 1.5 4 4 0 0 0 1.5 1c.5.2 1.1.35 2 .4.9.05 1.2.05 3.4.05s2.5 0 3.4-.05c.9-.05 1.5-.2 2-.4a4 4 0 0 0 1.5-1 4 4 0 0 0 1-1.5c.2-.5.35-1.1.4-2 .05-.95.05-1.25.05-3.05s0-2.1-.05-3.05c-.05-.9-.2-1.5-.4-2a4 4 0 0 0-1-1.5 4 4 0 0 0-1.5-1c-.5-.2-1.1-.35-2-.4C14.5 4 14.2 4 12 4zm0 1.8c2.15 0 2.4 0 3.3.05.8.04 1.2.16 1.5.28.37.14.63.31.9.58.27.27.44.53.58.9.12.3.24.7.28 1.5.05.9.05 1.15.05 3.3s0 2.4-.05 3.3c-.04.8-.16 1.2-.28 1.5-.14.37-.31.63-.58.9-.27.27-.53.44-.9.58-.3.12-.7.24-1.5.28-.9.05-1.15.05-3.3.05s-2.4 0-3.3-.05c-.8-.04-1.2-.16-1.5-.28a2.4 2.4 0 0 1-.9-.58 2.4 2.4 0 0 1-.58-.9c-.12-.3-.24-.7-.28-1.5-.05-.9-.05-1.15-.05-3.3s0-2.4.05-3.3c.04-.8.16-1.2.28-1.5.14-.37.31-.63.58-.9.27-.27.53-.44.9-.58.3-.12.7-.24 1.5-.28.9-.05 1.15-.05 3.3-.05zm0 3.1a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2zm0 5.1a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.95-5.3a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" />
    ),
  },
  {
    key: 'youtube',
    href: 'https://www.youtube.com/@josemadeiraofficial',
    icon: (
      <path d="M21.6 8.3a2.6 2.6 0 0 0-1.8-1.8C18.1 6 12 6 12 6s-6.1 0-7.8.5a2.6 2.6 0 0 0-1.8 1.8C2 10 2 12 2 12s0 2 .4 3.7c.2.9.9 1.6 1.8 1.8C5.9 18 12 18 12 18s6.1 0 7.8-.5a2.6 2.6 0 0 0 1.8-1.8c.4-1.7.4-3.7.4-3.7s0-2-.4-3.7zM10 15V9l5.2 3-5.2 3z" />
    ),
  },
  {
    key: 'spotify',
    href: 'https://open.spotify.com/artist/0Gr1t69ZXhohsB8dwj4sLr',
    icon: (
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4a.6.6 0 0 1-.85.2c-2.3-1.4-5.3-1.75-8.7-.95a.62.62 0 1 1-.3-1.2c3.75-.85 7-.45 9.6 1.1.3.2.4.6.25.85zm1.2-2.75a.75.75 0 0 1-1.05.25c-2.65-1.6-6.7-2.1-9.8-1.15a.78.78 0 0 1-.45-1.5c3.55-1.1 8-.55 11.05 1.35.35.2.5.7.25 1.05zm.1-2.85C14.5 8.9 9.5 8.7 6.6 9.6a.9.9 0 1 1-.55-1.75c3.35-1 8.9-.8 12.4 1.25a.93.93 0 0 1-.55 1.7z" />
    ),
  },
  {
    key: 'appleMusic',
    href: 'https://music.apple.com/cz/artist/josemadeira/1814103021',
    icon: (
      <path d="M16.7 4.3c-.35.4-.9.7-1.45.65a1.85 1.85 0 0 1 .5-1.45c.35-.4.95-.7 1.45-.7.05.55-.15 1.1-.5 1.5zM17.2 5.5c-.8-.05-1.5.45-1.9.45-.4 0-1-.4-1.65-.4-.85 0-1.65.5-2.1 1.25-.9 1.55-.25 3.85.65 5.1.45.6.95 1.3 1.65 1.28.65-.03.9-.42 1.7-.42.8 0 1 .42 1.7.4.7-.02 1.15-.62 1.6-1.22.5-.7.7-1.35.7-1.4-.02 0-1.35-.5-1.35-2 0-1.25 1-1.85 1.05-1.9-.6-.85-1.5-.95-1.85-.95v-.19zM10.5 8v9.3c0 .55-.4.95-.95.95-.5 0-.9-.4-.9-.9s.4-.9.9-.9c.1 0 .2 0 .3.03V9l-2.7.55v6.75c0 .55-.4.95-.9.95-.5 0-.9-.4-.9-.9s.4-.9.9-.9c.1 0 .2 0 .3.03V9l4.85-1v.5-.5z" />
    ),
  },
] as const;

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    {children}
  </svg>
);

const tourDates = [
  { id: '1', city: 'PRAGUE', venue: 'Studio 54', date: '16.08', country: 'CZ' },
  { id: '2', city: 'PRAGUE', venue: 'Studio 54', date: '30.08', country: 'CZ' },
];

const BPMStats = () => {
  const { frequency, isPlaying } = useAudioStore();
  const { isAfterHours } = useAfterHours();
  const { lang } = useLangStore();
  const t = translations[lang];

  return (
    <>
      {/* Desktop: full readout */}
      <div className="fixed top-6 right-6 z-40 hidden lg:block">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-sm">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#C81E2C] animate-pulse' : 'bg-white/20'}`} />
            <span className="mono text-[10px] text-white/50 tracking-[3px]">{isPlaying ? t.liveFeed : t.standby}</span>
            {isAfterHours && <span className="mono text-[10px] text-[#C81E2C] tracking-[2px] ml-2">{t.afterHours}</span>}
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="mono text-[10px] text-white/50">BASS</span>
            <div className="w-24 h-[2px] bg-white/10 rounded overflow-hidden">
              <div
                className="h-full bg-[#C81E2C] transition-all duration-75"
                style={{ width: `${Math.min(frequency * 110, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/tablet: compact pill, tucked under the top nav */}
      <div className="fixed top-[64px] right-4 z-40 lg:hidden">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-sm flex items-center gap-2.5">
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPlaying ? 'bg-[#C81E2C] animate-pulse' : 'bg-white/20'}`} />
          <span className="mono text-[9px] text-white/50 tracking-[1px]">{isPlaying ? t.liveFeed : t.standby}</span>
        </div>
      </div>
    </>
  );
};

const TourSection = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const { lang } = useLangStore();
  const t = translations[lang];

  return (
    <section className="relative z-30 max-w-6xl mx-auto px-8 pb-14 pt-8 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.movement.year}
      </motion.div>
      <ScrollShrinkHeading className="text-6xl font-black tracking-[-2px] mb-10">
        {t.movement.title}
      </ScrollShrinkHeading>

      <div className="grid grid-cols-2 gap-3 sm:block sm:space-y-[1px] sm:gap-0">
        {tourDates.map((date, i) => (
          <motion.div
            key={date.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="tour-card group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-4 py-5 sm:px-8 sm:py-8 md:px-10 md:py-9 lg:px-6 lg:py-2.5 bg-[#111] hover:bg-[#1a1010] border-l-4 border-transparent hover:border-[#C81E2C] transition-all overflow-hidden"
            onMouseEnter={() => setHovered(date.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 md:gap-14 lg:gap-6">
              <div className="mono text-3xl sm:text-5xl md:text-6xl lg:text-3xl font-black text-white/90 tabular-nums tracking-[-1px] md:tracking-[-2px] sm:w-[110px] md:w-[130px] lg:w-[80px] transition-transform duration-500 group-hover:scale-110">{date.date}</div>
              <div>
                <div className="text-xl sm:text-3xl md:text-5xl lg:text-2xl font-bold tracking-[-0.5px] md:tracking-[-1.5px] group-hover:text-[#C81E2C] transition-all duration-300">{date.city}</div>
                <div className="mono text-xs sm:text-base lg:text-xs text-gray-500 mt-1 transition-colors group-hover:text-white/70">{date.venue}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-5 self-start sm:self-auto">
              <div className="mono text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 border border-white/20 text-gray-400">{date.country}</div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-8 lg:h-8 border border-[#C81E2C]/70 rounded-full flex items-center justify-center text-[#C81E2C] text-lg group-hover:rotate-45 transition-transform">
                →
              </div>
            </div>

            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${hovered === date.id ? 'opacity-100' : 'opacity-0'}`}
              style={{ background: 'radial-gradient(ellipse 70% 100% at 100% 50%, rgba(200,30,44,0.12), transparent 70%)' }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { lang } = useLangStore();
  const t = translations[lang];

  return (
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-14 sm:pb-28 pt-8 sm:pt-24 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-14 md:gap-20 lg:gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-5 sm:mb-7 lg:mb-3">{t.origins.label}</div>
          <ScrollShrinkHeading direction="right" className="text-6xl font-black tracking-[-2px] mb-6">{t.origins.title1}<br/>{t.origins.title2}</ScrollShrinkHeading>
          <div className="space-y-5 sm:space-y-7 lg:space-y-2 text-gray-400 font-light leading-relaxed text-base sm:text-lg md:text-xl lg:text-sm mb-8 sm:mb-12 lg:mb-4">
            <p>{t.origins.p1}</p>
            <p>{t.origins.p2}</p>
          </div>

          <div className="h-px bg-white/10 mb-8 sm:mb-10 lg:mb-4" />

          <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-3 max-w-lg mb-8 sm:mb-12 lg:mb-4">
            <div>
              <div className="stat-label text-[10px] sm:text-[12px]">{t.stats.genre}</div>
              <div className="stat-value text-base sm:text-lg lg:text-sm">{t.stats.genreValue}</div>
            </div>
            <div>
              <div className="stat-label text-[10px] sm:text-[12px]">{t.stats.residency}</div>
              <div className="stat-value text-base sm:text-lg lg:text-sm">{t.stats.residencyValue}</div>
            </div>
            <div>
              <div className="stat-label text-[10px] sm:text-[12px]">{t.stats.basedIn}</div>
              <div className="stat-value text-base sm:text-lg lg:text-sm">{t.stats.basedInValue}</div>
            </div>
          </div>

          <div className="h-px bg-white/10 mb-8 sm:mb-10 lg:mb-4" />

          <ul className="space-y-3 lg:space-y-1 mb-8 sm:mb-10 lg:mb-4">
            {t.origins.bioLines.map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-white/70 text-sm sm:text-base lg:text-xs">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C81E2C] shrink-0" />
                {line}
              </li>
            ))}
          </ul>

          <div className="mono text-xs tracking-[2px] text-white/40">
            {t.origins.bookingLabel}: <a href={`mailto:${t.origins.bookingEmail}`} className="text-white/70 hover:text-[#C81E2C] transition-colors">{t.origins.bookingEmail}</a>
          </div>
          <div className="mono text-xs tracking-[2px] text-white/40 mt-2">
            {t.label.tag}: <span className="text-white/70">{t.label.name}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="portrait-wrap justify-self-center w-[240px] sm:w-[300px] md:w-[360px] lg:w-[220px]"
        >
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
    </section>
  );
};

const CollaboratorsSection = () => {
  const { lang } = useLangStore();
  const t = translations[lang];

  return (
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-14 sm:pb-28 pt-8 sm:pt-24 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.collab.eyebrow}
      </motion.div>
      <ScrollShrinkHeading direction="left" className="text-6xl font-black tracking-[-2px] mb-10">
        {t.collab.title}
      </ScrollShrinkHeading>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <div className="mono text-xs tracking-[2px] text-[#C81E2C] mb-3">{t.collab.role}: {t.collab.name}</div>

        <div className="space-y-4 lg:space-y-3 text-gray-400 font-light leading-relaxed text-base sm:text-lg lg:text-sm mb-8 lg:mb-5">
          <p>{t.collab.p1}</p>
          <p>{t.collab.p2}</p>
        </div>

        <div className="h-px bg-white/10 mb-6 lg:mb-4" />

        <div className="grid grid-cols-2 gap-6 max-w-md mb-8 lg:mb-5">
          <div>
            <div className="stat-label text-[10px] sm:text-[12px]">{t.collab.releaseLabel}</div>
            <div className="stat-value text-base sm:text-lg lg:text-sm">{t.collab.releaseTitle}</div>
          </div>
          <div>
            <div className="stat-label text-[10px] sm:text-[12px]">{t.collab.labelTag}</div>
            <div className="stat-value text-base sm:text-lg lg:text-sm">{t.label.name}</div>
          </div>
        </div>

        <a
          href="https://www.housemagazine.cz/product-page/josemadeira-yan-lan-life-is-good"
          target="_blank"
          rel="noreferrer"
          className="inline-block mono text-xs px-5 py-3 border border-[#C81E2C]/70 text-[#C81E2C] hover:bg-[#C81E2C] hover:text-white transition-all"
        >
          {t.collab.cta} ↗
        </a>
      </motion.div>
    </section>
  );
};

const StreamingSection = () => {
  const { lang } = useLangStore();
  const t = translations[lang];

  return (
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-14 sm:pb-28 pt-8 sm:pt-24 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.streaming.eyebrow}
      </motion.div>
      <ScrollShrinkHeading direction="right" className="text-6xl font-black tracking-[-2px] mb-8">
        {t.streaming.title}
      </ScrollShrinkHeading>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="tour-card overflow-hidden p-1"
        >
          <iframe
            title="Spotify"
            style={{ borderRadius: 4 }}
            src="https://open.spotify.com/embed/artist/0Gr1t69ZXhohsB8dwj4sLr?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="tour-card overflow-hidden p-1"
        >
          <iframe
            title="Apple Music"
            allow="autoplay *; encrypted-media *;"
            frameBorder="0"
            height="352"
            style={{ width: '100%', overflow: 'hidden', background: 'transparent' }}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src="https://embed.music.apple.com/cz/artist/josemadeira/1814103021"
          />
        </motion.div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const { lang } = useLangStore();
  const t = translations[lang];

  return (
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-14 sm:pb-28 pt-8 sm:pt-24 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.contact.eyebrow}
      </motion.div>
      <ScrollShrinkHeading direction="left" className="text-6xl font-black tracking-[-2px] mb-8">
        {t.contact.title}
      </ScrollShrinkHeading>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <p className="text-gray-400 font-light leading-relaxed text-base sm:text-lg lg:text-sm mb-8 lg:mb-6">
          {t.contact.p1}
        </p>
        <a
          href={`mailto:${t.origins.bookingEmail}`}
          className="inline-block mono text-lg sm:text-2xl px-6 py-4 border border-[#C81E2C]/70 text-[#C81E2C] hover:bg-[#C81E2C] hover:text-white transition-all"
        >
          {t.origins.bookingEmail} ↗
        </a>
      </motion.div>
    </section>
  );
};

const MusicSection = () => {
  const { sounds, currentIndex, isPlaying, playIndex } = useAudioStore();
  const { lang } = useLangStore();
  const t = translations[lang];

  const visible = sounds.slice(0, 6);

  return (
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-14 sm:pb-36 pt-8 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.discography.label}
      </motion.div>
      <ScrollShrinkHeading direction="right" className="text-6xl font-black tracking-[-2px] mb-10">
        {t.discography.title}
      </ScrollShrinkHeading>

      {visible.length === 0 ? (
        <div className="mono text-sm text-gray-500 tracking-[2px]">{t.player.connecting}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 lg:gap-4">
          {visible.map((sound, i) => {
            const active = i === currentIndex;
            return (
              <motion.button
                key={sound.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => playIndex(i)}
                className={`tour-card relative p-4 sm:p-8 lg:p-4 flex flex-col justify-between aspect-square lg:aspect-[4/3] group text-left overflow-hidden transition-colors ${active ? 'border-[#C81E2C]' : ''}`}
              >
                {sound.artworkUrl && (
                  <div
                    className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity"
                    style={{
                      backgroundImage: `url('${sound.artworkUrl.replace('-large', '-t500x500')}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'grayscale(0.4)',
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

                <div className="relative flex justify-between items-start">
                  <div className="mono text-[10px] sm:text-sm text-[#C81E2C] tracking-[2px]">
                    {active && isPlaying ? t.player.live : sound.genre || '—'}
                  </div>
                  <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <span className="mono text-xs sm:text-sm">{active && isPlaying ? '❚❚' : '▶'}</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-sm sm:text-2xl font-bold tracking-tight mb-1 group-hover:text-[#C81E2C] transition-colors line-clamp-2">{sound.title}</div>
                  <div className="mono text-[10px] sm:text-sm text-gray-500 tracking-[1px]">JOSEMADEIRA</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </section>
  );
};

const MainStage = () => {
  const { showGlitch } = useKonamiCode();
  const { isAfterHours } = useAfterHours();
  const { lang } = useLangStore();
  const t = translations[lang];

  return (
    <div className="relative min-h-screen bg-[#0A0808] text-white">
      <BackgroundPhotos />
      <StageAtmosphere />
      <BottomSpectrum />
      <LiveBanner />

      <BPMStats />
      <GlitchOverlay active={showGlitch} />
      <AudioControls />

      <MainNav />

      <div className={isAfterHours ? 'after-hours' : ''}>
      <HorizontalStage>
        {/* Main hero title — asymmetric composition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          id="panel-hero"
          className="hstage-panel relative z-20 min-h-[90vh] lg:min-h-screen px-6 md:px-16 pt-24 pb-10 sm:pt-32 sm:pb-16 md:pt-36 md:pb-24 group flex flex-col justify-center -translate-y-16 sm:translate-y-0 lg:block lg:translate-y-0"
        >
          {/* oversized ghost numeral for asymmetric depth */}
          <div className="pointer-events-none select-none absolute top-[6%] right-[4%] text-[240px] md:text-[420px] font-black leading-none text-white/[0.025] hidden md:block">
            54
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-y-10 lg:gap-y-14 items-center justify-items-center lg:min-h-[60vh] relative">
            {/* Mobile: coin-flip portrait sits behind the logo, which flies over it on scroll */}
            <div className="lg:hidden absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ opacity: 0.8 }}>
              <div className="portrait-wrap w-[220px]">
                <div className="coin-flip">
                  <div className="portrait-ring" />
                  <img
                    src={joseAvatar}
                    alt="Jose Madeira"
                    className="w-full aspect-square rounded-full object-cover border border-[#C9A227]/25 shadow-[0_30px_70px_rgba(0,0,0,0.65)]"
                  />
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left relative z-10">
              <div className="inline-flex items-center gap-2 mono text-[11px] tracking-[5px] text-[#C81E2C] mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C81E2C] shadow-[0_0_8px_#C81E2C]" />
                {t.liveOnSoundcloud}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <GlowLogo className="w-full max-w-[560px] mx-auto lg:mx-0 transition-transform duration-700 group-hover:scale-[1.03]" />
              </motion.div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-xs mono tracking-[3px] text-white/45">
                <div className="w-12 h-px bg-gradient-to-r from-[#C9A227] via-[#C81E2C] to-transparent" />
                {t.audioReactiveStage}
              </div>

              {/* Mobile: social icons row, right under the hero instead of buried at the page bottom */}
              <div className="lg:hidden mt-[84px] flex items-center justify-center gap-5">
                {socialLinks.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.key}
                    className="w-8 h-8 text-white/50 hover:text-[#C81E2C] transition-colors"
                  >
                    <SocialIcon>{s.icon}</SocialIcon>
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="portrait-wrap w-[260px] xl:w-[300px]">
                <div className="coin-flip">
                  <div className="portrait-ring" />
                  <img
                    src={joseAvatar}
                    alt="Jose Madeira"
                    className="w-full aspect-square rounded-full object-cover border border-[#C9A227]/25 shadow-[0_30px_70px_rgba(0,0,0,0.65)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Movement - Tour */}
        <div id="panel-tour" className="hstage-panel"><TourSection /></div>

        {/* About & Origins */}
        <div id="panel-about" className="hstage-panel"><AboutSection /></div>

        {/* Collaborators */}
        <div id="panel-collab" className="hstage-panel"><CollaboratorsSection /></div>

        {/* Streaming widgets */}
        <div id="panel-streaming" className="hstage-panel"><StreamingSection /></div>

        {/* Discography */}
        <div id="panel-music" className="hstage-panel"><MusicSection /></div>

        {/* Contact */}
        <div id="panel-contact" className="hstage-panel"><ContactSection /></div>

        {/* Live feed from Telegram */}

        {/* Photo/video gallery from IG/FB/TikTok, synced via Telegram */}
        <div id="panel-gallery" className="hstage-panel"><GallerySection /></div>
      </HorizontalStage>
      </div>

      {/* Footer — pinned outside the horizontal scroll, not one of the panels */}
      <footer className="relative lg:fixed lg:bottom-0 lg:left-0 lg:right-0 z-[45] border-t border-white/5 py-12 lg:py-4 px-8 flex flex-col md:flex-row justify-between items-center text-[10px] mono tracking-[4px] text-gray-500 bg-black/70 backdrop-blur-md">
        <div>{t.footer.rights}</div>
        <div className="hidden lg:flex gap-10 mt-6 md:mt-0">
          <a href="https://www.facebook.com/josemadeiraofficialnew/" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">FACEBOOK</a>
          <a href="https://soundcloud.com/josemadeiraofficial" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">SOUNDCLOUD</a>
          <a href="https://www.instagram.com/josemadeiraofficialnew" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">INSTAGRAM</a>
          <a href="https://www.youtube.com/@josemadeiraofficial" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">YOUTUBE</a>
          <a href="https://open.spotify.com/artist/0Gr1t69ZXhohsB8dwj4sLr" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">SPOTIFY</a>
          <a href="https://music.apple.com/cz/artist/josemadeira/1814103021" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">APPLE MUSIC</a>
          <a href="https://www.studio54.cz/cs/dj/jose-madeira" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">STUDIO 54</a>
          <span className="text-white/30">{t.footer.location}</span>
        </div>
      </footer>

      {/* After hours notice */}
      {isAfterHours && (
        <div className="fixed bottom-8 left-8 z-40 mono text-xs text-[#C81E2C] tracking-[2px] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#C81E2C] rounded-full animate-pulse" /> {t.afterHours}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [entered, setEntered] = useState(false);
  const consent = useCookieConsentStore((s) => s.consent);

  return (
    <>
      {consent === 'accepted' && <SoundCloudPlayer />}
      <CookieConsent />

      <AnimatePresence>
        {!entered && <Preloader onDone={() => setEntered(true)} />}
      </AnimatePresence>

      {entered && <MainStage />}

      {entered && <div className="fixed inset-0 z-[1] pointer-events-none grain" style={{ opacity: 0.06, backgroundSize: '2px 2px' }} />}
    </>
  );
}
