# GOMA Workflow & Automations
**Weekly Cycle · Triggers · Human Gates**  
**Status:** v1.3 — locked 2026-08-26 (featured Drive auto-manifest)  
**Owner:** Grok · Review: Dan

One research lock feeds the entire week.  
Everything else is automation-first with minimal intentional human gates.

---

## 1. Weekly Clock (ET)

| Day / Time | Action | Owner / Method |
|------------|--------|----------------|
| **Tue 7:00 PM** | Research Lock | Grok automation |
| **Wed 10:00 AM** | Build Package | Grok automation |
| **Wed PM** | Review Gate | Dan (quality check only, ~5–10 min) |
| **Wed night / Thu** | Deploy Now | Dan (Netlify production, manual) |
| **Thu–Fri** | Social Path A | Dan (after live site + READY flag) |
| **Sun 3:00 AM** | Ops Refresh (**FULL**) | Grok automation |

Calendar reminders: getoutsidemidatlantic@gmail.com

---

## 2. Automation Definitions

### Research Lock (Tue 7 PM)
- Produces the single canonical weekly research package
- Covers Sports + Field + Entertainment with equal vigor
- Must meet volume floors: ≥100 per domain (Sports stretch to 200 when possible)
- Includes mandatory reasoned Featured Shot + Hidden Gem per region
- Includes “why people love it” statements + thumbnails for hits
- Outputs feed homepage cards, region pages, hub, social packages, and Ops Center data
- Later steps do **not** re-research or invent new top picks

### Build Package (Wed 10 AM)
- Converts the lock into site surfaces + social assets
- Pushes to git `main`
- Stores packages in Drive
- Generates carousel package (01–07 + CAPTION.txt + STATUS) under the correct socials/ structure
- **Hard rule:** After any push of `ops-core.js`, `map-app.js`, or data JSON, verify raw/API size > 0. Empty critical files break the Ops Center.
- **Featured card art (LOCKED):**
  1. Generate Seneca-style Sam JPGs named `{region}-{scene}-sam.jpg`.
  2. Upload to Drive folder `GetOutside - Featured Card Assets` (`1xo-kQ2evfEw29Pj1N0dSmpoEuAzejs1H`). Files must be Anyone with the link.
  3. Search Drive for those filenames. Upsert IDs into `assets/featured/drive-library.json`.
  4. Rewrite `assets/featured/drive-manifest.json` for the lock week (names + dest only). Do not hand-edit IDs on the manifest.
  5. Commit those two JSON files. GitHub Action `pull-featured-from-drive.yml` resolves name → ID from the library, downloads JPGs onto `assets/featured/*.jpg`, and pushes the binaries.
  6. Hub cards: `.jpg` → `.svg` → scene-banner.

### Ops Refresh (Sun 3 AM) — FULL
- Updates Ops Center data, intel ticker, field-sites window, and weather
- **Full refresh** (not light)
- Field and Entertainment receive same depth and volume as Sports (≥100 floor)
- Does **not** rewrite weekend lifestyle pages
- Does **not** rewrite featured card art or the Drive manifest

---

## 3. Human Gates (Intentional & Minimal)

1. **Review Gate (Wednesday)** — quality check only  
2. **Deploy Now** — Dan triggers and verifies Netlify production  
3. **Social posting** — only after deploy + READY flag is set

Everything else is automation-first.

---

## 4. Deploy Now Procedure

1. Confirm Review Gate is complete and `main` contains the correct week’s files
2. Confirm featured JPG pull Action is green (or hub fallback art is acceptable)
3. Dan triggers a production deploy on Netlify (manual, to control credit use)
4. Wait for the deploy to finish and the live site to update
5. Smoke check: homepage cards, weekends-hub + region pages, Ops Center (layers, Hype, Sports pin → panel with hero, **Field pin → panel with hero**, non-zero ops-core.js / map-app.js)
6. Only after the live site is confirmed correct is the **READY flag** set for social posting

---

## 5. Social Path A Rules

- Built during Build Package from the same research lock + character art
- Delivered to Drive `socials/` folders
- Captions and visuals remain consistent with the live site
- One permanent folder per real post
- Create `READY-<foldername>.txt` **only once**, on the single final folder, after iteration is finished
- After a post is confirmed live → immediately move that folder + its READY flag into the platform’s `_archive` subfolder
- Platform roots stay pending/in-progress only
