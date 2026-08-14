import { create } from 'zustand';

const FIXED_BPM = 128;

/** SoundCloud's embed API exposes no raw audio to analyze — no way to detect real BPM
 * client-side. Parse it from the track title when the DJ tags it (common practice);
 * otherwise fall back to the house-standard 128. */
const parseBpmFromTitle = (title: string | undefined): number => {
  if (!title) return FIXED_BPM;
  const match = title.match(/(\d{2,3})\s*bpm/i);
  if (!match) return FIXED_BPM;
  const bpm = parseInt(match[1], 10);
  return bpm >= 60 && bpm <= 220 ? bpm : FIXED_BPM;
};

let pulseRafId: number | null = null;

export interface SCSound {
  id: number;
  title: string;
  artworkUrl: string | null;
  permalinkUrl: string;
  genre: string;
}

interface AudioStore {
  widget: any | null;
  isReady: boolean;
  isPlaying: boolean;
  bpm: number;
  frequency: number;
  position: number;
  duration: number;
  trackTitle: string;
  sounds: SCSound[];
  currentIndex: number;

  setWidget: (widget: any) => void;
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
    const beatPhase = (t * (bpm / 60)) % 1;
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
  isReady: false,
  isPlaying: false,
  bpm: FIXED_BPM,
  frequency: 0,
  position: 0,
  duration: 0,
  trackTitle: 'LOADING SIGNAL…',
  sounds: [],
  currentIndex: 0,

  setWidget: (widget) => {
    set({ widget });
    const SC = (window as any).SC;

    const syncCurrentSound = () => {
      widget.getCurrentSound((sound: any) => {
        if (!sound) return;
        set({
          trackTitle: sound.title ?? 'UNTITLED',
          bpm: parseBpmFromTitle(sound.title),
          duration: sound.duration ?? 0,
        });
      });
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

  play: () => get().widget?.play(),
  pause: () => get().widget?.pause(),
  toggle: () => {
    const { widget, isPlaying } = get();
    if (!widget) return;
    isPlaying ? widget.pause() : widget.play();
  },
  next: () => get().widget?.next(),
  prev: () => get().widget?.prev(),
  seek: (ms) => get().widget?.seekTo(ms),
  playIndex: (index) => {
    const { widget } = get();
    if (!widget) return;
    widget.skip(index);
    widget.play();
  },
}));
