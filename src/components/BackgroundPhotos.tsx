import { useEffect, useRef } from 'react';
import joseAvatar from '../assets/jose-avatar.jpg';
import bgPhoto1 from '../assets/bg-photo-1.jpg';
import bgPhoto2 from '../assets/bg-photo-2.jpg';

interface Layer {
  el: HTMLImageElement;
  depth: number; // 0 = far (moves little), 1 = near (moves a lot)
  driftPhase: number;
  driftSpeed: number;
  maxOpacity: number;
  revealDelay: number; // ms before this layer starts fading in
  revealDuration: number;
  breathePhase: number;
  breatheSpeed: number;
}

export const BackgroundPhotos = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Layer[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('[data-depth]'));
    layersRef.current = imgs.map((el, i) => {
      const maxOpacity = parseFloat(el.dataset.maxOpacity || '0.2');
      el.style.opacity = reduced ? String(maxOpacity) : '0';
      return {
        el,
        depth: parseFloat(el.dataset.depth || '0.3'),
        driftPhase: i * 2.1,
        driftSpeed: 0.06 + i * 0.02,
        maxOpacity,
        revealDelay: 300 + Math.random() * 2200,
        revealDuration: 1800 + Math.random() * 1200,
        breathePhase: Math.random() * Math.PI * 2,
        breatheSpeed: 0.15 + Math.random() * 0.2,
      };
    });

    // Static depth scale only — no mouse/scroll parallax, just the ghost fade-in + slow breathe
    layersRef.current.forEach(({ el, depth }) => {
      el.style.transform = `scale(${1 + depth * 0.12})`;
    });

    if (reduced) return;

    let raf: number;
    const start = performance.now();
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    // Breathing doesn't need 60fps — cap at ~30fps to halve the work on older GPUs
    const FRAME_INTERVAL = 1000 / 30;
    let lastFrameTime = 0;

    const render = (now: number) => {
      if (document.hidden) {
        raf = requestAnimationFrame(render);
        return;
      }
      if (now - lastFrameTime < FRAME_INTERVAL) {
        raf = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = now;

      const time = now * 0.001;
      const elapsed = now - start;

      layersRef.current.forEach(({ el, maxOpacity, revealDelay, revealDuration, breathePhase, breatheSpeed }) => {
        const revealT = Math.min(1, Math.max(0, (elapsed - revealDelay) / revealDuration));
        const revealed = easeOutCubic(revealT);
        const breathe = revealT >= 1 ? 0.8 + 0.2 * Math.sin(time * breatheSpeed + breathePhase) : 1;
        el.style.opacity = String(maxOpacity * revealed * breathe);
      });
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none [perspective:1000px]">
      <img
        data-depth="0.15"
        data-max-opacity="0.15"
        src={bgPhoto1}
        alt=""
        className="absolute -top-[10%] -left-[15%] w-[60%] max-w-[900px] will-change-transform"
        style={{ filter: 'grayscale(1) contrast(1.3) sepia(0.3) hue-rotate(-30deg) saturate(2) blur(2px)' }}
      />
      <img
        data-depth="0.55"
        data-max-opacity="0.25"
        src={joseAvatar}
        alt=""
        className="absolute top-[15%] -right-[12%] w-[45%] max-w-[700px] will-change-transform"
        style={{ filter: 'grayscale(1) contrast(1.3) sepia(0.3) hue-rotate(-30deg) saturate(2)' }}
      />
      <img
        data-depth="0.3"
        data-max-opacity="0.18"
        src={bgPhoto2}
        alt=""
        className="absolute bottom-[-15%] left-[20%] w-[55%] max-w-[850px] will-change-transform"
        style={{ filter: 'grayscale(1) contrast(1.3) sepia(0.3) hue-rotate(-30deg) saturate(2) blur(1px)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 220px 60px rgba(0,0,0,0.85)' }} />
    </div>
  );
};
