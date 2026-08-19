// Ops Center map-app.js — data-separated layers
// Sports stay in index.html. Field + Entertainment load from data/field-sites.json
// Architecture lock: Sports default open; Field + Entertainment collapsed, sublayers default OFF

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
    if (item.lat != null && item.lng != null) return [item.lat, item.lng];
    if (item.lat != null && item.lon != null) return [item.lat, item.lon];
    const key = item.title || item.name || '';
    if (fallbacks[key]) return fallbacks[key];
    return [39.0, -77.5];
  }

  function addMarkers(items, color) {
    if (!Array.isArray(items)) return;
    const m = window.map || (typeof map !== 'undefined' ? map : null);
    if (!m) return;
    items.forEach(item => {
      const [lat, lng] = getLatLng(item);
      const marker = L.circleMarker([lat, lng], {
        radius: 9,
        fillColor: color,
        color: '#0b1220',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(m);
      marker.bindPopup(popupHtml(item));
    });
  }

  // --- Field / Entertainment layer groups ---
  const fieldLayerGroups = {}; // sublayer -> L.LayerGroup
  const fieldColor = {
    Camping: '#16a34a',
    Trails: '#0d9488',
    'Public land': '#65a30d',
    'Fishing/Boating': '#0284c7',
    Paddling: '#06b6d4',
    Lakes: '#2563eb',
    Hunting: '#a16207',
    Motorized: '#ca8a04',
    Winter: '#e0f2fe',
    History: '#a78bfa',
    'Scenic Lookouts': '#f472b6',
    Concerts: '#e11d48',
    Festivals: '#f59e0b',
    Breweries: '#b45309'
  };

  function ensureGroup(sub) {
    if (!fieldLayerGroups[sub]) {
      fieldLayerGroups[sub] = L.layerGroup();
    }
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
      if (g === 'Entertainment') {
        entSubs[sub] = (entSubs[sub] || 0) + 1;
      } else {
        fieldSubs[sub] = (fieldSubs[sub] || 0) + 1;
      }
    });

    function groupHtml(id, title, subs, defaultOpen) {
      const rows = Object.keys(subs).sort().map(sub => {
        const safe = sub.replace(/[^a-z0-9]/gi, '_');
        const color = fieldColor[sub] || '#64748b';
        return `<label class="layer-item field-sub">
          <input type="checkbox" class="field-layer-cb" data-sublayer="${sub}" id="lyField_${safe}"/>
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

    // Insert after last sports layer / before density divider if possible
    const wrap = document.createElement('div');
    wrap.id = 'opsFieldGroups';
    wrap.innerHTML =
      '<div class="layers-divider"></div>' +
      '<div class="layers-title" style="padding-top:4px">More layers</div>' +
      groupHtml('opsGroupField', 'Field', fieldSubs, false) +
      groupHtml('opsGroupEnt', 'Entertainment', entSubs, false) +
      '<div class="layers-hint">Field & Entertainment default off. Expand a group, then toggle pins.</div>';

    // Place before heatmap if present, else append
    const heat = box.querySelector('#lyHeat');
    if (heat && heat.closest('label')) {
      const heatLabel = heat.closest('label');
      const divider = heatLabel.previousElementSibling;
      if (divider && divider.classList.contains('layers-divider')) {
        box.insertBefore(wrap, divider);
      } else {
        box.insertBefore(wrap, heatLabel);
      }
    } else {
      box.appendChild(wrap);
    }

    // Collapse toggles
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

    // Sublayer checkboxes
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
        if (!m) return;
        const sites = data.sites || [];
        sites.forEach(s => {
          const sub = s.sublayer || 'Other';
          const lg = ensureGroup(sub);
          const [lat, lng] = getLatLng(s);
          const color = fieldColor[sub] || '#64748b';
          const marker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: color,
            color: '#0b1220',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85
          });
          marker.bindPopup(popupHtml(s));
          lg.addLayer(marker);
          // NOT added to map until user checks the sublayer
        });
        injectLayerUI(sites);
      })
      .catch(err => console.warn('Field layers:', err));
  }

  // Intel ticker markers (existing)
  fetch('./intel.json')
    .then(r => {
      if (!r.ok) throw new Error('intel.json ' + r.status);
      return r.json();
    })
    .then(data => {
      const m = window.map || (typeof map !== 'undefined' ? map : null);
      if (!m) {
        console.error('Leaflet map instance not found');
        clearLoading();
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
