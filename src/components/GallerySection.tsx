import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';
import { fetchFeed, mediaUrl, type FeedItem } from '../lib/feedApi';

export const GallerySection = () => {
  const { lang } = useLangStore();
  const t = translations[lang];
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const feed = await fetchFeed();
      if (!cancelled) setItems(feed.filter((f) => f.type === 'photo' || f.type === 'video'));
    };
    poll();
    const interval = setInterval(poll, 20000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-8 pb-44 sm:pb-28 pt-16 sm:pt-24 lg:h-screen lg:flex lg:flex-col lg:justify-start lg:pb-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mono text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#C81E2C] mb-3 lg:mb-1"
      >
        {t.gallery.eyebrow}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="text-4xl sm:text-5xl md:text-8xl lg:text-5xl font-black tracking-[-1px] md:tracking-[-3px] mb-8 md:mb-16 lg:mb-4"
      >
        {t.gallery.title}
      </motion.h2>

      {items.length === 0 ? (
        <div className="mono text-sm text-gray-500 tracking-[2px]">{t.gallery.empty}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-2 max-h-[52vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
          {items.slice(0, 12).map((item) => (
            <div key={item.id} className="tour-card relative aspect-square overflow-hidden group">
              {item.type === 'photo' ? (
                <img
                  src={mediaUrl(item.fileId!)}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <video
                  src={mediaUrl(item.fileId!)}
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
