import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/** Apple/Nike-style entrance: the heading starts oversized and offset to the
 * side, then shrinks to its natural size and slides into place once it
 * scrolls into view. Triggered via IntersectionObserver (whileInView) rather
 * than a scroll-position-linked transform, since MainStage scrolls
 * horizontally on desktop (see HorizontalStage) — a window-scrollY-linked
 * animation would never progress there and the heading would stay invisible. */
export const ScrollShrinkHeading = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, scale: 1.28, x: -48 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'left center' }}
      className={className}
    >
      {children}
    </motion.h2>
  );
};
