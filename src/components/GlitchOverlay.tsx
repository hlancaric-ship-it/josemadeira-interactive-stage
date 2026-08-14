import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  active: boolean;
}

export const GlitchOverlay = ({ active }: Props) => {
  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            className="glitch-layer bg-[#7A1220]"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 0.75, 0.25, 0.7, 0.15],
              x: [-4, 4, -2, 3, 0],
              y: [2, -3, 1, -4, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          <motion.div
            className="glitch-layer bg-[#C9A227]"
            initial={{ opacity: 0.25 }}
            animate={{
              opacity: [0.25, 0.55, 0.1, 0.45],
              x: [4, -3, 5, -2, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
          />
          <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
            <div className="text-[120px] md:text-[180px] font-black text-black/10 tracking-[-8px] select-none">MADEIRA</div>
          </div>
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[10000] text-center">
            <div className="text-[#7A1220] mono text-sm tracking-[4px] mb-2">SECRET UNLOCKED</div>
            <a
              href="https://soundcloud.com/josemadeiraofficial"
              target="_blank"
              className="inline-block border border-[#C9A227] px-8 py-3 text-[#7A1220] hover:bg-[#7A1220] hover:text-white transition-all mono text-xs tracking-[3px]"
            >
              OPEN SOUNDCLOUD ARCHIVE
            </a>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
