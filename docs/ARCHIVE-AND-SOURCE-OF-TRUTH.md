# ARCHIVE & SOURCE OF TRUTH

**Status:** Locked 2026-08-25  
**Rule:** Archive, do not delete — until the new operating system is fully stable.

---

## Single source of truth (LIVE)

| Location | Role |
|----------|------|
| **This GitHub repo** `getoutsidemidatlantic/getoutside` · branch `main` · folder `docs/` | Canonical masters |
| **This Grok project conversation** (Get Outside Mid-Atlantic consolidation thread) | Active operator session |

### Live master documents (use these only)

1. `docs/01-GOMA-Master-Curation-Research.md`
2. `docs/02-GOMA-Style-Document.md`
3. `docs/03-GOMA-Engineering.md`
4. `docs/04-GOMA-Workflow-Automations.md`
5. `docs/05-GOMA-Business-Monetization.md`
6. `docs/CHARACTER_BIBLE.md`
7. `docs/README-GOMA-OPERATING-SYSTEM.md`

Production data lives under `sports/data/` and `sports/intel.json`.  
Public product name: **Ops Center**. Deploy remains manual (Netlify Deploy Now).

---

## ARCHIVE — DO NOT USE

Anything that is **not** the list above is **archived** until further notice.

### Includes (non-exhaustive)

- Older Grok folders / projects / conversations that claimed to be “the master” or held “from here on out” rules
- Past weekly curation prompts stored only inside those chats
- Engineering / SOC / schedule docs that pre-date the 2026-08-25 lock (e.g. “Ops refresh light,” SOC public naming, Claude-in-loop variants)
- Duplicate or exploratory Drive copies of masters that were never promoted to `docs/` on `main`
- One-off HTML decks, RTF chat dumps, and zip carousel packages used as *input* to the lock (valuable history, not live rules)

### How to treat archived material

1. **Do not** open an archived Grok project and ask it to run Research Lock, Build Package, or Ops Refresh.
2. **Do not** paste rules from archived chats into production without re-validating against the five live masters.
3. **Do not** delete archived folders yet — keep them for recovery and audit until the new system has shipped several clean weekly cycles.
4. Prefer renaming / starring / moving orphaned Grok projects so the title starts with **`[ARCHIVE — DO NOT USE]`**.
5. If something useful is found only in an archive, **copy the content into this conversation** and promote it into the live `docs/` masters — never re-activate the old project as authority.

---

## Drive notes

| Folder | Status |
|--------|--------|
| `GOMA-site-backups` | Keep — weekly site zip mirrors |
| `GOMA-image-library` (primary) | Keep — surviving venue image index |
| Duplicate `GOMA-image-library` under backups | Optional cleanup later |
| `GOMA — Executive Strategy Deck_files` | Reference / archive; business content lives in `05-GOMA-Business-Monetization.md` |

---

## Why archive instead of delete

Fragmented masters caused conflicting “from here on out” rules. Deleting too early risks losing recovered decisions. Archiving preserves history while making the **live** path unambiguous: **this repo + this Grok project only.**

Revisit deletion only after several successful Tue–Thu weekly cycles with no need to open old chats.

---

*Archived 2026-08-25. Operator: Grok · Founder review: Dan.*
