let apiLoadPromise: Promise<void> | null = null;

export const PROFILE_URL = 'https://soundcloud.com/josemadeiraofficial';

export const WIDGET_SRC = `https://w.soundcloud.com/player/?url=${encodeURIComponent(PROFILE_URL)}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&color=%23c9a227`;

export function loadWidgetAPI(): Promise<void> {
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    if ((window as any).SC?.Widget) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });

  return apiLoadPromise;
}
