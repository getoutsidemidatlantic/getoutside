# Get Outside Mid Atlantic

Source for [get-outside.info](https://get-outside.info) — your guide to better weekends across the Mid-Atlantic.

Get Outside Mid Atlantic covers outdoor recreation across Maryland, Virginia, Pennsylvania, Delaware, and West Virginia: boating, fishing, hiking, camping, breweries, and live music, organized around seven regions so people can find what's happening near them instead of scrolling a generic events feed.

## Pages

- **`index.html`** — main landing page
- **`weekends-hub.html`** / **`weekends/`** — regional weekend guides
- **`sports/index.html`** — Ops Center map (data-separated loader)

## Regions

1. Upper Chesapeake (MD)
2. Blue Ridge & Shenandoah (VA)
3. Western MD Mountains (MD)
4. West Virginia Highlands (WV)
5. PA Laurel Highlands & Poconos (PA)
6. Delaware & Coastal Beaches (DE / MD)
7. DC Metro / Piedmont (VA / MD)

## Tech

Plain HTML with Tailwind CSS via CDN, no build step. Fonts: Outfit + Plus Jakarta Sans (Google Fonts).

**Architecture:** Data is kept separate from the presentation layer so most updates are data-only. This is the scaling path.

## Deployment

Deploys automatically to Netlify on every push to **`main`**. No build command — static files as-is.

**Netlify production branch must be `main`.**

Never replace root `index.html` with the Ops Center map.

## Ops Center

- **`/sports/`** — Ops Center — live map of pro, college, practice, and outdoor action
- Data lives outside the main HTML so weekly refreshes stay light

## Monetization

Ko-fi tip jar: [ko-fi.com/getoutsidemidatlantic](https://ko-fi.com/getoutsidemidatlantic)  
Subtle support button is present on the main site footer and inside the Ops Center header.

## Social

- Instagram: [@getoutsidemidatlantic](https://instagram.com/getoutsidemidatlantic)
- TikTok: [@getoutsidemidatlantic](https://tiktok.com/@getoutsidemidatlantic)
- Facebook: [Get Outside Mid Atlantic](https://facebook.com/getoutsidemidatlantic)
- YouTube: [@getoutsidemidatlantic](https://youtube.com/@getoutsidemidatlantic)
- X: [@getoutsidematl](https://x.com/getoutsidematl)
