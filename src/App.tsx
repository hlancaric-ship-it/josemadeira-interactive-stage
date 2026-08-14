import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAudioStore } from './store/audioStore';
import { useKonamiCode } from './hooks/useKonamiCode';
import { useAfterHours } from './hooks/useAfterHours';
import { BackgroundPhotos } from './components/BackgroundPhotos';
import { StageAtmosphere } from './components/StageAtmosphere';
import { BottomSpectrum } from './components/BottomSpectrum';
import { LiveBanner } from './components/LiveBanner';
import { FeedSection } from './components/FeedSection';
import { GallerySection } from './components/GallerySection';
import { HorizontalStage } from './components/HorizontalStage';
import { GlowLogo } from './components/GlowLogo';
import { Hero } from './components/Hero';
import { Preloader } from './components/Preloader';
import { GlitchOverlay } from './components/GlitchOverlay';
import { AudioControls } from './components/AudioControls';
import { SoundCloudPlayer } from './components/SoundCloudPlayer';
import { MainNav } from './components/MainNav';
import { useLangStore } from './store/langStore';
import { translations } from './i18n/translations';
import joseAvatar from './assets/jose-avatar.jpg';

const tourDates = [
  { id: '1', city: 'PRAGUE', venue: 'Studio 54', date: '16.08', country: 'CZ' },
  { id: '2', city: 'PRAGUE', venue: 'Studio 54', date: '30.08', country: 'CZ' },
];

const BPMStats = () => {
  const { bpm, frequency, isPlaying } = useAudioStore();
  const { isAfterHours } = useAfterHours();
  const { lang } = useLangStore();
  const t = translations[lang];

  return (
    <>
      {/* Desktop: full readout */}
      <div className="fixed top-6 right-6 z-40 hidden lg:block">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#C81E2C] animate-pulse' : 'bg-white/20'}`} />
            <span className="mono text-[10px] text-white/50 tracking-[3px]">{isPlaying ? t.liveFeed : t.standby}</span>
            {isAfterHours && <span className="mono text-[10px] text-[#C81E2C] tracking-[2px] ml-2">{t.afterHours}</span>}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="mono text-xs text-white/50">BPM</span>
            <span className="text-5xl font-black tabular-nums tracking-[-2px]">{bpm}</span>
          </div>
          <div className="mt-2 h-px bg-white/10 w-full" />
          <div className="flex justify-between items-center mt-2">
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
          <span className="mono text-[9px] text-white/50 tracking-[1px]">BPM</span>
          <span className="text-lg font-black tabular-nums tracking-[-1px] leading-none">{bpm}</span>
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
    <section className="relative z-30 max-w-6xl mx-auto px-8 pb-44 pt-16 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.movement.year}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="text-5xl sm:text-6xl md:text-8xl lg:text-6xl font-black tracking-[-2px] md:tracking-[-5px] mb-10 md:mb-16 lg:mb-4"
      >
        {t.movement.title}
      </motion.h2>

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
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-44 sm:pb-28 pt-16 sm:pt-24 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-14 md:gap-20 lg:gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-5 sm:mb-7 lg:mb-3">{t.origins.label}</div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-4xl font-bold tracking-[-1px] md:tracking-[-2px] mb-6 sm:mb-10 lg:mb-4">{t.origins.title1}<br/>{t.origins.title2}</h2>
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
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-44 sm:pb-28 pt-16 sm:pt-24 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.collab.eyebrow}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="text-4xl sm:text-5xl md:text-8xl lg:text-5xl font-black tracking-[-1px] md:tracking-[-3px] mb-10 md:mb-16 lg:mb-6"
      >
        {t.collab.title}
      </motion.h2>

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
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-44 sm:pb-28 pt-16 sm:pt-24 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.streaming.eyebrow}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="text-4xl sm:text-5xl md:text-8xl lg:text-5xl font-black tracking-[-1px] md:tracking-[-3px] mb-8 md:mb-16 lg:mb-4"
      >
        {t.streaming.title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-4 max-w-4xl">
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

const MusicSection = () => {
  const { sounds, currentIndex, isPlaying, playIndex } = useAudioStore();
  const { lang } = useLangStore();
  const t = translations[lang];

  const visible = sounds.slice(0, 6);

  return (
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-44 sm:pb-36 pt-16 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.discography.label}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="text-4xl sm:text-5xl md:text-8xl lg:text-5xl font-black tracking-[-1px] md:tracking-[-3px] mb-10 md:mb-16 lg:mb-4"
      >
        {t.discography.title}
      </motion.h2>

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
    <div className={`relative min-h-screen bg-[#0A0808] text-white ${isAfterHours ? 'after-hours' : ''}`}>
      <BackgroundPhotos />
      <StageAtmosphere />
      <BottomSpectrum />
      <LiveBanner />

      <BPMStats />
      <GlitchOverlay active={showGlitch} />
      <AudioControls />

      <MainNav />

      <HorizontalStage>
        {/* Main hero title — asymmetric composition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          id="panel-hero"
          className="hstage-panel relative z-20 min-h-[100vh] px-6 md:px-16 pt-28 pb-32 sm:pt-32 sm:pb-40 md:pt-36 md:pb-56 group"
        >
          {/* oversized ghost numeral for asymmetric depth */}
          <div className="pointer-events-none select-none absolute top-[6%] right-[4%] text-[240px] md:text-[420px] font-black leading-none text-white/[0.025] hidden md:block">
            54
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-y-14 items-center justify-items-center min-h-[60vh]">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mono text-[11px] tracking-[5px] text-[#C81E2C] mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C81E2C] shadow-[0_0_8px_#C81E2C]" />
                {t.liveOnSoundcloud}
              </div>

              <GlowLogo className="w-full max-w-[560px] mx-auto lg:mx-0 transition-transform duration-700 group-hover:scale-[1.03]" />

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-xs mono tracking-[3px] text-white/45">
                <div className="w-12 h-px bg-gradient-to-r from-[#C9A227] via-[#C81E2C] to-transparent" />
                {t.audioReactiveStage}
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

        {/* Live feed from Telegram */}
        <div id="panel-feed" className="hstage-panel"><FeedSection /></div>

        {/* Photo/video gallery from IG/FB/TikTok, synced via Telegram */}
        <div id="panel-gallery" className="hstage-panel"><GallerySection /></div>
      </HorizontalStage>

      {/* Footer — pinned outside the horizontal scroll, not one of the panels */}
      <footer className="relative lg:fixed lg:bottom-0 lg:left-0 lg:right-0 z-30 border-t border-white/5 py-12 lg:py-4 px-8 flex flex-col md:flex-row justify-between items-center text-[10px] mono tracking-[4px] text-gray-500 bg-black/40 backdrop-blur-md">
        <div>{t.footer.rights}</div>
        <div className="flex gap-10 mt-6 md:mt-0">
          <a href="https://www.facebook.com/josemadeiraofficialnew/" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">FACEBOOK</a>
          <a href="https://soundcloud.com/josemadeiraofficial" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">SOUNDCLOUD</a>
          <a href="https://www.instagram.com/josemadeiraofficialnew" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">INSTAGRAM</a>
          <a href="https://www.youtube.com/@josemadeiraofficial" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">YOUTUBE</a>
          <a href="https://open.spotify.com/artist/0Gr1t69ZXhohsB8dwj4sLr" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">SPOTIFY</a>
          <a href="https://music.apple.com/cz/artist/josemadeira/1814103021" target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">APPLE MUSIC</a>
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
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);

  return (
    <>
      <SoundCloudPlayer />

      <AnimatePresence>
        {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {loaded && !entered && (
          <Hero onEnter={() => setEntered(true)} />
        )}
      </AnimatePresence>

      {entered && <MainStage />}

      {entered && <div className="fixed inset-0 z-[1] pointer-events-none grain" style={{ opacity: 0.06, backgroundSize: '2px 2px' }} />}
    </>
  );
}
