# GOMA Business & Monetization
**Executive Overview + Revenue Architecture**  
**Status:** v1.1 — locked 2026-08-25  
**Owner:** Dan · Support: Grok

---

## 1. Positioning

**Get Outside Mid Atlantic** is the operating system for better weekends across Maryland, Virginia, Pennsylvania, Delaware, and West Virginia.

- Geographic moat: owns the corridor (national outdoor media is generic; city blogs stop at state lines)
- Temporal moat: weekly cadence beats evergreen listicles; Thursday urgency is the product
- Format moat: site + Ops Center map + social trailer from one research lock

**Tagline angle:** “Your guide to better weekends.”

---

## 2. Product Stack (already shipping)

- Site: homepage picks, weekends-hub, five region pages
- Ops Center: live map, layers, intel ticker
- Social machine: IG carousel, Reels, TikTok, YT Shorts — same lock
- Backup / ops: Git source of truth, Drive mirrors, Path A posting

**One rule:** One research lock → site + Ops + carousels → git → Drive mirror → one deploy → then social. No orphan content.

---

## 3. Cost Stack (lean)

| Line item | Est. / mo | Notes |
|-----------|-----------|-------|
| Netlify (Personal / credits) | $15–30 | Manual deploys only |
| Domain + DNS / email | $5–15 | get-outside.info + Gmail |
| AI (SuperGrok / usage) | $30–100 | Primary content engine |
| Design / stock / misc | $0–25 | Most art generated in-pipeline |
| Paid social boost (optional) | $0–200 | Only after organic baseline |
| **Core software floor** | **~$50–170** | Before ads boost |

Founder time is the real cost. Automation exists to keep that under ~3–5 focused hours/week once stable.

---

## 4. Monetization Architecture

### Already in motion
- **Ko-fi** — https://ko-fi.com/getoutsidemidatlantic (live in header)
- Soft support ask tied to keeping weekend intel and map layers running

### Near-term (0–12 months)
- Local / regional sponsors (outdoor retail, breweries, tourism boards, venues)
- Newsletter / hub sponsorships (geo-precise = higher CPM)
- **Amazon Associates (live 2026-08-25):**
  - Hub: `/gear.html` (full weekend kit catalog)
  - Contextual: Ops Center **intel panel only** — “Gear for this” (max 3 links)
  - Data: `sports/data/affiliate-kits.json` (kits + by_venue_id / type / sublayer / occasion maps)
  - Source sheet: Drive `assets/Affiliate links`
  - Disclosure on every surface with links: “As an Amazon Associate I earn from qualifying purchases.”
  - **Never** in Live Feed cards, map popups, or ticker
- Social package sponsorship (“presented by” weekly trailer)
- One solid monthly sponsor can clear the entire software floor

### Expansion (years 2–3)
- Premium “Weekend HQ” / Ops Center pro membership
- B2B: venue/destination featured placements
- Licensed Ops data widgets for partners
- Live experiences / partnered pop-ups
- Character merch (stickers via Ko-fi / POD) — tested lightly

### What to avoid early
- Heavy ads on the map page
- Affiliate product blocks in the Live Feed or map popups
- Paid tools that create monthly burn before revenue
- Broad “community membership” with no clear weekly deliverable
- National expansion before Mid-Atlantic density

---

## 5. Three-Year Path

- **Year 1 — Prove the loop:** Ship every week · grow IG/TikTok/email · land first 3–5 sponsors · stabilize Ops · target software costs covered + first profit dollars
- **Year 2 — Own the audience:** Email becomes primary asset · multi-sponsor packages · paid boost discipline · expand FOC / seasons
- **Year 3 — Make it sellable:** Recurring revenue mix · documented playbooks · reduced founder bottleneck · clean financials · explore strategic sale or roll-up interest

---

## 6. Exit Framing (directional)

Digital media assets with owned audiences typically trade on profit or revenue quality.

Buyers pay up for:
- Email list & first-party data
- Recurring sponsorship contracts
- Documented AI ops (low labor)
- Category authority in a region
- Clean books, low founder dependency

**Plausible outcomes**
- A · Lifestyle asset (steady 5-figure annual profit)
- B · Regional media sale
- C · Corridor roll-up chip (strategic premium for Ops + automation IP)

---

## 7. Next 90 Days (from deck — still relevant)

- Run the automated Tue/Wed loop without missing a week
- Convert every deploy into measurable social + site consistency
- Stand up email capture on hub + region pages
- Build a one-page media kit (audience, regions, packages, rates)
- Close first pilot sponsor (even at friendly pricing)
- Track: weekly ship rate, list growth, outbound sponsor conversations

---

## 8. Known Gaps / Updates Needed

- Current Ko-fi performance and copy refresh
- Status of Amazon Associates approval and live `/gear.html` links
- Actual email list size and capture points live today
- Any sponsorship conversations already in motion
- Updated cost numbers if Netlify or AI usage has changed

---

*Source: GOMA Executive Strategy Deck (20 slides, August 2026) + recovered monetization notes and live Ko-fi / gear page status.*  
*v1.1: Amazon Associates intel-panel + affiliate-kits.json locked.*
