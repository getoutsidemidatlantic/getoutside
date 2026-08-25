# GOMA Style Document
**Website · Ops Center · Social Carousels**  
**Status:** v1.0 — locked 2026-08-25  
**Owner:** Grok · Review: Dan

Unified visual and voice rules across all surfaces.  
Characters and layout never invent a different story from the locked research.

**Primary visual quality bar:** the Seneca Rocks GOMA character example — clean deadpan cartoon character with bold outlines, consistent proportions, and strong environmental integration. All site and carousel art should aim for this level of finish and identity.

---

## 1. Brand Visual System (Site + Cards)

- Background: near-black (`#020617` / slate-950)
- Accent: amber (`#f59e0b`) used sparingly for kickers, CTAs, highlights
- Fonts: **Outfit** (700–800) for headlines · **Plus Jakarta Sans** for body
- Cards: rounded-2xl, subtle slate borders
- Overall feel: clean, modern, outdoor-weekend, never corporate

**Homepage “Top Picks Across the Region” section is the gold-standard reference** for region cards:
- Five equal state cards
- Character illustration matching the region/event energy
- State name + short event line + pick count
- Dark cards on near-black background with amber accents

**Curation hit / intel cards** (Ops Center + region pages):
- Small thumbnail image of the location (public / no-copyright web source) required on every hit when available
- Thumbnail sits left or top of the card, consistent size
- “Why people love it” text is present in data and revealed when Hype layer is active

---

## 2. Character System (LOCKED)

Source of truth: `docs/CHARACTER_BIBLE.md` in the repo.

**Style:** Construction-paper / flat cutout, bold outlines, limited palette, deadpan faces.  
South Park–adjacent energy **without copying any IP**. Original characters only.  
Eyes must not be the iconic South Park bubble style (copyright safety). Prefer large white eyes with simple black pupils and a slight deadpan or mild expression.

| Character | Role | Signature |
|-----------|------|-----------|
| **Dan** | Ops lead / map person | Folded map or plan, calm “this will go sideways” energy |
| **Jax** | Sports-crazy | Paddle / field energy, knows the matchup, still deadpan |
| **Sam** | Hills / folk / inland | Beanie, low-key festival or trail energy |
| **Kevin** | Chaos / fairgrounds | Broken or duct-taped paddle, mild mishap, still committed |

**Rules**
- Characters are selected or generated to match the locked research
- They never invent a different story
- One clear prop per shot
- Continuity of face shapes, hair, body proportions, and palette across weeks (recognizable at thumbnail size)
- Team shots: Dan slightly forward or center
- Clothing can carry a small GOMA mark when it fits the scene, but never corporate logo spam

---

## 3. Grok Imagine Art Generation Process (DETAILED)

This is the operating standard for all character art used on the website (region cards, heroes, featured art) and social carousels. Goal: consistent, high-quality, on-brand assets at the finish level of the Seneca Rocks reference.

### 3.1 Core Style Contract (always lead with this)

Every prompt and every edit must begin with (or strongly reinforce) these words so the model does not drift into soft anime, photorealism, or generic cartoon:

> Construction-paper cutout illustration, flat colors, bold black outlines, South Park–adjacent deadpan style, original character only, simple shapes, limited palette, no photorealism, no text in image unless explicitly requested.

Additional locked visual constraints:
- Large simple eyes (white sclera + black pupil), mild/deadpan expression preferred
- Spiky or distinctive hair that reads at small sizes
- Clean silhouette
- One clear prop or pose that sells the character’s role
- Outdoor Mid-Atlantic setting must be readable in one second (rocks, water, fairgrounds, hills, barns, stages, etc.)

### 3.2 Recommended Generation Workflow

1. **Anchor generation** — Generate the single most important hero or character pose first.
2. **Identity lock** — Subsequent images for the same character should be produced by **editing** from that base.
3. **Environment integration** — Character must still read as the flat/cutout style even when the background is more detailed.
4. **Set consistency for carousels** — Derive state slides and CTA by editing from the same character identity and palette.
5. **Verification loop** — Check style contract, Character Bible match, no soft-anime drift, research alignment.

### 3.3 Prompt Templates

**Base character seed:**
```
Construction-paper cutout illustration, flat colors, bold black outlines, South Park–adjacent deadpan style, original character only. [CHARACTER NAME], [short physical + clothing description], [prop], standing/posing at [specific place or event], Mid-Atlantic outdoor weekend, simple shapes, limited palette, large simple eyes, mild expression, no photorealism, no text in image.
```

**Edit / consistency prompt:**
```
Same character identity, same face, same hair, same clothing and proportions, same bold outline style. Only change: [new pose / new prop / new background]. Keep construction-paper cutout, South Park–adjacent deadpan look. No soft anime, no photorealism.
```

### 3.4 Quality Bar & Rejection Criteria

**Ship when:** Character is instantly recognizable; style matches Seneca Rocks finish level; setting is clearly Mid-Atlantic outdoor and matches the research lock; reads cleanly at thumbnail size and at 1080×1350.

**Reject / re-edit when:** Soft anime eyes or glossy shading; face/body drift; extra fingers or garbled text; background overwhelms character; character invents a story that contradicts the locked research.

### 3.5 File & Usage Notes

- Site region cards and heroes: sufficient resolution for retina web use
- Carousel slides: final delivery 1080×1350 PNG
- Keep intermediate Imagine results organized per week for identity reuse
- Always cross-check against `docs/CHARACTER_BIBLE.md`

---

## 4. Ops Center UI Style

- Public name: **Ops Center** only
- Layers panel order locked:
  1. Select all / Clear all
  2. Weather vibes
  3. Hype
  4. Density heatmap
  5. Sports (collapsible, default open, all ON)
  6. Field + Entertainment (default open, all ON)
- Share Tech Mono on layers panel + live clock only
- All Sport + Field + Entertainment layers ON and visible at load
- Weather / Hype / Heat remain user toggles

---

## 5. Social Carousel Style (Path A)

**Layout (LOCKED):**
1. **Cover** — logo, 5-state character strip (MD VA PA DE WV), THIS WEEKEND + dates, headline, save CTA, SWIPE
2. **State slides** (×5) — art banner, state badge, short headline, audience tags, event bullets, LINK IN BIO
3. **CTA** — character strip + which state + get-outside.info/weekends-hub

**Visual rules**
- Match the live site featured art and homepage card style
- 1080×1350 PNGs, named 01 → 07
- Minimal text; art carries the weight
- Same construction-paper deadpan characters via the process in Section 3
- No soft anime drift
- No redesigning the structure mid-week

**Posting**
- Upload 01→07 as IG carousel
- Paste CAPTION.txt only
- One permanent folder per real post + single READY flag
- After confirmed live → move folder + READY into `_archive`

---

## 6. Voice & Tone

- Deadpan + lightly absurd, clean
- Warm, outdoorsy, weekend-focused
- Never corporate cheer
- Light FOMO used sparingly and only on the strongest picks
- Second-person where natural

---

## 7. Known Gaps / Next Refinements

- Full frame-by-frame notes from previous solid carousel packages
- Exact micro-spacing / type scale for Ops Center panels
- Decision on GOMA logo frequency on character clothing
- Library of approved base poses per character for faster weekly reuse

---

*v1.0 locked 2026-08-25. Primary references: live homepage Top Picks cards, Character Bible, Seneca Rocks GOMA character example, recovered carousel packages.*
