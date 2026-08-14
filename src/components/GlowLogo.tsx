import { motion } from 'framer-motion';
import logoReal from '../assets/logo-real.svg';

export const GlowLogo = ({ className = '' }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, filter: 'blur(14px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={`logo-glow-wrap relative inline-block ${className}`}
      style={{ ['--logo-mask' as any]: `url(${logoReal})` }}
    >
      <img src={logoReal} alt="Jose Madeira" className="logo-base block w-full h-auto" />
      <div className="logo-shine absolute inset-0" />
    </motion.div>
  );
};
