# GOMA Master Curation / Research Document
**Get Outside Mid-Atlantic · get-outside.info**  
**Status:** v1.1 — locked 2026-08-25  
**Owner:** Grok (production) · Review: Dan

This is the single source of truth for weekly research standards.  
One Research Lock feeds the entire week (site, Ops Center, social).  
Later steps do not re-research or invent new top picks.

---

## 1. Scope & Equal Treatment (HARD RULE)

**Regions (equal treatment every week):**  
Maryland · Virginia · Pennsylvania · Delaware · West Virginia

**Domains (equal vigor, depth, volume, and timeliness):**  
- **Sports** — pro, college, practice, racing, tournaments (~30-day window)  
- **Field** — fishing, state parks, trails, outdoor activities with strong demand (first-class)  
- **Entertainment** — festivals, outdoor concerts, fairs, related events (first-class)

Sports, Field, and Entertainment are researched with the **same vigor**.  
The Ops Center must contain enough real, current data in every domain to feel legitimate and complete.  
Baseline volume in Field and Entertainment must be high enough for credibility.  
Hidden gems are encouraged when genuinely good and current — but major popular events must never be missed.

**Never invent events.** Official sources and real dates only.

---

## 2. Research Lock Outputs (every Tuesday)

Required every Research Lock:

### A. Weekends / Lifestyle package
- Weekend top picks, marquees, and hidden gems **per region**
- Include more when the information is timely and relevant
- **Featured Shot** (mandatory) + **Hidden Gem** (mandatory) per region
- Audience badges on every card (Family / Couples / Adventure / Squad / Girls Wknd)

### B. Ops Center data
- Sports venues + events + rich intel fields
- Field sites (fishing, parks, trails, racing, etc.)
- Entertainment sites (festivals, outdoor concerts, fairs)
- ~30-day sports window
- Weekend weather one-liners + icons per region
- All primary layers ready to be ON at load
- Heat map (event congestion) available as a toggleable layer

### C. Supporting
- Short practical weather
- Hype / sentiment fields (including “why people love it”)
- Thumbnail image (small, no-copyright / public-web source) for each curation hit

**Effort target:** Balanced and thorough across all three domains.  
Lean enough for clean automation, rich enough that the Ops Center feels complete.

---

## 3. Volume Targets (LOCKED)

Every Research Lock must deliver:

| Domain        | Minimum counts | Stretch target      |
|---------------|----------------|---------------------|
| Sports        | 100+           | Up to 200 if available |
| Field         | 100+           | —                   |
| Entertainment | 100+           | —                   |

These are floor numbers for Ops Center credibility. Quality still gates inclusion — do not pad with weak or invented entries.

---

## 4. Quality Standards

- Official sources and real dates only
- No invented events or filler
- Quality still matters — volume is a floor, not a ceiling
- **Major / popular events are non-negotiable** (NASCAR races, White Marlin Open, major festivals, peak seasonal draws, etc.). Missing these destroys legitimacy even if hidden gems are strong.
- Hidden gems must be verifiable and under-the-radar (state fairs are never hidden gems)
- Fishing and racing are first-class Field categories
- State parks are actively scanned
- Weather stays short and practical
- The lock is **canonical**. Build Package and later steps do not invent new top picks.

**Source strategy:** Creative and rotating. Re-using the exact same short list of sources every week produces staleness. Prefer primary calendars, league sites, tourism boards, park systems, local organizers, and timely secondary sources. Diversity of sources is a feature.

---

## 5. Featured Shot & Hidden Gem Rules (LOCKED)

Both are **mandatory** every week for every region.

They are never random. Selection must be reasoned:

- **Most popular / highest-demand** moment that week, **or**
- **Timeliness / peak condition** (peak leaf color, cherry blossom bloom, ideal fishing window, race weekend atmosphere, etc.)

Featured Shot = actionable photo moment tied to the above reasoning.  
Hidden Gem = real, current, under-the-radar option that still fits the weekend context.

---

## 6. Ops Center Data Requirements (critical)

On load the map must show:
- All Sport layers ON
- All Field + Entertainment sublayers ON and visible
- Weather / Hype / Heat as user toggles (default off is acceptable for overlays)
- **Heat map** = congestion / density of events layer (toggleable)

Rich venue / hit fields required so Hype and intel actually work:
- `people_love` / “why people love it” statement (revealed via Hype layer toggle)
- `history`, `fan_sentiment_score`, `fan_themes`
- Event-level: `enthusiasm`, `weather`, `temp_f`, `outdoor`
- Marquee: `venue_id`, caption, teams/event_name, date/time, weather
- **Thumbnail**: small location image (public / no-copyright web source) attached to each curation hit

**Sunday Ops Refresh = FULL refresh** (not light).  
Field and Entertainment receive the same depth and volume as Sports.  
Do not overwrite rich data with thinner content.

**File naming:** Flexible. “SOC” / “soc-data” style names are acceptable as long as the content rules above govern what goes in the files. SOC = the combined Field + Entertainment + Sports data surface.

---

## 7. Voice & Tone (for any written curation output)

- Deadpan + lightly absurd, clean (South Park timing without the edge)
- Warm, outdoorsy, weekend-focused
- Never corporate
- Light FOMO used sparingly and only on genuinely strong picks
- Second-person where natural

---

## 8. What “Done” Looks Like for a Research Lock

- Five regions each have real, current top picks + mandatory reasoned Featured Shot + mandatory reasoned Hidden Gem
- Sports ≥100 (stretch ≤200), Field ≥100, Entertainment ≥100 — all real and current
- “Why people love it” statement present for each hit (Hype-revealable)
- Thumbnail image attached to each curation hit
- Heat map data ready as a layer
- Rich intel fields populated
- Weather one-liners ready
- Major popular events of the period are present (no legitimacy gaps)
- No invented content
- Ready to hand off to Build Package without further research

---

## 9. Occasion Tags (LOCKED)

Use **1–4 tags** per venue or event from this vocabulary only. Same set on homepage cards, social carousels, and Ops Center intel panel.

1. Family  
2. Squad  
3. Solo Reset  
4. Date Night  
5. Girls Night Out  
6. Budget  
7. Splurge  
8. Kid-Friendly  
9. Dog-Friendly  
10. Photogenic  
11. Under the Lights  
12. Tailgate  

Optional when clearly true: Day Trip · All Ages · 21+

Venue-level and event-level `occasions` arrays are required on sports data objects so the Ops panel can render chips.

---

## 10. Venue / Stadium Image Rule (Ops)

- Every sports venue object carries an `image` URL (panel hero).
- Prefer the **surviving Image Library** (`sports/data/image-library-index.json` or Drive mirror).
- Unsplash / stable public CDNs preferred after Wikimedia 429/400 failures.
- Fallback: “No venue photo yet” placeholder in panel. Never invent URLs.
- Grok Imagine is **not** used for Ops Center thumbnails.

---

## 11. 30-Day Sports Window

- Research Lock populates a rolling ~30-day sports window (venues + events).
- Ops Center time filters: 7d / 14d / **30d (default on load)**.
- Feed and panel “Upcoming” respect the active rangeDays filter.
- Default rangeDays = 30 so the Ops Center feels complete immediately; user can tighten to 7/14.

---

## 12. Locked Decisions (2026-08-25)

1. Heat map on event congestion is an official toggleable layer.
2. Hard volume floors: 100+ per domain every run; Sports stretch to 200 when possible.
3. “Why people love it” statement required on every hit; surfaced via Hype layer.
4. Small thumbnail (no-copyright / public web source) required on every curation hit.
5. Source list stays creative and rotating; missing major popular events (NASCAR, White Marlin Open, etc.) is a failure condition.
6. Featured Shot + Hidden Gem are mandatory and must be reasoned (popularity or timeliness/peak condition).
7. File naming is flexible; “SOC” is fine when it clearly means the combined multi-domain data.
8. Occasion tags locked to the 12-term list; 1–4 per venue/event.
9. Surviving Image Library is canonical for stadium/venue panel photos; reuse only.
10. Ops Center default time filter = 30 days.

---

*v1.1 locked 2026-08-25: occasion taxonomy, image library, panel hero, 30d default.*
