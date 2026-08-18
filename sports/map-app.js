// Ops Center map-app.js — data-separated layer
// Loads sports/intel.json and plots markers on the existing Leaflet map

(function () {
  const loadingEl = document.getElementById('loading');

  function clearLoading() {
    if (loadingEl) loadingEl.remove();
  }

  function popupHtml(item) {
    const title = item.title || 'Event';
    const note = item.note || '';
    const tag = item.tag || '';
    const url = item.url || '#';
    return `
      <div style="min-width:180px;font-family:system-ui,sans-serif">
        <div style="font-size:0.7rem;font-weight:700;color:#f59e0b;text-transform:uppercase;margin-bottom:2px">${tag}</div>
        <div style="font-weight:700;font-size:0.95rem;margin-bottom:4px">${title}</div>
        <div style="font-size:0.8rem;color:#64748b;margin-bottom:8px">${note}</div>
        <a href="${url}" target="_blank" rel="noopener" style="font-size:0.75rem;color:#0284c7;font-weight:600">Open →</a>
      </div>`;
  }

  // Rough Mid-Atlantic centroids for items that don't have lat/lng yet
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
    const key = item.title || '';
    if (fallbacks[key]) return fallbacks[key];
    // default center of region
    return [39.0, -77.5];
  }

  function addMarkers(items, color) {
    if (!Array.isArray(items)) return;
    items.forEach(item => {
      const [lat, lng] = getLatLng(item);
      const marker = L.circleMarker([lat, lng], {
        radius: 9,
        fillColor: color,
        color: '#0b1220',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(window.map || map);
      marker.bindPopup(popupHtml(item));
    });
  }

  fetch('./intel.json')
    .then(r => {
      if (!r.ok) throw new Error('intel.json ' + r.status);
      return r.json();
    })
    .then(data => {
      // Prefer the global map created by index.html; fall back to window.map
      const m = window.map || (typeof map !== 'undefined' ? map : null);
      if (!m) {
        console.error('Leaflet map instance not found');
        clearLoading();
        return;
      }

      addMarkers(data.big_money || [], '#f59e0b');   // amber — big events
      addMarkers(data.sleepers || [], '#22c55e');    // green — sleepers

      // Fit bounds if we have points
      const all = [...(data.big_money || []), ...(data.sleepers || [])];
      if (all.length) {
        const bounds = L.latLngBounds(all.map(getLatLng));
        m.fitBounds(bounds.pad(0.25));
      }

      clearLoading();
    })
    .catch(err => {
      console.error('Ops Center data load error:', err);
      if (loadingEl) {
        loadingEl.textContent = 'Ops Center · data temporarily unavailable';
        setTimeout(clearLoading, 2200);
      }
    });
})();
