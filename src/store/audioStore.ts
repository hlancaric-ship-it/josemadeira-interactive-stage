import { create } from 'zustand';
import { buildWidgetSrc } from '../lib/soundcloud';

// SoundCloud's embed API exposes no raw audio to analyze, and the iframe is
// cross-origin so Web Audio API access is out — there is no way to detect
// real BPM client-side. Only show a number when the DJ tags it in the track
// title; otherwise it's unknown, not a guess.
const ANIMATION_BPM = 128; // purely for animation timing (spectrum/pulse speed), never displayed as fact

const parseBpmFromTitle = (title: string | undefined): number | null => {
  if (!title) return null;
  const match = title.match(/(\d{2,3})\s*bpm/i);
  if (!match) return null;
  const bpm = parseInt(match[1], 10);
  return bpm >= 60 && bpm <= 220 ? bpm : null;
};

let pulseRafId: number | null = null;
let syncIntervalId: number | null = null;

export interface SCSound {
  id: number;
  title: string;
  artworkUrl: string | null;
  permalinkUrl: string;
  genre: string;
}

// Session-only: volume/mute reset to the default on every fresh visit
// rather than remembering a previous "silenced" state via localStorage.
const INITIAL_VOLUME = 80;

interface AudioStore {
  widget: any | null;
  iframeEl: HTMLIFrameElement | null;
  isReady: boolean;
  isPlaying: boolean;
  bpm: number | null;
  frequency: number;
  position: number;
  duration: number;
  trackTitle: string;
  sounds: SCSound[];
  currentIndex: number;
  volume: number;
  muted: boolean;

  setWidget: (widget: any) => void;
  setIframeEl: (el: HTMLIFrameElement | null) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  /** Reloads the SoundCloud iframe with auto_play=true as a direct, synchronous
   * result of a user gesture. Safari does not carry user-activation across the
   * postMessage boundary into a cross-origin iframe, so calling widget.play()
   * on an already-loaded iframe can silently fail there; a gesture-triggered
   * navigation of the iframe itself is honored instead. */
  hardStart: () => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (ms: number) => void;
  playIndex: (index: number) => void;
}

const startPulseLoop = (
  get: () => AudioStore,
  set: (partial: Partial<AudioStore> | ((s: AudioStore) => Partial<AudioStore>)) => void
) => {
  if (pulseRafId) return;

  const loop = () => {
    const { isPlaying, position, bpm } = get();
    if (!isPlaying) {
      pulseRafId = null;
      set({ frequency: 0 });
      return;
    }

    const t = position / 1000;
    const beatPhase = (t * ((bpm ?? ANIMATION_BPM) / 60)) % 1;
    const kick = Math.pow(Math.max(0, Math.sin(beatPhase * Math.PI)), 3);
    const drift = Math.sin(t * 0.7) * 0.15 + Math.sin(t * 1.9) * 0.08;
    const target = Math.min(1, Math.max(0.08, kick * 0.85 + drift + 0.15));

    set((s) => ({ frequency: s.frequency + (target - s.frequency) * 0.25 }));
    pulseRafId = requestAnimationFrame(loop);
  };

  pulseRafId = requestAnimationFrame(loop);
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  widget: null,
  iframeEl: null,
  isReady: false,
  isPlaying: false,
  bpm: null,
  frequency: 0,
  position: 0,
  duration: 0,
  trackTitle: 'LOADING SIGNAL…',
  sounds: [],
  currentIndex: 0,
  volume: INITIAL_VOLUME,
  muted: false,

  setWidget: (widget) => {
    set({ widget });
    const SC = (window as any).SC;
    widget.setVolume(get().muted ? 0 : get().volume);

    const applySound = (sound: any, index?: number) => {
      if (!sound) return;
      const title = sound.title ?? 'UNTITLED';
      const next: Partial<AudioStore> = {
        trackTitle: title,
        bpm: parseBpmFromTitle(title),
        duration: sound.duration ?? get().duration,
      };
      if (typeof index === 'number') next.currentIndex = index;
      set(next);
    };

    const syncCurrentSound = () => {
      widget.getCurrentSound((sound: any) => applySound(sound));
      widget.getCurrentSoundIndex((index: number) => set({ currentIndex: index }));
    };

    widget.bind(SC.Widget.Events.READY, () => {
      set({ isReady: true });
      syncCurrentSound();

      widget.getSounds((sounds: any[]) => {
        set({
          sounds: sounds.map((s) => ({
            id: s.id,
            title: s.title ?? 'UNTITLED',
            artworkUrl: s.artwork_url ?? null,
            permalinkUrl: s.permalink_url ?? '',
            genre: s.genre ?? '',
          })),
        });
      });

      // hardStart() reloads the iframe with auto_play=true, which can start
      // playing (and fire its one-shot PLAY event) before this widget finishes
      // binding — missing that broadcast left isPlaying/position stuck forever.
      // Poll the real state directly as a self-healing fallback.
      if (syncIntervalId) clearInterval(syncIntervalId);
      syncIntervalId = window.setInterval(() => {
        widget.isPaused((paused: boolean) => {
          const playing = !paused;
          if (get().isPlaying !== playing) {
            set({ isPlaying: playing });
            if (playing) startPulseLoop(get, set);
          }
        });
        widget.getPosition((pos: number) => set({ position: pos }));
        // skip()/next()/prev() often play the new track without a second PLAY
        // event, so the LCD title would stay stuck on the previous sound.
        widget.getCurrentSound((sound: any) => {
          if (!sound) return;
          const title = sound.title ?? 'UNTITLED';
          if (title !== get().trackTitle) applySound(sound);
        });
        widget.getCurrentSoundIndex((index: number) => {
          if (get().currentIndex !== index) set({ currentIndex: index });
        });
      }, 500);
    });

    widget.bind(SC.Widget.Events.PLAY, () => {
      set({ isPlaying: true });
      syncCurrentSound();
      startPulseLoop(get, set);
    });

    widget.bind(SC.Widget.Events.PAUSE, () => set({ isPlaying: false }));
    widget.bind(SC.Widget.Events.FINISH, () => set({ isPlaying: false }));

    widget.bind(SC.Widget.Events.PLAY_PROGRESS, (e: { currentPosition: number }) => {
      set({ position: e.currentPosition });
    });
  },

  setIframeEl: (el) => set({ iframeEl: el }),
  setVolume: (volume) => {
    const clamped = Math.max(0, Math.min(100, volume));
    set({ volume: clamped, muted: clamped === 0 });
    get().widget?.setVolume(clamped);
  },
  toggleMute: () => {
    const { muted, volume, widget } = get();
    const next = !muted;
    set({ muted: next });
    widget?.setVolume(next ? 0 : volume);
  },
  hardStart: () => {
    const { iframeEl } = get();
    if (!iframeEl) return;
    iframeEl.src = buildWidgetSrc(true);
  },

  play: () => get().widget?.play(),
  pause: () => get().widget?.pause(),
  toggle: () => {
    const { widget, isPlaying } = get();
    if (!widget) return;
    isPlaying ? widget.pause() : widget.play();
  },
  next: () => {
    const { widget, sounds, currentIndex } = get();
    if (!widget) return;
    const nextIndex = sounds.length ? (currentIndex + 1) % sounds.length : currentIndex + 1;
    const sound = sounds[nextIndex];
    if (sound) {
      set({ currentIndex: nextIndex, trackTitle: sound.title, bpm: parseBpmFromTitle(sound.title) });
    }
    widget.next();
  },
  prev: () => {
    const { widget, sounds, currentIndex } = get();
    if (!widget) return;
    const prevIndex = sounds.length
      ? (currentIndex - 1 + sounds.length) % sounds.length
      : Math.max(0, currentIndex - 1);
    const sound = sounds[prevIndex];
    if (sound) {
      set({ currentIndex: prevIndex, trackTitle: sound.title, bpm: parseBpmFromTitle(sound.title) });
    }
    widget.prev();
  },
  seek: (ms) => get().widget?.seekTo(ms),
  playIndex: (index) => {
    const { widget, sounds } = get();
    if (!widget) return;
    const sound = sounds[index];
    if (sound) {
      set({
        currentIndex: index,
        trackTitle: sound.title,
        bpm: parseBpmFromTitle(sound.title),
      });
    }
    widget.skip(index);
    widget.play();
    widget.getCurrentSound((current: any) => {
      if (!current) return;
      set({
        trackTitle: current.title ?? sound?.title ?? 'UNTITLED',
        bpm: parseBpmFromTitle(current.title),
        duration: current.duration ?? 0,
        currentIndex: index,
      });
    });
  },
}));
