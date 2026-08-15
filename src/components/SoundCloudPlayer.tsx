import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';
import { loadWidgetAPI, WIDGET_SRC } from '../lib/soundcloud';

export const SoundCloudPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const setWidget = useAudioStore((s) => s.setWidget);
  const setIframeEl = useAudioStore((s) => s.setIframeEl);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    setIframeEl(iframe);

    let cancelled = false;

    // Rebinds on every load, not just the first — hardStart() reloads this
    // iframe's src to force autoplay on Safari, which needs a fresh SC.Widget().
    const bind = () => {
      loadWidgetAPI().then(() => {
        if (cancelled || !iframeRef.current) return;
        const widget = (window as any).SC.Widget(iframeRef.current);
        setWidget(widget);
      });
    };

    bind();
    iframe.addEventListener('load', bind);

    return () => {
      cancelled = true;
      iframe.removeEventListener('load', bind);
      setIframeEl(null);
    };
  }, [setWidget, setIframeEl]);

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
