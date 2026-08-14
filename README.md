# JOSEMADEIRA — Interactive Stage

Oficiální web pro DJ Jose Madeira (Studio 54 Praha, House Friends). Vite + React + Tailwind, horizontální scroll na desktopu, audio-reaktivní scéna napojená na SoundCloud, Telegram bot pro live/galerii.

## Kde web běží

- **Produkce**: https://josemadeira-interactive-stage.pages.dev (Cloudflare Pages)
- **GitHub repo**: https://github.com/hlancaric-ship-it/josemadeira-interactive-stage
- **Cloudflare účet**: `Hlancaric@gmail.com's Account`

## Lokální spuštění

```bash
npm install
npm run dev        # dev server
npm run build       # produkční build do dist/
```

## Nasazení na Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name=josemadeira-interactive-stage --commit-dirty=true
```

Vyžaduje přihlášení přes `npx wrangler login` (nebo mít API token v env).

## Telegram Worker (feed + live status + galerie)

Samostatný Cloudflare Worker ve složce `worker/`. Přijímá zprávy z Telegram bota a ukládá je do KV, frontend je pak zobrazuje.

- **Worker URL**: https://josemadeira-feed.hlancaric.workers.dev
- **Bot**: `@JoseMadeira_bot` (token uložen jako Cloudflare secret, není v gitu)
- **KV namespace**: `FEED_KV`, id `10b834c4c1ee463ea4ae0e12cd268f0d`

### Jak to funguje
Cokoliv se napíše botovi na Telegramu, propíše se na web:
- **text / odkaz na IG/FB/TikTok** → (feed sekce byla na přání smazána, worker endpoint `/api/feed` ale pořád existuje a funguje, kdyby se chtěla vrátit)
- **foto / video** → sekce Fotogalerie
- `live tiktok` / `live insta` / `live fb` → nahoře se objeví LIVE banner s odkazem
- `live off` → banner zmizí

### Nasazení Workeru
```bash
cd worker
npx wrangler deploy
```

### Secrets (nutno nastavit při novém deploymentu / jiném účtu)
```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
```

### Registrace Telegram webhooku (jednorázově, po nasazení Workeru)
```bash
curl -s "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://josemadeira-feed.hlancaric.workers.dev/webhook/telegram" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

## Struktura projektu

```
src/
  App.tsx                 hlavní layout, všechny sekce (Tour, About, Collaborators,
                           Streaming, Discography, Gallery), horizontální scroll wrapper
  components/
    Hero.tsx               úvodní obrazovka (coin-drop animace loga)
    Preloader.tsx           loading screen s coin-drop + progress
    MainNav.tsx             navigace (desktop plné menu, mobil hamburger)
    HorizontalStage.tsx     scroll-jacking logika pro desktop (1 scroll = 1 panel)
    AudioControls.tsx       CDJ-styl přehrávač dole
    BottomSpectrum.tsx      spektrum vizualizér dole přes celou šířku
    BackgroundPhotos.tsx    náhodně se přesouvající "duchové" fotky na pozadí
    StageAtmosphere.tsx     haze/light-sweep atmosféra
    LiveBanner.tsx           LIVE banner (řízeno přes Telegram)
    GallerySection.tsx      fotogalerie (Telegram)
  store/
    audioStore.ts            zustand store pro SoundCloud widget stav, BPM parsing z title
  i18n/translations.ts       CZ/EN texty
worker/
  index.ts                  Cloudflare Worker — Telegram webhook handler + API
```

## Ověřené fakty o Jose Madeira (nepoužívat nic mimo tohle bez ověření!)

- SoundCloud: soundcloud.com/josemadeiraofficial
- Instagram: instagram.com/josemadeiraofficialnew
- Facebook: facebook.com/josemadeiraofficialnew
- YouTube: youtube.com/@josemadeiraofficial
- Spotify artist ID: 0Gr1t69ZXhohsB8dwj4sLr
- Apple Music artist ID: 1814103021
- Rezidence: Studio 54 Praha (studio54.cz/cs/dj/jose-madeira)
- Label: Housemagazine.cz Records (největší české vydavatelství EDM)
- Spolupráce: Yan Lan, společné vydání "Life Is Good"
- Podcast: "Jose Madeira Vibes" na Dance Radio Prague, každou druhou neděli 18–21 CET
- b2b partner: Rio

Reálné jméno, roky aktivní kariéry a ocenění se nepodařilo nikde dohledat — netvrdit nic bez potvrzení od Jose.

## Známé restY / TODO pro dokončení

- Nadpisy sekcí přestylovat do výraznější "Nike-style" typografie (velký, tučný, sportovní řez)
- Zkontrolovat/opravit mezeru mezi Hero a Tour sekcí na mobilu
- Kontaktní sekce "Napište mi" zatím chybí
- Feed sekce byla na přání smazána z frontendu, ale backend (`/api/feed`, `/api/feed/:id/reply`) běží dál — dá se snadno vrátit
