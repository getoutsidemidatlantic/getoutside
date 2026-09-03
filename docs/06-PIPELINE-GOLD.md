# GOMA Pipeline Gold
**Status:** v1.2 — atomic Build Package locked 2026-09-02 20:35 ET

If a step is not in this file, it is not in the product.

## Why last week felt manual

Automations already exist (`goma-research-lock`, `goma-build-package`, `goma-ops-refresh`). The miss was the Build Package prompt treating Drive socials as optional. Site could ship while `socials/YYYY-MM-DD/` stayed empty. That is now a failed run.

Meta Graph API is still blocked (no Page token). Path A after READY is Meta Business Suite until tokens exist. That part is not Grok posting. Everything before it is.

## Clock (ET)

| When | Job | Owner |
|---|---|---|
| Tue 19:00 | Research Lock | automation `goma-research-lock` |
| Wed 10:00 | Build Package | automation `goma-build-package` — **must finish Drive pack** |
| Wed PM | Review Gate | Dan |
| Wed night / Thu | Deploy Now | Dan / publish hook |
| After live + manifest ready | Path A schedule | Dan in MBS |
| Sun 03:00 | Ops Refresh | automation `goma-ops-refresh` |

## Build Package exit criteria (ALL required)

1. Homepage + hub + region pages match THIS lock week.
2. `?intel=` opens a panel (`sports/intel-boot.js` loaded).
3. Seven PNG 1080×1350 exist locally AND in Drive folder `socials/YYYY-MM-DD/` under parent `1RBGM3k_Xrc609h7YaDbA14Si8qujJv5r`.
4. CAPTION + ALT + POST-ORDER + STATUS=READY in that Drive folder.
5. `assets/socials/manifest.json` `status=ready`, `week` = lock date, `drive_folder_id` set, `reuse_prior_week=false`.
6. GitHub `social-pack` job green.

Missing Drive folder = BUILD FAILED. Do not wait for Dan to ask “where are the carousels.”

## Path A (not Graph)

business.facebook.com Planner. Upload 01–07 from that Drive folder. Caption from CAPTION.txt. Fri 11:00 AM ET.

## Improvement rule

Update this file the same night as the change.
