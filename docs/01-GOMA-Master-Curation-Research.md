# GOMA Master Curation / Research Document
**Get Outside Mid-Atlantic · get-outside.info**  
**Status:** v1.4 — locked 2026-08-25 (verbose must-have research targets)  
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

## 3A. Must-Have Research Targets (LOCKED — verbose)

Volume floors alone are not enough. The following are **always-scan** targets. If an item has a real, public, in-window home event or open date and it is missing from the Research Lock without a documented reason, the lock fails Review Gate.

This list is a **never-miss floor**, not a maximum. Hidden gems and timely extras still go on top.  
Scan official calendars first (team sites, MiLB.com, NCAA, park systems, tourism boards). Real dates only.

**Typing rules (HARD)**  
- NFL / MLB / MiLB / soccer / golf / practice → use those types as today  
- FBS + FCS primary programs → `college`  
- **D2 + D3 football (and other D2/D3 outdoor when mapped)** → `d2` so the Ops Center D2/D3 layer populates  
- Never fold D2/D3 into generic `college`. Never leave the D2/D3 layer at zero when home games exist in the window.

---

### Sports — always scan (~30-day window)

#### NFL (all four corridor homes)
| Team | Venue | Notes |
|------|--------|------|
| Baltimore Ravens | M&T Bank Stadium | Preseason + regular season |
| Washington Commanders | Home stadium in corridor | All public home games |
| Philadelphia Eagles | Lincoln Financial Field | |
| Pittsburgh Steelers | Acrisure Stadium | |

#### MLB
| Team | Venue |
|------|--------|
| Baltimore Orioles | Oriole Park at Camden Yards |
| Washington Nationals | Nationals Park |

#### MiLB — affiliated clubs in corridor (home games in window)
**Maryland**  
- Chesapeake Baysox (Bowie / Prince George’s Stadium) — Orioles AA  
- Aberdeen IronBirds — Orioles High-A  
- Delmarva Shorebirds (Salisbury) — Orioles Single-A  
- Hagerstown Flying Boxcars (Atlantic League / independent — include when drawing)  

**Virginia**  
- Norfolk Tides — Orioles AAA  
- Richmond Flying Squirrels — Giants AA  
- Fredericksburg Nationals — Nationals Single-A  
- Salem RidgeYaks (when in window / Red Sox chain)  

**Pennsylvania**  
- Lehigh Valley IronPigs (Allentown) — Phillies AAA  
- Reading Fightin Phils — Phillies AA  
- Harrisburg Senators — Nationals AA  
- Altoona Curve — Pirates AA  
- Scranton/Wilkes-Barre RailRiders — Yankees AAA  
- Erie SeaWolves — Tigers AA  

**Delaware**  
- Wilmington Blue Rocks — Nationals High-A  

**West Virginia**  
- Charleston Dirty Birds (Atlantic League) when active home dates  

#### College football — FBS / power & primary corridor programs (`type: college`)
Scan every home game in window:
- Penn State (Beaver Stadium)  
- West Virginia (Milan Puskar Stadium)  
- Maryland (SECU Stadium)  
- Virginia (Scott Stadium)  
- Virginia Tech (Lane Stadium)  
- Pittsburgh (when home in corridor window)  
- Navy (Navy-Marine Corps Memorial Stadium)  
- James Madison  
- Old Dominion  
- Delaware (now FBS — still scan; type `college`)  
- Liberty (when home relevant to corridor audience)  

#### College football — FCS (`type: college`)
Home games in corridor, including but not limited to:
- Towson  
- Richmond  
- William & Mary  
- Villanova  
- Georgetown  
- Howard  
- Norfolk State  
- Morgan State  
- Delaware State  
- Hampton  
- Lehigh, Lafayette, Bucknell (Patriot League)  
- Duquesne, Robert Morris, and other PA FCS with home dates  

#### D2 / D3 football (`type: d2` — HARD)
Scan active home schedules in MD / VA / PA / DE / WV. Examples (not exhaustive — add any other active home program in window):

**Maryland D2/D3**  
- Frostburg State  
- Bowie State  
- Salisbury  
- McDaniel  
- Other CIAA / MEC / Centennial home programs in state  

**Virginia D2/D3**  
- Shepherd (WV/VA border — include)  
- Shenandoah  
- Randolph-Macon  
- Hampden-Sydney  
- Washington & Lee  
- Bridgewater, Emory & Henry, and other ODAC / active VA home programs  

**Pennsylvania D2/D3**  
- Shippensburg  
- Indiana (PA) / IUP  
- California (PA)  
- Slippery Rock  
- East Stroudsburg  
- West Chester  
- Bloomsburg  
- Millersville  
- Kutztown  
- Delaware Valley  
- Franklin & Marshall, Gettysburg, Dickinson, Ursinus, and other Centennial / MAC home programs with public home dates  

**West Virginia D2**  
- Shepherd  
- Fairmont State  
- Concord  
- Other Mountain East home programs in window  

**Delaware**  
- Any active D2/D3 home football in state in window  

If a listed program has **no** home game in the research window, note that once in the lock; do not invent games.

#### Other college outdoor (home / public)
When schedules are public and in window:  
- Men’s / women’s soccer (Power + strong mid-majors)  
- Baseball (especially spring and midweek when overlapping window)  
- Lacrosse (MD/VA/PA power programs — major draw)  
- Outdoor track & field meets at major facilities  

#### Soccer
- Philadelphia Union (Subaru Park)  
- D.C. United (Audi Field)  
- Any NWSL or other pro outdoor soccer home dates in corridor  

#### Golf
- PGA / Korn Ferry / notable regional tournaments when the event is in MD/VA/PA/DE/WV and in window  
- Major public courses only when a real tournament or signature public event is on the calendar (not every municipal tee time)  

#### Practice / open sessions
- NFL / college open practices when officially announced and public  

---

### Field — always scan

#### State parks & major public lands (by region)
Scan for open status, peak conditions, events, and access notes — not every trailhead, but the **named anchors**:

**Maryland**  
- Assateague / Ocean City–area public beaches & parks  
- Sandy Point State Park  
- Gunpowder Falls / Patapsco Valley  
- Deep Creek Lake State Park  
- Cunningham Falls / Catoctin  
- Point Lookout  
- Seneca Creek / Black Hill (when relevant)  

**Virginia**  
- Shenandoah National Park (Skyline Drive segments, major overlooks, campgrounds)  
- First Landing / False Cape  
- Lake Anna  
- Grayson Highlands / Mount Rogers area  
- Kiptopeke / Eastern Shore public sites  
- James River & New River access nodes with public events  

**Pennsylvania**  
- Presque Isle  
- Ohiopyle / Laurel Highlands  
- Ricketts Glen  
- Worlds End / R.B. Winter  
- Gettysburg NMP (outdoor experience, not only museum)  
- Delaware Water Gap corridor public sites  

**Delaware**  
- Cape Henlopen  
- Delaware Seashore  
- Trap Pond  
- Killens Pond  

**West Virginia**  
- New River Gorge National Park & Preserve  
- Blackwater Falls  
- Canaan Valley  
- Seneca Rocks / Spruce Knob area  
- Coopers Rock  

#### Fishing (first-class)
- Chesapeake Bay public launches & piers (MD/VA) with seasonal bite notes when timely  
- Inland lakes/rivers with known seasonal windows (e.g. Deep Creek, Smith Mountain, Susquehanna access)  
- Surf / inlet fishing on DE/MD Atlantic when in peak  

#### Racing
- Motorsport: known corridor tracks with scheduled race weekends in window (e.g. regional paved/dirt when published)  
- Major bike / trail race events when published  

#### Signature outdoor
- White Marlin Open class events (Ocean City) when in season  
- Major regattas / sail events on Bay or inland lakes when published  
- Peak leaf / bloom / migration weekends when they dominate regional demand  

---

### Entertainment — always scan

#### Outdoor music & amphitheaters
- Merriweather Post Pavilion  
- Jiffy Lube Live / major VA amphitheaters  
- Stage AE / outdoor Pittsburgh dates when relevant  
- Wolf Trap (Filene Center)  
- Other published outdoor series with real dates in window  

#### Festivals & fairs
- Maryland Renaissance Festival (when season active)  
- State fairs: Maryland, Virginia, Pennsylvania, West Virginia, Delaware when dates fall in window  
- Major city/waterfront festivals already announced (e.g. Artscape-class, Harbor Fests, leaf festivals)  
- Food & wine outdoor festivals with strong regional draw  

#### Concerts / one-offs
- Stadium or park concerts at NFL/MLB venues when announced  
- Campus outdoor concerts with public tickets  

---

### Failure condition (HARD)

Missing a must-have that has a **real public date in the research window**, with no note in the lock explaining why it was excluded, is a **Review Gate failure**.

Do not ship the week with a silent gap on:
- Any of the four NFL homes  
- Orioles or Nationals  
- Primary MiLB clubs with home stands  
- FBS/FCS home football in corridor  
- **D2/D3 home football when games exist**  
- Signature Field/Entertainment draws (White Marlin class, major amphitheater weekends, state fairs in season)

Document exclusions in one short line in the lock (e.g. “Frostburg: no home game in window”). That is enough.

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
12. **Must-Have Research Targets** (§3A verbose) are always-scan; missing an in-window must-have without a documented reason fails Review Gate.
13. D2/D3 football home games in corridor are typed `d2` (not folded into generic `college`).
14. Select All / Clear All toggles Sports **and** Field/Entertainment layer checkboxes.

---

*v1.4 locked 2026-08-25: Verbose must-have list — NFL/MLB/MiLB by club, FBS/FCS/D2/D3 by program, state parks by region, amphitheaters, fairs; D2 typing HARD.*
