import { useEffect, useRef, useState } from 'react';

/** Desktop: one scroll gesture = one panel, like a fullpage slider — turned sideways.
 *  Works everywhere on the page (including over fixed overlays like the player).
 *  Mobile: untouched normal stacking. */
export const HorizontalStage = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const el = containerRef.current;
    if (!el) return;

    let locked = false;
    let unlockTimer: number;
    let scrollRaf: number;

    const SCROLL_DURATION = 900; // ms — native `behavior: 'smooth'` was too quick/abrupt to control directly
    const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    const animateScrollTo = (target: number) => {
      cancelAnimationFrame(scrollRaf);
      const start = el.scrollLeft;
      const distance = target - start;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = Math.min(1, (now - startTime) / SCROLL_DURATION);
        el.scrollLeft = start + distance * easeInOutCubic(elapsed);
        if (elapsed < 1) scrollRaf = requestAnimationFrame(step);
      };
      scrollRaf = requestAnimationFrame(step);
    };

    const goToPanel = (index: number) => {
      const panelCount = el.children.length;
      const clamped = Math.min(Math.max(index, 0), panelCount - 1);
      animateScrollTo(clamped * window.innerWidth);
    };

    const onWheel = (e: WheelEvent) => {
      // Trackpad shift-scroll / genuine horizontal intent: let it through natively
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (locked || Math.abs(e.deltaY) < 4) return;

      locked = true;
      const currentIndex = Math.round(el.scrollLeft / window.innerWidth);
      goToPanel(currentIndex + (e.deltaY > 0 ? 1 : -1));

      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        locked = false;
      }, SCROLL_DURATION + 50);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.clearTimeout(unlockTimer);
      cancelAnimationFrame(scrollRaf);
    };
  }, [isDesktop]);

  return (
    <div
      ref={containerRef}
      className={
        isDesktop
          ? 'h-screen flex flex-row overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          : ''
      }
    >
      {children}
    </div>
  );
};
