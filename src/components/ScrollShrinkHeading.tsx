import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/** Apple/Nike-style scroll effect: the heading enters oversized and off to
 * the side, then shrinks to its natural size and settles into place as it
 * scrolls up through the viewport. */
export const ScrollShrinkHeading = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.4'] });

  const scale = useTransform(scrollYProgress, [0, 1], [1.28, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [-48, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);

  return (
    <motion.h2
      ref={ref}
      style={{ scale, x, opacity, transformOrigin: 'left center' }}
      className={className}
    >
      {children}
    </motion.h2>
  );
};
