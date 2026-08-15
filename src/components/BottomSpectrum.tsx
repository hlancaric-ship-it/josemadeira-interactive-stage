import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';

const BAR_COUNT_DESKTOP = 160;
const BAR_COUNT_MOBILE = 80;
const HEIGHT = 320; // px — tall, lively wall matching the track's energy

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const BottomSpectrum = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
        bandPos: Math.abs(n - 0.5) * 2, // 0 center (bass) -> 1 edges (treble)
        value: 0,
      };
    });

    let rafId: number;
    const gapRatio = 0.45; // finer bars, more visible gap

    const draw = (t: number) => {
      if (document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      const { frequency, bpm, isPlaying } = useAudioStore.getState();
      ctx.clearRect(0, 0, cssW, HEIGHT);

      const barSlot = cssW / BAR_COUNT;
      const w = Math.max(1, barSlot * (1 - gapRatio));
      const time = t * 0.001;
      const beat = isPlaying ? frequency : 0.04;
      const maxH = HEIGHT;

      for (let i = 0; i < BAR_COUNT; i++) {
        const bar = bars[i];
        // EQ-like band character: center bars ride the real kick pulse
        // (bass, slow), edge bars flicker on their own faster cycle (treble).
        const treble = Math.sin(time * (5 + bar.speed * 5) * ((bpm ?? 128) / 128) + bar.phase) * 0.5 + 0.5;
        const target = Math.max(0.012, beat * (1 - bar.bandPos) * 0.95 + treble * bar.bandPos * 0.75) * bar.envelope;
        bar.value = lerp(bar.value, target, 0.22);

        const h = Math.max(2, bar.value * maxH);
        const x = i * barSlot + (barSlot - w) / 2;
        const y = HEIGHT - h;
        const r = Math.min(w / 2, 2);

        // Taller bars fade out more.
        ctx.globalAlpha = 1 - Math.min(1, bar.value) * 0.6;

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

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none" style={{ height: HEIGHT, opacity: 0.72 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
