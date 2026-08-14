import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';

const BAR_COUNT_DESKTOP = 110;
const BAR_COUNT_MOBILE = 56;
const HEIGHT = 176; // px — reaches up to the floating player's top edge

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

    const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
      const n = i / (BAR_COUNT - 1);
      return {
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.1,
        // dome envelope: taller near center, tapering at the edges — reads as "modern EQ", not a flat wall of blocks
        envelope: Math.pow(Math.sin(Math.PI * n), 0.7) * 0.7 + 0.3,
        value: 0,
      };
    });

    let rafId: number;
    const gapRatio = 0.42; // thin bars, generous gap — the "not blocky" look

    const draw = (t: number) => {
      if (document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      const { frequency, bpm, isPlaying } = useAudioStore.getState();
      ctx.clearRect(0, 0, cssW, HEIGHT);

      const barSlot = cssW / BAR_COUNT;
      const w = Math.max(1, barSlot * (1 - gapRatio));
      const time = reduced ? 0 : t * 0.001;
      const energy = isPlaying ? frequency : 0.03;
      const maxH = HEIGHT * 0.92;

      for (let i = 0; i < BAR_COUNT; i++) {
        const bar = bars[i];
        const wobble = Math.sin(time * bar.speed * (bpm / 120) + bar.phase) * 0.5 + 0.5;
        const target = (0.05 + wobble * 0.55 * (0.3 + energy)) * bar.envelope;
        bar.value = lerp(bar.value, target, reduced ? 1 : 0.16);

        const h = Math.max(2, bar.value * maxH);
        const x = i * barSlot + (barSlot - w) / 2;
        const y = HEIGHT - h;
        const r = Math.min(w / 2, 4);

        const gradient = ctx.createLinearGradient(0, HEIGHT, 0, y);
        gradient.addColorStop(0, 'rgba(200,30,44,0.9)');
        gradient.addColorStop(0.55, 'rgba(200,30,44,0.4)');
        gradient.addColorStop(1, 'rgba(255,120,130,0.08)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [r, r, 0, 0]);
        ctx.fill();

        if (bar.value > 0.5) {
          ctx.save();
          ctx.shadowColor = 'rgba(200,30,44,0.8)';
          ctx.shadowBlur = 8;
          ctx.fillStyle = 'rgba(255,150,160,0.5)';
          ctx.beginPath();
          ctx.roundRect(x, y, w, Math.min(3, h), [r, r, 0, 0]);
          ctx.fill();
          ctx.restore();
        }
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
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none" style={{ height: HEIGHT, opacity: 0.55 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
