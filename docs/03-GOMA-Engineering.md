# GOMA Engineering Document
**System Architecture, Configuration & Disaster Recovery**  
**Status:** v1.2 — locked 2026-08-25 (architecture gold)  
**Owner:** Grok · Review: Dan

This document is the canonical technical reference for how the system works.

---

## 0. Naming Lock

- User-facing product name for the map/dashboard: **Ops Center**
- Nav, headers, titles, public copy: Ops Center
- URL path stays `/sports/` (short path; no forced rename)
- Internal file prefixes may still use GOMA-SOC-* or soc-* for continuity
- Do **not** use “Sports Ops”, “Sports Operation Center (SOC)”, or “FOC” in public UI
- “SOC” in file/data context is acceptable and means the combined multi-domain data surface (Sports + Field + Entertainment)

---

## 1. System Overview

Get Outside Mid Atlantic (GOMA) is an outdoor-adventure content brand covering Maryland, Virginia, Pennsylvania, Delaware, and West Virginia.

**Pipeline:** Weekly research → package → deploy → social  
**Surfaces:** Static website, Ops Center map, regional weekends pages, multi-platform social packs

**Ownership**
- Grok: site content, Ops Center data, weekly curation, Build Package
- Dan: Netlify “Deploy Now” (manual for credit control), Path A social posting, Review Gate
- Claude is **not** in the production loop

---

## 2. Core Architecture Principle

**Data stays separate from the page.**  
This is the scaling path.  
We do **not** ship one giant self-contained HTML and we do not rely on fragile HTML chunking.

- Live map shell: `sports/index.html`
- Core runtime: `sports/ops-core.js` (map init, Sports markers, Live Feed, intel panel, mobile drawers, time filters)
- Field / Entertainment injection: `sports/map-app.js` (loads `field-sites.json`, emoji icons, layer UI, marker click → panel)
- Data files:
  - `sports/data/soc-a.json` / `soc-b.json` (venues + marquee + rich fields + image + occasions)
  - `sports/data/field-sites.json` (Field + Entertainment pins + image)
  - `sports/data/image-library-index.json` (canonical image map)
  - `sports/intel.json` (ticker)
- Venue images (local): `sports/images/venues/*.jpg`
- Never replace site-root `index.html` with the map

File naming is flexible as long as content rules govern the payload. SOC-style names are fine.

---

## 3. Key Paths & Components

| Path | Role |
|------|------|
| `index.html` | Homepage regional top-picks |
| `weekends-hub.html` | Hub grid |
| `weekends/YYYY-MM-DD/{region}.html` | Regional pages |
| `sports/index.html` | Ops Center shell + loader |
| `sports/ops-core.js` | Map, Sports layers, feed, openPanel, openFieldPanel, mobile, rangeDays |
| `sports/map-app.js` | Field/Entertainment markers + layer UI inject + click → openPanel |
| `sports/data/soc-a.json` / `soc-b.json` | Primary venue + rich intel data |
| `sports/data/field-sites.json` | Field + Entertainment sites |
| `sports/data/image-library-index.json` | Venue image index (goma-custom paths) |
| `sports/images/venues/` | 64 locked custom JPGs (hero images) |
| `sports/intel.json` | Ops intel ticker |
| `sports/ops-layers.css` | Layer UI styles |
| `docs/CHARACTER_BIBLE.md` | Character source of truth |
| `gear.html` | Weekend kit / Amazon affiliates page |

**Repo:** https://github.com/getoutsidemidatlantic/getoutside  
**Default branch:** `main` (production)  
**Netlify:** connected to repo · `stop_builds true` · git push does **not** auto-publish. Founder triggers “Deploy Now”.

---

## 4. Ops Center Technical Rules (LOCKED)

### 4.1 Layers & defaults
- Public label: Ops Center only
- Layers panel order locked:
  1. Select all / Clear all
  2. Weather vibes
  3. Hype
  4. Density heatmap (event congestion)
  5. Sports (collapsible, default open, all ON)
  6. Field + Entertainment (default open, all ON)
- Select All / Clear All must affect every checkbox
- All Sport + Field + Entertainment layers ON and added to map on initial load
- Weather / Hype / Heat are user toggles (default off for overlays is acceptable)

### 4.2 Runtime split (architecture gold)
- `ops-core.js` owns: Leaflet map, Sports markers, Live Feed + marquee, time filters (default 30d), intel panel, mobile Layers/Feed drawers, status bar, heat layer.
- `map-app.js` owns: Field + Entertainment only. Loads `./data/field-sites.json`, builds emoji divIcons, injects layer groups into the Layers panel, binds `marker.on('click')` → `window.openPanel(id)`, and exposes `window.fieldSites`.
- Both scripts are required. An empty `ops-core.js` or `map-app.js` breaks the entire Ops Center.

### 4.3 Intel panel behavior (HARD)
- Every map pin (Sports, Field, Entertainment) opens the right intel panel on click.
- Sports path: `openPanel(id)` looks up venue in `venues` array → hero image + occasions chips + events in window.
- Field/Entertainment path: if not found in venues, look up `window.fieldSites` → `openFieldPanel(s)` → hero image + group/sublayer/dates chips + note + official link.
- Popup also contains an “Intel” button that calls the same `openPanel(id)`.
- `#panelHeroWrap` sits above the panel header. Image uses class `panel-hero` with onerror fallback.
- Data contract:
  - Every sports venue in soc-a/soc-b carries `image` (path) and `occasions` (1–4 from locked taxonomy).
  - Every field site carries `image` (path) when available.

### 4.4 Time filter defaults
- UI buttons: 7d · 14d · 30d
- **Default on load: 30d** (`rangeDays = 30`, active class on 30d button).
- Date filter uses local-midnight parsing of `YYYY-MM-DD` to avoid UTC edge cases.
- This ensures the 30-day sports window populates the Live Feed immediately.

### 4.5 Critical rich fields (do not strip)
- `people_love` / “why people love it” (revealed by Hype layer)
- `history`, `fan_sentiment_score`, `fan_themes`
- Event-level: `enthusiasm`, `weather`, `temp_f`, `outdoor`
- Marquee fields + `venue_id`
- Thumbnail / hero image on every hit

### 4.6 Empty-file prevention (HARD RULE)
- **Never push empty content to GitHub.**
- After every push of `ops-core.js`, `map-app.js`, or any data JSON: verify GitHub raw (or API size) > 0 and contains expected markers (`openPanel`, `fieldSites`, `rangeDays`, etc.).
- Empty `ops-core.js` has previously taken the entire Ops Center offline. Treat any 0-byte critical JS as a P0 incident.

**Volume floors:**  
Every research / Ops data package must target high volume across Sports + Field + Entertainment. These are credibility floors.

---

## 5. Venue Image System (LOCKED 2026-08-25)

**Goal:** One durable set of custom hero images for all map pins. No weekly re-scraping of the same stadiums and parks.

### 5.1 Canonical store
- **Local files:** `sports/images/venues/*.jpg` (64 locked as of 2026-08-25)
- **Index:** `sports/data/image-library-index.json`  
  Shape: `{ "updated", "note", "venues": { "<venue_id>": { "image", "source", "desc", "status" } } }`  
  `image` values are relative paths: `/sports/images/venues/<filename>.jpg`
- **Master tracking sheet:** Drive `GOMA-venue-image-master` (status HAVE / live_path / filename)

### 5.2 Special filename overrides (do not change)
| venue_id key | Live filename |
|--------------|---------------|
| mtbank / m&t | `m&tbank.jpg` |
| camden / camdenyards | `camdenyards.jpg` |
| nats / nationals | `nationalspark.jpg` |
| puskar / milan | `milan.jpg` |

All other files follow the standard slug used in the master sheet.

### 5.3 Sync rule (after any new JPG upload)
1. Upload new JPG(s) into `sports/images/venues/`.
2. Update `image-library-index.json` (path + source = goma-custom + status).
3. Propagate the same `image` path into:
   - `soc-a.json` / `soc-b.json` venue objects
   - `field-sites.json` site objects
4. Update Drive master sheet (status = HAVE, live_path, filename).
5. Commit + push. Verify raw sizes > 0.
6. After Deploy Now, smoke-check a Field pin and a Sports pin both open the panel with the correct hero.

### 5.4 Rules of use
1. Before searching the web for a venue image, check `image-library-index.json` first.
2. If a usable goma-custom entry exists → use the local path.
3. If none exists and the venue is major → create/generate the JPG, add to library + sheet, then use it.
4. Obscure locations may still use a generic emoji icon on the map marker; the panel hero can remain empty or use a fallback.
5. Never invent or hallucinate image URLs. Prefer the local `/sports/images/venues/` set.
6. Grok Imagine is reserved for character / carousel / hero art (see Style Document), not for operational map thumbnails once the library is populated.

### 5.5 Why this is architecture gold
Repeated full scrapes waste time and tokens. The local 64-image set + index + field-sites/soc wiring makes every pin (Sports, Field, Entertainment) open a consistent intel panel with a real hero image. This is now the permanent pattern.

---

## 6. Disaster Recovery

- **Site:** restore from git `main`. If needed, use Drive `GOMA-site-backups/` weekly zip for the week folder.
- **Ops Center:** restore from production snapshots / latest clean run of ops-core.js + map-app.js + data files.
- Redeploy only via “Deploy Now” after verify.

### 6.1 Smoke check after every deploy (HARD RULES)

After every production deploy, confirm:

1. Homepage cards render
2. weekends-hub + at least one region page render
3. Ops Center:
   - Correct public label (“Ops Center”)
   - Layers panel present and ordered correctly (Sports + Field + Entertainment)
   - Map loads with Sports + Field emoji pins
   - Live Feed / marquee populate under the 30d default
   - **Click a Sports pin → intel panel opens with hero image**
   - **Click a Field/Entertainment pin (e.g. Sandy Point) → intel panel opens with hero image + note/dates/official**
   - Hype reveal works when toggled
4. **Hit count gate:**  
   **There must be at least 200 hits visible / loaded on the Ops page.**  
   **Less than 200 hits = something broke.** Do not set the READY flag. Investigate data files, loader, or deploy before proceeding.
5. Critical JS files (`ops-core.js`, `map-app.js`) are non-zero byte on the live site.

This 200-hit floor and the Field-pin-panel check are hard smoke-check failure conditions.

---

## 7. Hard Technical Rules

- Grok writes site + sports under the repo; Dan controls Netlify publish
- One research lock feeds site + socials
- Carousels never post before that week’s site is live
- Git is source of truth; Drive zips are mirrors only
- Public name is Ops Center
- Data-separated architecture is non-negotiable
- Volume floors + rich fields + thumbnails/heroes are non-negotiable for Ops Center legitimacy
- **Image library reuse is mandatory** for known venues
- **Never push empty critical JS or data files**
- **≥200 Ops hits after deploy** or the smoke check fails
- **Every pin (Sports + Field + Entertainment) must open the intel panel**

---

## 8. Related Documents

- 01-GOMA-Master-Curation-Research.md — volume, quality, Featured Shot / Hidden Gem, source strategy
- 02-GOMA-Style-Document.md — visual system, character art, Grok Imagine process for site/carousel characters
- 04-GOMA-Workflow-Automations.md — weekly clock and gates
- occasion-taxonomy-lock.md — locked occasion vocabulary for chips

---

## 9. Changelog (architecture locks)

- **v1.2 (2026-08-25)** — Architecture gold lock:
  - Explicit ops-core.js / map-app.js runtime split
  - Field/Entertainment pins open intel panel via openPanel → openFieldPanel
  - Custom venue image system (64 JPGs under sports/images/venues/, special filenames, image-library-index.json, sync rule)
  - Empty-file prevention elevated to HARD RULE
  - Smoke check now requires Field pin → panel with hero
  - Resolved prior “Known Gaps” on image library path/schema
- v1.1 — Image library + panelHero + 30d default + occasion chips
- v0.2 — Surviving image reference library, reuse-first policy, ≥200 hit floor

---

*This document is the single source of truth for Ops Center architecture. All future Build Package and Ops Refresh steps must preserve these contracts.*
