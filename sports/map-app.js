// Ops Center map-app.js — data-separated layers
// Sports stay in index.html. Field + Entertainment load from data/field-sites.json
// Architecture lock: ALL layers on by default; Select all / Clear all apply to Field + Entertainment

(function () {
  const loadingEl = document.getElementById('loading');

  function clearLoading() {
    if (loadingEl) loadingEl.remove();
  }

  function popupHtml(item) {
    const title = item.title || item.name || 'Event';
    const note = item.note || '';
    const tag = item.tag || item.sublayer || '';
    const url = item.url || item.official || '#';
    const city = item.city ? `<div style="font-size:0.75rem;color:#94a3b8;margin-bottom:4px">${item.city}</div>` : '';
    const dates = item.dates ? `<div style="font-size:0.72rem;color:#64748b;margin-bottom:6px">${item.dates}</div>` : '';
    return `
      <div style="min-width:180px;font-family:system-ui,sans-serif">
        <div style="font-size:0.7rem;font-weight:700;color:#f59e0b;text-transform:uppercase;margin-bottom:2px">${tag}</div>
        <div style="font-weight:700;font-size:0.95rem;margin-bottom:4px">${title}</div>
        ${city}${dates}
        <div style="font-size:0.8rem;color:#64748b;margin-bottom:8px">${note}</div>
        ${url && url !== '#' ? `<a href="${url}" target="_blank" rel="noopener" style="font-size:0.75rem;color:#0284c7;font-weight:600">Open →</a>` : ''}
      </div>`;
  }

  const fallbacks = {
    'State Fair of WV': [37.8, -80.45],
    'Montgomery County Ag Fair': [39.14, -77.20],
    'Commanders Open Practice': [39.05, -77.48],
    'Quiet nature windows this week': [39.3, -76.6],
    'Harbor Park Tides stretch': [36.84, -76.28],
    'Camp / quiet campus windows': [38.9, -77.0]
  };

  function getLatLng(item) {
    if (item.lat != null && (item.lon != null || item.lng != null)) {
      return [item.lat, item.lon != null ? item.lon : item.lng];
    }
    const name = item.title || item.name || '';
    for (const k of Object.keys(fallbacks)) {
      if (name.indexOf(k) !== -1 || k.indexOf(name) !== -1) return fallbacks[k];
    }
    return [39.0, -77.5];
  }

  function addMarkers(list, color) {
    const m = window.map;
    if (!m || !list) return;
    list.forEach(item => {
      const [lat, lng] = getLatLng(item);
      const marker = L.circleMarker([lat, lng], {
        radius: 7, fillColor: color, color: '#0b1220', weight: 2, opacity: 1, fillOpacity: 0.9
      });
      marker.bindPopup(popupHtml(item));
      marker.addTo(m);
    });
  }

  const fieldColor = {
    Festivals: '#f59e0b', Music: '#a855f7', Trails: '#22c55e', Water: '#0ea5e9',
    Parks: '#14b8a6', Fairs: '#eab308', Food: '#f97316', Other: '#64748b'
  };

  const fieldLayerGroups = {};
  function ensureGroup(sub) {
    if (!fieldLayerGroups[sub]) fieldLayerGroups[sub] = L.layerGroup();
    return fieldLayerGroups[sub];
  }

  function injectLayerUI(sites) {
    const box = document.getElementById('layers');
    if (!box || document.getElementById('opsFieldGroups')) return;

    const fieldSubs = {};
    const entSubs = {};
    (sites || []).forEach(s => {
      const g = s.group || 'Field';
      const sub = s.sublayer || 'Other';
      if (g === 'Entertainment') entSubs[sub] = (entSubs[sub] || 0) + 1;
      else fieldSubs[sub] = (fieldSubs[sub] || 0) + 1;
    });

    function groupHtml(id, title, subs, defaultOpen) {
      const rows = Object.keys(subs).sort().map(sub => {
        const safe = sub.replace(/[^a-z0-9]/gi, '_');
        const color = fieldColor[sub] || '#64748b';
        return `<label class="layer-item field-sub">
          <input type="checkbox" class="field-layer-cb" data-sublayer="${sub}" id="lyField_${safe}" checked/>
          <span class="layer-swatch" style="background:${color};border-radius:4px;border:1px solid #444;font-size:9px"></span>
          ${sub} <span class="layer-count">${subs[sub]}</span>
        </label>`;
      }).join('');
      return `
        <div class="ops-group" id="${id}">
          <button type="button" class="ops-group-toggle" aria-expanded="${defaultOpen ? 'true' : 'false'}" data-target="${id}-body">
            <span>${title}</span>
            <span class="ops-group-chevron">${defaultOpen ? '▾' : '▸'}</span>
          </button>
          <div class="ops-group-body" id="${id}-body" style="display:${defaultOpen ? 'block' : 'none'}">${rows}</div>
        </div>`;
    }

    const wrap = document.createElement('div');
    wrap.id = 'opsFieldGroups';
    wrap.innerHTML =
      '<div class="layers-divider"></div>' +
      '<div class="layers-title" style="padding-top:4px">More layers</div>' +
      groupHtml('opsGroupField', 'Field', fieldSubs, true) +
      groupHtml('opsGroupEnt', 'Entertainment', entSubs, true) +
      '<div class="layers-hint">Field & Entertainment on by default. Use Clear all to hide.</div>';

    box.appendChild(wrap);

    wrap.querySelectorAll('.ops-group-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const body = document.getElementById(btn.getAttribute('data-target'));
        if (!body) return;
        const open = body.style.display !== 'none';
        body.style.display = open ? 'none' : 'block';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        const chev = btn.querySelector('.ops-group-chevron');
        if (chev) chev.textContent = open ? '▸' : '▾';
      });
    });

    wrap.querySelectorAll('.field-layer-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const sub = cb.getAttribute('data-sublayer');
        const lg = fieldLayerGroups[sub];
        const m = window.map || (typeof map !== 'undefined' ? map : null);
        if (!lg || !m) return;
        if (cb.checked) lg.addTo(m);
        else m.removeLayer(lg);
      });
    });
  }

  function loadFieldSites() {
    return fetch('./data/field-sites.json')
      .then(r => {
        if (!r.ok) throw new Error('field-sites ' + r.status);
        return r.json();
      })
      .then(data => {
        const m = window.map || (typeof map !== 'undefined' ? map : null);
        if (!m) {
          setTimeout(loadFieldSites, 400);
          return;
        }
        const sites = data.sites || data || [];
        const list = Array.isArray(sites) ? sites : [];
        list.forEach(s => {
          const sub = s.sublayer || 'Other';
          const lg = ensureGroup(sub);
          const [lat, lng] = getLatLng(s);
          const color = fieldColor[sub] || '#64748b';
          const marker = L.circleMarker([lat, lng], {
            radius: 8, fillColor: color, color: '#0b1220', weight: 2, opacity: 1, fillOpacity: 0.85
          });
          marker.bindPopup(popupHtml(s));
          lg.addLayer(marker);
        });
        // ALL field/entertainment on by default
        Object.values(fieldLayerGroups).forEach(lg => {
          if (!m.hasLayer(lg)) lg.addTo(m);
        });
        injectLayerUI(list);
      })
      .catch(err => console.warn('Field layers:', err));
  }

  fetch('./intel.json')
    .then(r => {
      if (!r.ok) throw new Error('intel.json ' + r.status);
      return r.json();
    })
    .then(data => {
      const m = window.map || (typeof map !== 'undefined' ? map : null);
      if (!m) {
        clearLoading();
        loadFieldSites();
        return;
      }
      addMarkers(data.big_money || [], '#f59e0b');
      addMarkers(data.sleepers || [], '#22c55e');
      clearLoading();
      loadFieldSites();
    })
    .catch(err => {
      console.error('Ops Center data load error:', err);
      if (loadingEl) {
        loadingEl.textContent = 'Ops Center · data temporarily unavailable';
        setTimeout(clearLoading, 2200);
      }
      loadFieldSites();
    });
})();
