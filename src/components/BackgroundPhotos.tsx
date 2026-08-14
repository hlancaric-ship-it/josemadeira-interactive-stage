import { useEffect, useRef } from 'react';
import joseAvatar from '../assets/jose-avatar.jpg';
import bgPhoto1 from '../assets/bg-photo-1.jpg';
import bgPhoto2 from '../assets/bg-photo-2.jpg';

const PHOTOS = [bgPhoto1, joseAvatar, bgPhoto2];

interface Layer {
  el: HTMLImageElement;
  depth: number;
  maxOpacity: number;
  revealDelay: number;
  revealDuration: number;
  breathePhase: number;
  breatheSpeed: number;
  revealStart: number;
  nextShuffle: number;
  shuffling: boolean;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Picks a fresh random spot/size for a ghost layer, avoiding dead-center so it doesn't fight the content. */
const randomizePosition = (el: HTMLImageElement) => {
  const size = rand(38, 62);
  const top = rand(-15, 70);
  const left = Math.random() < 0.5 ? rand(-18, 15) : rand(55, 85);
  el.style.width = `${size}%`;
  el.style.top = `${top}%`;
  el.style.left = `${left}%`;
  el.style.right = 'auto';
  el.style.bottom = 'auto';
};

export const BackgroundPhotos = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Layer[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('[data-depth]'));
    const start = performance.now();

    layersRef.current = imgs.map((el, i) => {
      const maxOpacity = parseFloat(el.dataset.maxOpacity || '0.2');
      el.style.opacity = '0';
      randomizePosition(el);
      const depth = 0.15 + Math.random() * 0.45;
      el.style.transform = `scale(${1 + depth * 0.12})`;
      return {
        el,
        depth,
        maxOpacity,
        revealDelay: 300 + i * 500 + Math.random() * 1200,
        revealDuration: 1800 + Math.random() * 1200,
        breathePhase: Math.random() * Math.PI * 2,
        breatheSpeed: 0.15 + Math.random() * 0.2,
        revealStart: 0,
        nextShuffle: rand(14000, 24000),
        shuffling: false,
      };
    });

    if (reduced) {
      layersRef.current.forEach(({ el, maxOpacity }) => {
        el.style.opacity = String(maxOpacity);
      });
      return;
    }

    let raf: number;
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

      layersRef.current.forEach((layer) => {
        const { el, maxOpacity, revealDelay, revealDuration, breathePhase, breatheSpeed } = layer;

        // Every so often, fade the ghost out, jump it to a new random spot, then fade back in
        if (elapsed > layer.nextShuffle && !layer.shuffling) {
          layer.shuffling = true;
        }

        let targetOpacity: number;
        if (layer.shuffling) {
          const fadeElapsed = elapsed - layer.nextShuffle;
          if (fadeElapsed < 900) {
            targetOpacity = maxOpacity * (1 - fadeElapsed / 900);
          } else if (fadeElapsed < 1000) {
            randomizePosition(el);
            targetOpacity = 0;
          } else {
            const fadeInT = Math.min(1, (fadeElapsed - 1000) / 1400);
            targetOpacity = maxOpacity * easeOutCubic(fadeInT);
            if (fadeInT >= 1) {
              layer.shuffling = false;
              layer.nextShuffle = elapsed + rand(14000, 24000);
            }
          }
        } else {
          const revealT = Math.min(1, Math.max(0, (elapsed - revealDelay) / revealDuration));
          const revealed = easeOutCubic(revealT);
          const breathe = revealT >= 1 ? 0.85 + 0.15 * Math.sin(time * breatheSpeed + breathePhase) : 1;
          targetOpacity = maxOpacity * revealed * breathe;
        }

        el.style.opacity = String(Math.max(0, targetOpacity));
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
      {PHOTOS.map((src, i) => (
        <img
          key={i}
          data-depth={i === 1 ? '0.55' : '0.3'}
          data-max-opacity={i === 1 ? '0.25' : '0.18'}
          src={src}
          alt=""
          className="absolute max-w-[900px] will-change-transform transition-[top,left] duration-[1400ms] ease-out"
          style={{ filter: 'grayscale(1) contrast(1.3) sepia(0.3) hue-rotate(-30deg) saturate(2) blur(1.5px)' }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 220px 60px rgba(0,0,0,0.85)' }} />
    </div>
  );
};
