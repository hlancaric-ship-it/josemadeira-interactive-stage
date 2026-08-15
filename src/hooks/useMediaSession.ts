import { useEffect } from 'react';
import { useAudioStore } from '../store/audioStore';

// SoundCloud's hidden iframe sets its own internal Media Session, but
// cross-origin propagation to the OS "now playing" overlay is inconsistent
// across browsers (works in some, stale/missing in others). Owning it here
// from the parent page's track state makes the title update reliably.
export const useMediaSession = () => {
  const trackTitle = useAudioStore((s) => s.trackTitle);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const artworkUrl = useAudioStore((s) => s.sounds[s.currentIndex]?.artworkUrl ?? null);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: trackTitle,
      artist: 'Jose Madeira',
      artwork: artworkUrl ? [{ src: artworkUrl, sizes: '500x500', type: 'image/jpeg' }] : [],
    });
  }, [trackTitle, artworkUrl]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const { play, pause, next, prev } = useAudioStore.getState();

    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('nexttrack', next);
    navigator.mediaSession.setActionHandler('previoustrack', prev);

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
    };
  }, []);
};
