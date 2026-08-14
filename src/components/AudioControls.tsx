import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';
import { PROFILE_URL } from '../lib/soundcloud';

const formatTime = (ms: number) => {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const WAVE_BARS = 48;

const Waveform = ({ onSeek }: { onSeek: (ratio: number) => void }) => {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    const bars = Array.from(el.children) as HTMLDivElement[];
    const seeds = bars.map(() => ({ phase: Math.random() * Math.PI * 2, base: 0.2 + Math.random() * 0.3 }));
    let raf: number;

    let lastPausedDraw = 0;

    const draw = (t: number) => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const { position, duration, isPlaying, bpm } = useAudioStore.getState();

      // Paused: nothing moves, redraw a couple times a second instead of every frame
      if (!isPlaying) {
        if (t - lastPausedDraw < 200) {
          raf = requestAnimationFrame(draw);
          return;
        }
        lastPausedDraw = t;
      }

      const progress = duration > 0 ? position / duration : 0;
      const time = t * 0.001;

      bars.forEach((bar, i) => {
        const n = i / (WAVE_BARS - 1);
        const played = n <= progress;
        const wobble = isPlaying ? Math.sin(time * (bpm / 90) + seeds[i].phase) * 0.5 + 0.5 : 0.3;
        const h = Math.max(0.12, seeds[i].base + wobble * 0.5);
        // scaleY (GPU-composited) instead of height (forces layout every frame on 48 elements)
        bar.style.transform = `scaleY(${h})`;
        bar.style.background = played ? '#C81E2C' : 'rgba(255,255,255,0.14)';
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="flex items-end gap-[2px] h-10 cursor-pointer px-0.5"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
      }}
      ref={barsRef}
    >
      {Array.from({ length: WAVE_BARS }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-full rounded-[1px]"
          style={{ transform: 'scaleY(0.2)', transformOrigin: 'bottom' }}
        />
      ))}
    </div>
  );
};

export const AudioControls = () => {
  const { isReady, isPlaying, bpm, trackTitle, position, duration, toggle, next, prev, seek } = useAudioStore();
  const { lang } = useLangStore();
  const t = translations[lang];

  const handleSeekRatio = (ratio: number) => {
    if (!duration) return;
    seek(ratio * duration);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(90vw,440px)]">
      <div
        className="relative rounded-md border border-white/10 overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, #1c1a1a 0%, #121010 45%, #0a0808 100%)',
          boxShadow: '0 14px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.6)',
        }}
      >
        {/* LCD readout row */}
        <div className="relative flex items-center justify-between gap-3 px-4 pt-2.5 pb-1.5">
          <div className="min-w-0 flex-1">
            <div className="mono text-[8px] tracking-[2px] text-[#C81E2C] flex items-center gap-1.5 mb-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#C81E2C] animate-pulse shadow-[0_0_6px_#C81E2C]' : 'bg-white/25'}`} />
              {isReady ? (isPlaying ? t.player.live : t.player.paused) : t.player.connecting}
            </div>
            <div className="truncate font-semibold tracking-tight text-[12px] text-white">{trackTitle}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="mono text-lg font-bold text-[#C81E2C] tabular-nums leading-none">{bpm.toFixed(0)}</div>
          </div>
        </div>

        {/* Waveform */}
        <div className="relative px-4">
          <Waveform onSeek={handleSeekRatio} />
        </div>

        <div className="relative flex justify-between px-4 mt-0.5 mono text-[8px] text-white/35 tracking-[1px] tabular-nums">
          <span>{formatTime(position)}</span>
          <a href={PROFILE_URL} target="_blank" rel="noreferrer" className="hover:text-[#C81E2C] transition-colors">
            SOUNDCLOUD ↗
          </a>
          <span>-{formatTime(Math.max(0, duration - position))}</span>
        </div>

        {/* Transport */}
        <div className="relative flex items-center justify-center gap-4 px-4 py-2.5">
          <button
            onClick={prev}
            aria-label="Previous track"
            className="w-7 h-7 rounded-sm flex items-center justify-center border border-white/12 bg-white/[0.03] text-white/70 hover:text-white hover:border-[#C81E2C]/60 active:scale-95 transition-all"
          >
            <span className="text-xs">⏮</span>
          </button>

          <button
            onClick={toggle}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="relative w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #2a2626 0%, #141212 60%, #0a0808 100%)',
              boxShadow: isPlaying
                ? '0 0 0 2px rgba(200,30,44,0.8), 0 0 16px 3px rgba(200,30,44,0.5), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -3px 8px rgba(0,0,0,0.7)'
                : '0 0 0 1px rgba(255,255,255,0.15), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -3px 8px rgba(0,0,0,0.7)',
            }}
          >
            <span className="text-white text-sm relative z-10">{isPlaying ? '❚❚' : '▶'}</span>
          </button>

          <button
            onClick={next}
            aria-label="Next track"
            className="w-7 h-7 rounded-sm flex items-center justify-center border border-white/12 bg-white/[0.03] text-white/70 hover:text-white hover:border-[#C81E2C]/60 active:scale-95 transition-all"
          >
            <span className="text-xs">⏭</span>
          </button>
        </div>
      </div>
    </div>
  );
};
