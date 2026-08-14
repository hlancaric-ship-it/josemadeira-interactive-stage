import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';
import { loadWidgetAPI, WIDGET_SRC } from '../lib/soundcloud';

export const SoundCloudPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const setWidget = useAudioStore((s) => s.setWidget);

  useEffect(() => {
    let cancelled = false;

    loadWidgetAPI().then(() => {
      if (cancelled || !iframeRef.current) return;
      const widget = (window as any).SC.Widget(iframeRef.current);
      setWidget(widget);
    });

    return () => {
      cancelled = true;
    };
  }, [setWidget]);

  return (
    <iframe
      ref={iframeRef}
      title="soundcloud-player"
      src={WIDGET_SRC}
      allow="autoplay"
      style={{
        position: 'fixed',
        width: 2,
        height: 2,
        opacity: 0,
        pointerEvents: 'none',
        left: -9999,
        top: -9999,
      }}
    />
  );
};
