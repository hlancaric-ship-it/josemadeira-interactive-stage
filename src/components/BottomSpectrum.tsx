import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';

const BAR_COUNT_DESKTOP = 72;
const BAR_COUNT_MOBILE = 36;
const HEIGHT = 96; // px — reaches up to just under the floating player's top edge

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const BottomSpectrum = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const BAR_COUNT = window.innerWidth < 768 ? BAR_COUNT_MOBILE : BAR_COUNT_DESKTOP;
    let dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
    let cssW = window.innerWidth;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
      cssW = window.innerWidth;
      canvas.width = cssW * dpr;
      canvas.height = HEIGHT * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const bars = Array.from({ length: BAR_COUNT }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.1,
      value: 0,
    }));

    let rafId: number;
    const gap = 3;

    const draw = (t: number) => {
      if (document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      const { frequency, bpm, isPlaying } = useAudioStore.getState();
      ctx.clearRect(0, 0, cssW, HEIGHT);

      const barW = cssW / BAR_COUNT;
      const time = reduced ? 0 : t * 0.001;
      const energy = isPlaying ? frequency : 0.03;

      for (let i = 0; i < BAR_COUNT; i++) {
        const bar = bars[i];
        const wobble = Math.sin(time * bar.speed * (bpm / 120) + bar.phase) * 0.5 + 0.5;
        const target = 0.08 + wobble * 0.5 * (0.35 + energy);
        bar.value = lerp(bar.value, target, reduced ? 1 : 0.18);

        const h = Math.max(2, bar.value * HEIGHT);
        const x = i * barW + gap / 2;
        const w = Math.max(1, barW - gap);
        const y = HEIGHT - h;

        const gradient = ctx.createLinearGradient(0, HEIGHT, 0, y);
        gradient.addColorStop(0, 'rgba(200,30,44,0.85)');
        gradient.addColorStop(1, 'rgba(200,30,44,0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
      }

      if (!reduced) rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none" style={{ height: HEIGHT, opacity: 0.6 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
