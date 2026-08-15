import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';

const BAR_COUNT_DESKTOP = 96;
const BAR_COUNT_MOBILE = 48;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const SpectrumVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const BAR_COUNT = window.innerWidth < 768 ? BAR_COUNT_MOBILE : BAR_COUNT_DESKTOP;
    let dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
    let cssW = window.innerWidth;
    let cssH = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const bars = Array.from({ length: BAR_COUNT }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.3,
      base: 0.06 + Math.random() * 0.16,
      value: 0,
    }));

    let rafId: number;

    const draw = (t: number) => {
      if (document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      const { frequency, bpm, isPlaying } = useAudioStore.getState();
      ctx.clearRect(0, 0, cssW, cssH);

      const gap = 3;
      const barW = cssW / BAR_COUNT;
      const time = t * 0.001;
      const energy = isPlaying ? frequency : 0.04;
      const maxH = cssH * 0.94;

      for (let i = 0; i < BAR_COUNT; i++) {
        const bar = bars[i];
        const wobble = Math.sin(time * bar.speed * (bpm / 120) + bar.phase) * 0.5 + 0.5;

        // dome-shaped envelope: taller near the center, tapering toward the edges
        const n = i / (BAR_COUNT - 1);
        const envelope = Math.pow(Math.sin(Math.PI * n), 0.6) * 0.6 + 0.4;

        const target = (bar.base + wobble * 0.85 * (0.3 + energy)) * envelope;
        bar.value = lerp(bar.value, target, 0.16);

        const h = Math.max(3, bar.value * maxH);
        const x = i * barW + gap / 2;
        const w = Math.max(1, barW - gap);
        const y = cssH - h;
        const r = Math.min(w / 2, 3);

        const gradient = ctx.createLinearGradient(0, cssH, 0, y);
        gradient.addColorStop(0, 'rgba(200,30,44,0.95)');
        gradient.addColorStop(0.5, 'rgba(200,30,44,0.55)');
        gradient.addColorStop(1, 'rgba(255,90,100,0.15)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [r, r, 0, 0]);
        ctx.fill();

        // soft glow on the tip of taller bars
        if (bar.value > 0.35) {
          ctx.save();
          ctx.shadowColor = 'rgba(200,30,44,0.9)';
          ctx.shadowBlur = 14;
          ctx.fillStyle = 'rgba(255,140,150,0.6)';
          ctx.beginPath();
          ctx.roundRect(x, y, w, Math.min(6, h), [r, r, 0, 0]);
          ctx.fill();
          ctx.restore();
        }

        // faint reflection below the baseline
        ctx.fillStyle = 'rgba(200,30,44,0.08)';
        ctx.fillRect(x, cssH, w, Math.min(24, h * 0.25));
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
