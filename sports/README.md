# Ops Center

Live map: `index.html` (data-separated loader).

**Promote source:** Grok production artifacts

**Automation:** Weekly research → production data refresh → push → Netlify.

**Architecture:** Data stays separate from the page so most updates are data-only. This is the scaling path. We do not ship one giant self-contained HTML and we do not rely on fragile HTML chunking.

**Never** replace site root `index.html` with this map.

**Branding:** Always “Ops Center”. Never “Sports Operation Center”, “SOC”, or “FOC”.

**Monetization:** Ko-fi button is in the header → https://ko-fi.com/getoutsidemidatlantic

Contact: X [@getoutsidematl](https://x.com/getoutsidematl)
