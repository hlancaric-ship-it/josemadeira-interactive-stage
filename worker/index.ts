export interface Env {
  FEED_KV: KVNamespace;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  ALLOWED_CHAT_ID?: string;
}

interface FeedItem {
  id: string;
  text: string;
  timestamp: number;
  type: 'text' | 'link';
  link?: string;
  platform?: 'instagram' | 'tiktok' | 'facebook' | null;
}

interface LiveState {
  active: boolean;
  platform: 'instagram' | 'tiktok' | 'facebook' | null;
  since: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });

const detectPlatform = (text: string): FeedItem['platform'] => {
  if (/instagram\.com/i.test(text)) return 'instagram';
  if (/tiktok\.com/i.test(text)) return 'tiktok';
  if (/facebook\.com|fb\.watch/i.test(text)) return 'facebook';
  return null;
};

const extractUrl = (text: string): string | undefined => {
  const match = text.match(/https?:\/\/\S+/i);
  return match?.[0];
};

const normalizePlatform = (word: string): LiveState['platform'] => {
  const w = word.toLowerCase();
  if (w === 'insta' || w === 'instagram' || w === 'ig') return 'instagram';
  if (w === 'tiktok' || w === 'tt') return 'tiktok';
  if (w === 'fb' || w === 'facebook') return 'facebook';
  return null;
};

async function handleTelegramUpdate(update: any, env: Env): Promise<void> {
  const message = update?.message;
  if (!message?.text) return;

  if (env.ALLOWED_CHAT_ID) {
    const chatId = String(message.chat?.id ?? '');
    if (chatId !== env.ALLOWED_CHAT_ID) return;
  }

  const text: string = message.text.trim();

  const liveMatch = text.match(/^live\s+(off|tiktok|tt|insta|instagram|ig|fb|facebook)$/i);
  if (liveMatch) {
    const word = liveMatch[1];
    if (word.toLowerCase() === 'off') {
      const state: LiveState = { active: false, platform: null, since: Date.now() };
      await env.FEED_KV.put('live', JSON.stringify(state));
    } else {
      const platform = normalizePlatform(word);
      const state: LiveState = { active: true, platform, since: Date.now() };
      await env.FEED_KV.put('live', JSON.stringify(state));
    }
    return;
  }

  const url = extractUrl(text);
  const platform = url ? detectPlatform(url) : null;

  const item: FeedItem = {
    id: crypto.randomUUID(),
    text,
    timestamp: Date.now(),
    type: url ? 'link' : 'text',
    link: url,
    platform,
  };

  const raw = await env.FEED_KV.get('feed');
  const feed: FeedItem[] = raw ? JSON.parse(raw) : [];
  feed.unshift(item);
  await env.FEED_KV.put('feed', JSON.stringify(feed.slice(0, 60)));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === '/webhook/telegram' && request.method === 'POST') {
      const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (secret !== env.TELEGRAM_WEBHOOK_SECRET) {
        return new Response('Forbidden', { status: 403 });
      }
      const update = await request.json();
      await handleTelegramUpdate(update, env);
      return new Response('OK');
    }

    if (url.pathname === '/api/feed' && request.method === 'GET') {
      const raw = await env.FEED_KV.get('feed');
      const feed: FeedItem[] = raw ? JSON.parse(raw) : [];
      return json({ feed });
    }

    if (url.pathname === '/api/live' && request.method === 'GET') {
      const raw = await env.FEED_KV.get('live');
      const live: LiveState = raw ? JSON.parse(raw) : { active: false, platform: null, since: 0 };
      return json({ live });
    }

    return new Response('Not found', { status: 404 });
  },
};
