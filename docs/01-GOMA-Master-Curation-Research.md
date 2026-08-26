# GOMA Master Curation / Research Document
**Get Outside Mid-Atlantic · get-outside.info**  
**Status:** v1.3 — locked 2026-08-25 (must-have targets + D2/D3 typing)  
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

## 3A. Must-Have Research Targets (LOCKED)

Volume floors alone are not enough. The following are **always-scan** targets. If an item has a real, public, in-window home event or open date and it is missing from the Research Lock without a documented reason, the lock fails Review Gate.

This list is a **never-miss floor**, not a maximum. Hidden gems and timely extras still go on top.

### Sports — always scan (~30-day window)

**Pro football (NFL)**  
- Ravens (M&T Bank Stadium)  
- Commanders (home stadium in corridor)  
- Eagles (Lincoln Financial Field)  
- Steelers (Acrisure Stadium)  

**Pro baseball**  
- Orioles (Camden Yards)  
- Nationals (Nationals Park)  
- Primary MiLB affiliates in corridor (e.g. Norfolk Tides, Richmond Flying Squirrels, and other active home clubs in window)

**College football — all levels with home games in MD / VA / PA / DE / WV**  
- FBS / Power programs in corridor (e.g. Penn State, West Virginia, Maryland, Virginia, Virginia Tech, Pitt when in window)  
- FCS programs with home games in corridor  
- **D2 / D3 football** with home games in corridor (type as `d2` in data — do not fold into generic `college`)  
  Examples to scan: Towson, Delaware (when applicable), Shippensburg, Frostburg, Shepherd, and other active Mid-Atlantic D2/D3 home schedules  

**Other college outdoor (home / public meets)**  
- Soccer, baseball, lacrosse, outdoor track where schedules are public and in window  

**Other sports**  
- MLS / NWSL home clubs in corridor (e.g. Union, D.C. United)  
- Golf: PGA / Korn Ferry / notable regional events when in corridor and in window  
- Practice / open training sessions when officially announced and public  

**Typing rule:** Use `college` for FBS/FCS-style primary programs; use `d2` for D2/D3 so the Ops Center D2/D3 layer populates. Never leave D2/D3 at zero when home games exist in window.

### Field — always scan

- Named **state parks** and major trail systems per region (MD, VA, PA, DE, WV)  
- Peak **fishing** windows and known launches / piers with public access  
- **Racing** (motorsport, bike, trail) when scheduled in corridor  
- Signature outdoor draws (e.g. White Marlin Open class events, major regattas) when in season  

### Entertainment — always scan

- Major outdoor festivals already in season  
- Amphitheater / outdoor concert series with announced dates in window  
- State / regional fairs when active  

### Failure condition

Missing a must-have that has a real public date in the research window, with no note in the lock explaining why it was excluded, is a Review Gate failure. Do not ship the week with a silent gap on NFL, primary college football (including D2/D3 home games), primary MiLB, or signature Field/Entertainment draws.

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

## 12. Locked Decisions (2026-08-25)

1. Heat map on event congestion is an official toggleable layer.
2. Hard volume floors: 100+ per domain every run; Sports stretch to 200 when possible.
3. “Why people love it” statement required on every hit; surfaced via Hype layer.
4. Small thumbnail required on every curation hit.
5. Source list stays creative and rotating; missing major popular events is a failure condition.
6. Featured Shot + Hidden Gem are mandatory and must be reasoned.
7. File naming is flexible; “SOC” is fine when it means combined multi-domain data.
8. Occasion tags locked to the 12-term list; 1–4 per venue/event.
9. Local custom venue image set is canonical for panel heroes.
10. Ops Center default time filter = 30 days.
11. Every map pin must open the intel panel with hero on click.
12. **Must-Have Research Targets** (§3A) are always-scan; missing an in-window must-have without a documented reason fails Review Gate.
13. D2/D3 football home games in corridor are typed `d2` (not folded into generic `college`).
14. Select All / Clear All toggles Sports **and** Field/Entertainment layer checkboxes.

---

*v1.3 locked 2026-08-25: Must-Have Research Targets + D2/D3 typing rule + Select All/Clear All scope.*
