import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';

export const BeatCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduced) return;

    const el = dotRef.current;
    if (!el) return;

    const root = document.documentElement;
    root.classList.add('custom-cursor');

    const onMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        el.style.opacity = '1';
      }
    };
    const onLeave = () => {
      visibleRef.current = false;
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);

    let raf: number;
    const tick = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const { isPlaying, frequency } = useAudioStore.getState();
      const kick = isPlaying ? frequency : 0.12;
      const scale = 1 + kick * 0.9;
      const { x, y } = posRef.current;

      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      if (visibleRef.current) {
        el.style.opacity = isPlaying ? String(0.55 + kick * 0.45) : '0.35';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
      cancelAnimationFrame(raf);
      root.classList.remove('custom-cursor');
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return <div id="bpm-cursor" ref={dotRef} style={{ opacity: 0, left: 0, top: 0 }} />;
};
