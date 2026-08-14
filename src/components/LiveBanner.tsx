import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLive, platformUrl, platformLabel, type LiveState } from '../lib/feedApi';

export const LiveBanner = () => {
  const [live, setLive] = useState<LiveState | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const state = await fetchLive();
      if (!cancelled) setLive(state);
    };
    poll();
    const interval = setInterval(poll, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {live?.active && (
        <motion.a
          href={platformUrl(live.platform)}
          target="_blank"
          rel="noreferrer"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-3 py-2.5 bg-[#C81E2C] text-white mono text-xs tracking-[3px] hover:bg-[#A91824] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          ŽIVĚ TEĎ NA {platformLabel(live.platform)} — SLEDOVAT ↗
        </motion.a>
      )}
    </AnimatePresence>
  );
};
