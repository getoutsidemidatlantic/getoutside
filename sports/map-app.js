// Ops Center map-app.js — Field + Entertainment layers
// Sports stay in ops-core.js. Field + Entertainment load from data/field-sites.json
// ALL layers on by default. Icons (not plain dots) for every sublayer.

(function () {
  const fieldColor = {
    Festivals: '#f59e0b', Concerts: '#a855f7', Camping: '#22c55e', Trails: '#16a34a',
    'Scenic Lookouts': '#0ea5e9', Lakes: '#06b6d4', History: '#a78bfa', Paddling: '#14b8a6',
    Music: '#a855f7', Parks: '#14b8a6', Fairs: '#eab308', Food: '#f97316',
    Breweries: '#b45309', 'Dock Bars': '#0369a1', Waterfalls: '#0284c7',
    'MX / ORV': '#92400e', Fishing: '#0f766e', Other: '#64748b'
  };
  const fieldEmoji = {
    Festivals: '🎪', Concerts: '🎵', Camping: '⛺', Trails: '🥾',
    'Scenic Lookouts': '🏔️', Lakes: '💧', History: '🏛️', Paddling: '🛶',
    Music: '🎵', Parks: '🏞️', Fairs: '🎡', Food: '🅱️',
    Breweries: '🍺', 'Dock Bars': '🍹', Waterfalls: '💦',
    'MX / ORV': '🏍️', Fishing: '🎣', Other: '📍'
  };
  const fieldLayerGroups = {};
  window.fieldLayerGroups = fieldLayerGroups;
  function ensureGroup(sub) {
    if (!fieldLayerGroups[sub]) fieldLayerGroups[sub] = L.layerGroup();
    return fieldLayerGroups[sub];
  }
  function makeFieldIcon(sub) {
    const emoji = fieldEmoji[sub] || '📍';
    const color = fieldColor[sub] || '#64748b';
    return L.divIcon({
      className: '',
      html: '<div class="field-icon" style="background:' + color + '">' + emoji + '</div>',
      iconSize: [28, 28], iconAnchor: [14, 14]
    });
  }
  function popupHtml(item) {
    const title = item.title || item.name || 'Event';
    const note = item.note || '';
    const tag = item.tag || item.sublayer || '';
    const url = item.url || item.official || '#';
    const id = item.id || '';
    const city = item.city ? '<div style="font-size:0.75rem;color:#94a3b8;margin-bottom:4px">' + item.city + '</div>' : '';
    const dates = item.dates ? '<div style="font-size:0.72rem;color:#64748b;margin-bottom:6px">' + item.dates + '</div>' : '';
    const intelBtn = id ? '<button type="button" onclick="openPanel(\'' + id + '\')" style="margin-top:4px;margin-right:8px;padding:4px 10px;border-radius:6px;border:0;background:#22c55e;color:#0b1220;font-weight:700;cursor:pointer">Intel</button>' : '';
    const openLink = (url && url !== '#') ? '<a href="' + url + '" target="_blank" rel="noopener" style="font-size:0.75rem;color:#0284c7;font-weight:600">Open →</a>' : '';
    return '<div style="min-width:180px;font-family:system-ui,sans-serif">' +
      '<div style="font-size:0.7rem;font-weight:700;color:#f59e0b;text-transform:uppercase;margin-bottom:2px">' + tag + '</div>' +
      '<div style="font-weight:700;font-size:0.95rem;margin-bottom:4px">' + title + '</div>' +
      city + dates +
      '<div style="font-size:0.8rem;color:#64748b;margin-bottom:8px">' + note + '</div>' +
      intelBtn + openLink + '</div>';
  }
  function getLatLng(item) {
    if (item.lat != null && (item.lon != null || item.lng != null)) {
      return [item.lat, item.lon != null ? item.lon : item.lng];
    }
    return [39.0, -77.5];
  }
  function injectLayerUI(sites) {
    const box = document.getElementById('layers');
    if (!box || document.getElementById('opsFieldGroups')) return;
    const fieldSubs = {};
    const entSubs = {};
    (sites || []).forEach(function (s) {
      const g = s.group || 'Field';
      const sub = s.sublayer || 'Other';
      if (g === 'Entertainment') entSubs[sub] = (entSubs[sub] || 0) + 1;
      else fieldSubs[sub] = (fieldSubs[sub] || 0) + 1;
    });
    function groupHtml(id, title, subs, defaultOpen) {
      const rows = Object.keys(subs).sort().map(function (sub) {
        const safe = sub.replace(/[^a-z0-9]/gi, '_');
        const color = fieldColor[sub] || '#64748b';
        const emoji = fieldEmoji[sub] || '📍';
        return '<label class="layer-item field-sub">' +
          '<input type="checkbox" class="field-layer-cb" data-sublayer="' + sub + '" id="lyField_' + safe + '" checked/>' +
          '<span class="layer-swatch" style="background:' + color + '">' + emoji + '</span> ' +
          sub + ' <span class="layer-count">' + subs[sub] + '</span></label>';
      }).join('');
      return '<div class="ops-group" id="' + id + '">' +
        '<button type="button" class="ops-group-toggle" aria-expanded="' + (defaultOpen ? 'true' : 'false') + '" data-target="' + id + '-body">' +
        '<span>' + title + '</span><span class="ops-group-chevron">' + (defaultOpen ? '▾' : '▸') + '</span></button>' +
        '<div class="ops-group-body" id="' + id + '-body" style="display:' + (defaultOpen ? 'block' : 'none') + '">' + rows + '</div></div>';
    }
    const wrap = document.createElement('div');
    wrap.id = 'opsFieldGroups';
    wrap.innerHTML = '<div class="layers-divider" style="height:1px;background:#1e3a55;margin:6px 0"></div>' +
      groupHtml('opsGroupField', 'Field', fieldSubs, true) +
      groupHtml('opsGroupEnt', 'Entertainment', entSubs, true);
    box.appendChild(wrap);
    wrap.querySelectorAll('.ops-group-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-target');
        const body = document.getElementById(id);
        if (!body) return;
        const open = body.style.display !== 'none';
        body.style.display = open ? 'none' : 'block';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        const chev = btn.querySelector('.ops-group-chevron');
        if (chev) chev.textContent = open ? '▸' : '▾';
      });
    });
    wrap.querySelectorAll('.field-layer-cb').forEach(function (cb) {
      cb.addEventListener('change', function () {
        const sub = cb.getAttribute('data-sublayer');
        const lg = fieldLayerGroups[sub];
        const m = window.map;
        if (!lg || !m) return;
        if (cb.checked) lg.addTo(m); else m.removeLayer(lg);
      });
    });
  }
  function openIntelFromUrl() {
    try {
      var q = new URLSearchParams(location.search || '');
      var id = q.get('intel') || q.get('venue') || '';
      if (!id && location.hash) {
        var h = String(location.hash).replace(/^#/, '');
        if (h.indexOf('intel=') === 0) id = decodeURIComponent(h.slice(6));
        else if (h.indexOf('venue=') === 0) id = decodeURIComponent(h.slice(6));
        else if (h) id = decodeURIComponent(h);
      }
      if (id && typeof window.openPanel === 'function') window.openPanel(id);
    } catch (e) { console.warn('intel url', e); }
  }
  window.openIntelFromUrl = openIntelFromUrl;
  function loadFieldSites() {
    return fetch('./data/field-sites.json')
      .then(function (r) { if (!r.ok) throw new Error('field-sites ' + r.status); return r.json(); })
      .then(function (data) {
        const m = window.map;
        if (!m) { setTimeout(loadFieldSites, 400); return; }
        const sites = data.sites || data || [];
        const list = Array.isArray(sites) ? sites : [];
        window.fieldSites = list;
        list.forEach(function (s) {
          const sub = s.sublayer || 'Other';
          const lg = ensureGroup(sub);
          const marker = L.marker(getLatLng(s), { icon: makeFieldIcon(sub) });
          marker.bindPopup(popupHtml(s));
          marker.on('click', function () { if (typeof window.openPanel === 'function') window.openPanel(s.id); });
          lg.addLayer(marker);
        });
        Object.values(fieldLayerGroups).forEach(function (lg) { if (!m.hasLayer(lg)) lg.addTo(m); });
        injectLayerUI(list);
        openIntelFromUrl();
      })
      .catch(function (err) { console.warn('Field layers:', err); });
  }
  function boot() { if (window.map) loadFieldSites(); else setTimeout(boot, 200); }
  boot();
})();
