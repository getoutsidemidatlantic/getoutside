# GOMA Pipeline Gold
**Status:** v1.1 — social-pack HARD gate locked 2026-09-02 16:30 ET  
**Owner:** Grok · Gate: Dan  
**Rule:** Every improvement is written here *and* in 02 / 03 / 04 the same night. Next run follows the docs. No tribal memory.

This is the operating contract. If a step is not in this file, it is not in the product.

---

## 0. Cost lock (budget plan)

| System | Rule |
|---|---|
| Grok | One Research Lock (Tue 19:00 ET). One Build Package (Wed 10:00 ET). One Ops Refresh (Sun 03:00 ET). No midweek redo unless Review Gate fails a HARD check. |
| GitHub Actions | Validate on push to `main`. Soft Drive pull. Social-pack job fails until this week is `ready`. |
| Netlify | `stop_builds: true` stays. **One** production publish per week after CI green. Not every commit. |
| Meta | Free Business Suite scheduler until Graph API tokens exist. No paid Buffer. |
| Art | Reuse locked Imagine heroes **for this lock week only**. Do not reuse last week's 7 slides. Do not regenerate unless Review Gate rejects type/hero quality.

Rollback is cheaper than a second full research pass.

---

## 1. Clock (ET)

| When | Job |
|---|---|
| Tue 19:00 | Research Lock → `docs/RESEARCH-LOCK-YYYY-MM-DD.md` |
| Wed 10:00 | Build Package → git `main` + Drive `socials/YYYY-MM-DD/` + `assets/socials/manifest.json` |
| Wed after CI green | Review Gate 5–10 min |
| Wed night / Thu | **One** Deploy Now |
| After live smoke **and** manifest `status=ready` | Meta Business Suite schedule |
| Sun 03:00 | Ops Refresh (data + ticker + weather only) |

Later steps do **not** re-research.

---

## 2. What good looks like (HARD)

- Homepage five cards use Imagine Sam art.
- `weekends-hub.html` has three named picks per state, each `/sports/?intel={id}`.
- Region pages have Ops intel buttons.
- `ops-core.js` / `map-app.js` size > 0 and contain `openPanel`.
- soc-a/b, field-sites, intel.json parse.
- Default 30d. Sports pin and Field pin open panel + hero.
- `?intel=mdrenfest` and `?intel=subscape` work.
- **Social pack exists for THIS lock week** (see §2A).
- Affiliate never in ticker / feed / popup.

## 2A. Social pack HARD gate (locked 2026-09-02)

Build Package is **not done** until all of these are true:

1. File `assets/socials/manifest.json` is on `main`.
2. `week` equals the date on the newest `docs/RESEARCH-LOCK-YYYY-MM-DD.md`.
3. `status` is `ready` (not `missing`, not last week's date).
4. `files` lists exactly:
   `01-cover.png` `02-maryland.png` `03-virginia.png` `04-pennsylvania.png` `05-delaware.png` `06-westvirginia.png` `07-cta.png`
5. Those seven PNGs + `CAPTION.txt` + `ALT.txt` + `POST-ORDER.txt` exist in Drive `socials/YYYY-MM-DD/`.
6. Type gold: 1080×1350, headline 76–80px, title 44–48px, two events, Imagine heroes.
7. Caption matches **this** lock. Reusing the prior week's slides is a fail.

CI job `social-pack` fails while `status != ready` or `week` ≠ lock date.
READY for Path A cannot be set while that job is red.
Site Deploy Now may still publish (validate-only). Social cannot.

---

## 3. Deploy + rollback

Netlify stays `stop_builds: true`. One Deploy Now per week after `goma-pipeline.yml` validate is green.

Live smoke:
- https://get-outside.info/
- https://get-outside.info/weekends-hub.html
- https://get-outside.info/sports/?intel=mdrenfest
- https://get-outside.info/sports/?intel=subscape

Rollback: Netlify → previous successful deploy. Git: previous `week-*` tag. Unschedule Meta if already queued. Do not re-run Research Lock to fix a broken page.

## 4. Social Path A

Blocked until §2A is green.

1. Live smoke passed.
2. `assets/socials/manifest.json` `status=ready` for this lock week.
3. business.facebook.com → Planner → Create post → Facebook Page (+ IG if linked).
4. Upload 01-cover … 07-cta in that order from Drive `socials/YYYY-MM-DD/`.
5. Paste CAPTION.txt.
6. Schedule Fri 11:00 AM America/New_York.
7. Planner screenshot closes the week.

Graph API later needs `META_PAGE_ID`, `META_PAGE_TOKEN`, `IG_USER_ID` in GitHub secrets. Until then MBS is the publisher.

## 5. Improvement rule

Docs win over chat. Update this file + 02/03/04 the same night as the change.
