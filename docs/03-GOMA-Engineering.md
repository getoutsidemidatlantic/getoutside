# GOMA Engineering Document
**System Architecture, Configuration & Disaster Recovery**  
**Status:** v1.0 — locked 2026-08-25  
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

- Live map loader: `sports/index.html`
- Field / Entertainment injection: `sports/map-app.js`
- Data files:
  - `sports/data/soc-a.json` / `soc-b.json` (venues + marquee + rich fields)
  - `sports/data/field-sites.json` (Field + Entertainment pins)
  - `sports/intel.json` (ticker)
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
| `sports/map-app.js` | Field/Entertainment markers + layer UI inject |
| `sports/data/soc-a.json` / `soc-b.json` | Primary venue + rich intel data |
| `sports/data/field-sites.json` | Field + Entertainment sites |
| `sports/intel.json` | Ops intel ticker |
| `sports/ops-layers.css` | Layer UI styles |
| `docs/CHARACTER_BIBLE.md` | Character source of truth |
| `gear.html` | Weekend kit / Amazon affiliates page |
| `scene-generator.js` | Region-aware card scenes / heroes support |
| **Image reference library** (see §5) | Surviving store of reusable venue / event images |

**Repo:** https://github.com/getoutsidemidatlantic/getoutside  
**Default branch:** `main` (production)  
**Netlify:** connected to repo · `stop_builds true` · git push does **not** auto-publish. Founder triggers “Deploy Now”.

---

## 4. Ops Center Technical Rules

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
- Critical rich fields must not be stripped:
  - `people_love` / “why people love it” (revealed by Hype layer)
  - `history`, `fan_sentiment_score`, `fan_themes`
  - Event-level: `enthusiasm`, `weather`, `temp_f`, `outdoor`
  - Marquee fields + `venue_id`
  - **Thumbnail** (small public / no-copyright location image or approved generic icon) on every hit
- After any data push: verify GitHub raw byte size > 0 and live files contain expected content

**Volume floors:**  
Every research / Ops data package must target high volume across Sports + Field + Entertainment. These are credibility floors.

**Operational rule:** Never push empty content to GitHub. Always verify file size on GitHub raw after push.

---

## 5. Image Reference Library & Thumbnail Rules (HARD)

**Goal:** Stop re-scraping the same venues every week. Build a surviving reference library once and reuse it. Saves time, tokens, and money.

### 5.1 Surviving reference file

Maintain a durable image reference store (Drive: GOMA-image-library folder, and/or repo under sports/data).

- **Stadiums, arenas, major venues, concert posters, well-known parks, fairgrounds, marinas, etc.**  
  Find a good public / no-copyright (or clearly usable) image **once**. Record it in the reference library with a stable key (venue name + city or venue_id).  
  On subsequent curation runs, **reuse the existing entry**. Do not re-scrape Camden Yards, FedExField, Merriweather, etc. every week.

- **Obscure or hard-to-image locations** (small trail systems, unnamed put-ins, minor trailheads, temporary pop-ups, etc.)  
  Use a **generic icon** from a small approved set (trail, water, park, festival, music, sports, etc.).  
  **Do not** spend Grok Imagine tokens generating custom art for operational map thumbnails. Imagine is reserved for character / carousel / hero art (see Style Document).

### 5.2 Rules of use

1. Before searching the web for a venue image, check the reference library first.
2. If a usable image already exists for that venue/key → use it.
3. If none exists and the venue is major/recognizable → find one good public image, add it to the library, then use it.
4. If the place is obscure or no clean image is reasonably available → assign a generic icon. Move on.
5. Never invent or hallucinate image URLs. Prefer stable, long-lived sources or locally stored copies under the library.
6. Thumbnails on Ops hits are small and functional; they are not the place for high-effort generative art.

### 5.3 Why this exists

Repeated full scrapes of the same stadiums and venues waste time and budget. A growing reference library compounds value across weeks and makes the Ops Center denser and more consistent without extra cost.

---

## 6. Disaster Recovery

- **Site:** restore from git `main`. If needed, use Drive `GOMA-site-backups/` weekly zip for the week folder.
- **Ops Center:** restore from production snapshots / latest clean run.
- Redeploy only via “Deploy Now” after verify.

### 6.1 Smoke check after every deploy (HARD RULES)

After every production deploy, confirm:

1. Homepage cards render
2. weekends-hub + at least one region page render
3. Ops Center:
   - Correct public label (“Ops Center”)
   - Layers panel present and ordered correctly
   - Map loads
   - Feed / marquee / panel behavior works
   - Hype reveal and thumbnails appear where expected
4. **Hit count gate:**  
   **There must be at least 200 hits visible / loaded on the Ops page.**  
   **Less than 200 hits = something broke.** Do not set the READY flag. Investigate data files, loader, or deploy before proceeding.

This 200-hit floor is a hard smoke-check failure condition, not a soft preference.

---

## 7. Hard Technical Rules

- Grok writes site + sports under the repo; Dan controls Netlify publish
- One research lock feeds site + socials
- Carousels never post before that week’s site is live
- Git is source of truth; Drive zips are mirrors only
- Public name is Ops Center
- Data-separated architecture is non-negotiable
- Volume floors + rich fields + thumbnails are non-negotiable for Ops Center legitimacy
- **Image reference library reuse is mandatory** for known venues
- **Generic icons only** for obscure locations — no Imagine spend on map thumbnails
- **≥200 Ops hits after deploy** or the smoke check fails

---

## 8. Related Documents

- 01-GOMA-Master-Curation-Research.md — volume, quality, Featured Shot / Hidden Gem, source strategy
- 02-GOMA-Style-Document.md — visual system, character art, Grok Imagine process for site/carousel characters
- 04-GOMA-Workflow-Automations.md — weekly clock and gates

---

## 9. Known Gaps / Next Steps

- Exact path and schema for the image reference library (JSON index vs folder of files) still to be finalized and created
- Approved list of generic icons for trails / water / parks / etc.
- Confirmation of current live hit counts so the 200 floor can be validated against reality

---

*v1.0 locked 2026-08-25. Adds the surviving image reference library, reuse-first policy, generic-icon fallback (no Imagine for map thumbs), and the hard ≥200 Ops hits smoke-check rule.*
