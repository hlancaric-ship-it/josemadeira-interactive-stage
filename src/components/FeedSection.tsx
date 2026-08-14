import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';
import { fetchFeed, type FeedItem } from '../lib/feedApi';

const formatTimeAgo = (ts: number, lang: 'cs' | 'en') => {
  const diffMin = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (diffMin < 60) return lang === 'cs' ? `před ${diffMin} min` : `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return lang === 'cs' ? `před ${diffH} h` : `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  return lang === 'cs' ? `před ${diffD} dny` : `${diffD}d ago`;
};

const platformBadge: Record<string, string> = {
  instagram: 'INSTAGRAM',
  tiktok: 'TIKTOK',
  facebook: 'FACEBOOK',
};

export const FeedSection = () => {
  const { lang } = useLangStore();
  const t = translations[lang];
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const items = await fetchFeed();
      if (!cancelled) setFeed(items);
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
        {t.feed.eyebrow}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="text-4xl sm:text-5xl md:text-8xl lg:text-5xl font-black tracking-[-1px] md:tracking-[-3px] mb-8 md:mb-16 lg:mb-4"
      >
        {t.feed.title}
      </motion.h2>

      {feed.length === 0 ? (
        <div className="mono text-sm text-gray-500 tracking-[2px]">{t.feed.empty}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-3 max-h-[46vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
          {feed.slice(0, 8).map((item) => {
            const content = (
              <div className="tour-card px-5 py-4 lg:px-5 lg:py-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="mono text-[10px] text-white/35 tracking-[1px]">{formatTimeAgo(item.timestamp, lang)}</span>
                  {item.platform && (
                    <span className="mono text-[10px] px-2 py-0.5 border border-[#C81E2C]/50 text-[#C81E2C] tracking-[1px]">
                      {platformBadge[item.platform]}
                    </span>
                  )}
                </div>
                <div className="text-sm text-white/80 line-clamp-3">{item.text}</div>
              </div>
            );
            return item.link ? (
              <a key={item.id} href={item.link} target="_blank" rel="noreferrer" className="block hover:opacity-90 transition-opacity">
                {content}
              </a>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })}
        </div>
      )}
    </section>
  );
};
