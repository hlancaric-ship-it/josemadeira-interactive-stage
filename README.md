# JOSEMADEIRA — Interactive Stage

Oficiální web pro DJ Jose Madeira (Studio 54 Praha, House Friends). Vite + React + Tailwind, horizontální scroll na desktopu, audio-reaktivní scéna napojená na SoundCloud, Telegram bot pro live/galerii.

## Kde web běží

- **Produkce**: https://josemadeira-interactive-stage.pages.dev (Cloudflare Pages)
- **Vlastní doména**: josemadeira.com + www.josemadeira.com (custom domain na tom samém Pages projektu)
- **GitHub repo**: https://github.com/hlancaric-ship-it/josemadeira-interactive-stage
- **Cloudflare účet**: `Hlancaric@gmail.com's Account`, account ID `3a147fa6382bb87477201b385bb945ea`
- **Cloudflare Pages project name**: `josemadeira-interactive-stage`
- **Cloudflare zone ID** (josemadeira.com): `327ff3caec3f81b65cb8cbeee182f0d3`

## Doména (josemadeira.com) — registrátor a DNS

- **Registrátor**: Forpsi (login 571172fh, zákazník Josef Dlouhý)
- Doména byla přesunuta z Forpsi nameserverů na **Cloudflare nameservery**:
  `emily.ns.cloudflare.com`, `viddy.ns.cloudflare.com`
- DNS zóna je teď spravovaná v Cloudflare (ne ve Forpsi) — veškeré DNS změny (MX, TXT, CNAME…) se dělají v Cloudflare dashboardu, ne ve Forpsi
- **E-mail** (@josemadeira.com) běží přes iCloud Mail (mxavas), MX/SPF/DKIM/apple-domain záznamy byly ručně přeneseny z Forpsi do Cloudflare DNS při migraci — pokud e-mail přestane fungovat, zkontrolovat tyto záznamy v Cloudflare DNS proti tomu, co bylo původně ve Forpsi
- DNSSEC byl na Forpsi zapnutý — pokud bude potřeba upravovat nameservery znovu, může být nutné ho nejdřív vypnout

**Bezpečnost**: Cloudflare Global API Key byl jednorázově použit k založení zóny a nastavení domény — po dokončení práce **musí být zneplatněn/rotován** v Cloudflare dashboardu (My Profile → API Tokens → Global API Key → Change), protože byl sdílen v chatu.

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

## Známé resty / TODO pro dokončení

- Feed sekce byla na přání smazána z frontendu, ale backend (`/api/feed`, `/api/feed/:id/reply`) běží dál — dá se snadno vrátit
- SSL certifikát pro custom doménu se ověřuje automaticky po DNS propagaci (může trvat pár hodin až 24h od změny nameserverů)
