# GOMA Master Curation / Research Document
**Get Outside Mid-Atlantic · get-outside.info**  
**Status:** v1.0 — locked 2026-08-24  
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
Hidden gems are encouraged when genuinely good and current.

**Never invent events.** Official sources and real dates only.

---

## 2. Research Lock Outputs (every Tuesday)

Required every Research Lock:

### A. Weekends / Lifestyle package
- Weekend top picks, marquees, and hidden gems **per region**
- Include more when the information is timely and relevant
- Featured Shot concept per region (actionable photo moment)
- Audience badges on every card (Family / Couples / Adventure / Squad / Girls Wknd)

### B. Ops Center data
- Sports venues + events + rich intel fields
- Field sites (fishing, parks, trails, racing, etc.)
- Entertainment sites (festivals, outdoor concerts, fairs)
- ~30-day sports window
- Weekend weather one-liners + icons per region
- All layers ready to be ON at load

### C. Supporting
- Short practical weather
- Hype / sentiment fields where available (people_love, enthusiasm, history, etc.)

**Effort target:** Balanced and thorough across all three domains.  
Lean enough for clean automation, rich enough that the Ops Center feels complete.

---

## 3. Quality Standards

- Official sources and real dates only
- No invented events or filler
- Quality still matters — volume is a floor, not a ceiling
- Hidden gems must be verifiable and under-the-radar (state fairs are never hidden gems)
- Fishing and racing are first-class Field categories
- State parks are actively scanned
- Weather stays short and practical
- The lock is **canonical**. Build Package and later steps do not invent new top picks.

---

## 4. Ops Center Data Requirements (critical)

On load the map must show:
- All Sport layers ON
- All Field + Entertainment sublayers ON and visible
- Weather / Hype / Heat as user toggles (default off is acceptable for overlays)
- Rich venue fields present so Hype actually does something:
  - `people_love`, `history`, `fan_sentiment_score`, `fan_themes`
  - Event-level: `enthusiasm`, `weather`, `temp_f`, `outdoor`
  - Marquee: `venue_id`, caption, teams/event_name, date/time, weather

**Sunday Ops Refresh = FULL refresh** (not light).  
Field and Entertainment receive the same depth and volume as Sports.  
Do not overwrite rich data with thinner content.

---

## 5. Voice & Tone (for any written curation output)

- Deadpan + lightly absurd, clean (South Park timing without the edge)
- Warm, outdoorsy, weekend-focused
- Never corporate
- Light FOMO used sparingly and only on genuinely strong picks
- Second-person where natural

---

## 6. What “Done” Looks Like for a Research Lock

- Five regions each have real, current top picks + hidden gem attempt + Featured Shot concept
- Sports, Field, and Entertainment data packages are balanced and non-empty
- Rich intel fields are populated where possible
- Weather one-liners ready
- No invented content
- Ready to hand off to Build Package without further research

---

## 7. Known Gaps / Open Questions (for Dan review)

- Exact target counts per domain / per region still to be tightened
- Preferred official source list (state park calendars, tourism boards, league sites, etc.)
- Whether Featured Shot + Hidden Gem remain mandatory every single week or become “strongly preferred”
- Final naming alignment for data files (`soc-a.json` / `soc-b.json` / `field-sites.json` / `soc-data.json`)

---

*Draft assembled from Engineering Doc v3.0, recovered curation prompt (Aug 10), Ops Center locks, Character Bible, and explicit user overrides (equal vigor + full Sunday refresh).*  
*Next: gap analysis with Dan → v1.0 lock.*
