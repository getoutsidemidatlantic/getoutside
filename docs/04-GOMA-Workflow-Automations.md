# GOMA Workflow & Automations
**Weekly Cycle · Triggers · Human Gates**  
**Status:** v1.5 — social-pack HARD gate 2026-09-02  
**Owner:** Grok · Review: Dan  
**Canonical pipeline:** `docs/06-PIPELINE-GOLD.md` §2A.

One research lock feeds the entire week.  
Everything else is automation-first with minimal intentional human gates.

---

## 1. Weekly Clock (ET)

| Day / Time | Action | Owner / Method |
|------------|--------|----------------|
| **Tue 7:00 PM** | Research Lock | Grok automation |
| **Wed 10:00 AM** | Build Package | Grok automation — **site + social pack, or the build is not done** |
| **Wed PM** | Review Gate | Dan |
| **Wed night / Thu** | Deploy Now | One Netlify publish (`stop_builds` stays) |
| **After live + manifest ready** | Social Path A | Meta Business Suite |
| **Sun 3:00 AM** | Ops Refresh (FULL) | Grok automation |

---

## 2. Automation Definitions

### Research Lock (Tue 7 PM)
- Single canonical weekly package
- Sports + Field + Entertainment equal vigor
- Later steps do **not** re-research

### Build Package (Wed 10 AM)
- Converts the lock into site surfaces **and** social assets in the same run
- Pushes to git `main`
- Writes Drive `socials/YYYY-MM-DD/` (7 PNG + CAPTION + ALT + POST-ORDER)
- Writes `assets/socials/manifest.json` with `week` = lock date and `status` = `ready`
- **HARD:** leaving `status=missing` means the build missed Path A. Do not set READY.
- **HARD:** do not point `week` at last week's folder. Reuse of prior slides is a fail.
- Empty-file rule still applies to ops-core / map-app / soc / field-sites / intel

### Ops Refresh (Sun 3 AM)
- Data, ticker, field window, weather only
- Does **not** rewrite lifestyle pages or the social pack

---

## 3. Human Gates

1. Review Gate — quality only  
2. Deploy Now — production publish  
3. Social — only if live smoke passed **and** `assets/socials/manifest.json` status is `ready` for this lock week

---

## 4. Deploy Now

Validate job green is enough to publish the **site**.  
`social-pack` job may be red; that blocks Path A, not the website.

---

## 5. Social Path A

- Same lock as the live cards
- 1080×1350 PNG, headline 76–80px, title 44–48px, two events, Imagine heroes
- Order: 01-cover … 07-cta
- Schedule Fri 11:00 AM ET in Meta Business Suite until Graph tokens exist
