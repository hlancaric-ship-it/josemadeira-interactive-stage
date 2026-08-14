export const FEED_API_BASE = 'https://josemadeira-feed.hlancaric.workers.dev';

export interface FeedItem {
  id: string;
  text: string;
  timestamp: number;
  type: 'text' | 'link' | 'photo' | 'video';
  link?: string;
  platform?: 'instagram' | 'tiktok' | 'facebook' | null;
  fileId?: string;
}

export const mediaUrl = (fileId: string) => `${FEED_API_BASE}/api/media/${fileId}`;

export interface LiveState {
  active: boolean;
  platform: 'instagram' | 'tiktok' | 'facebook' | null;
  since: number;
}

export const fetchFeed = async (): Promise<FeedItem[]> => {
  const res = await fetch(`${FEED_API_BASE}/api/feed`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.feed ?? [];
};

export const fetchLive = async (): Promise<LiveState> => {
  const res = await fetch(`${FEED_API_BASE}/api/live`);
  if (!res.ok) return { active: false, platform: null, since: 0 };
  const data = await res.json();
  return data.live ?? { active: false, platform: null, since: 0 };
};

export const platformUrl = (platform: LiveState['platform']): string => {
  switch (platform) {
    case 'instagram':
      return 'https://www.instagram.com/josemadeiraofficialnew';
    case 'tiktok':
      return 'https://www.tiktok.com/@josemadeiraofficial';
    case 'facebook':
      return 'https://www.facebook.com/josemadeiraofficialnew/';
    default:
      return '#';
  }
};

export const platformLabel = (platform: LiveState['platform']): string => {
  switch (platform) {
    case 'instagram':
      return 'INSTAGRAM';
    case 'tiktok':
      return 'TIKTOK';
    case 'facebook':
      return 'FACEBOOK';
    default:
      return '';
  }
};
