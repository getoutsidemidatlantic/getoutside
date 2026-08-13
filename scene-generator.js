/*
  Get Outside Mid Atlantic — scene banner generator v2
  Region-aware landscapes + bold state label + event motifs.
  Still fully SVG, no stock photos — weekly text still drives motifs.
*/
(function () {
  var REGIONS = {
    maryland: {
      label: 'MARYLAND',
      sky: ['#0c4a6e', '#075985'],
      land: '#0f172a',
      accent: '#38bdf8',
      scene: function () {
        return ''
          + '<defs><linearGradient id="mdSky" x1="0" y1="0" x2="0" y2="1">'
          + '<stop offset="0%" stop-color="#0c4a6e"/><stop offset="100%" stop-color="#082f49"/></linearGradient>'
          + '<linearGradient id="mdWater" x1="0" y1="0" x2="0" y2="1">'
          + '<stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs>'
          + '<rect width="400" height="220" fill="url(#mdSky)"/>'
          + '<circle cx="320" cy="48" r="28" fill="#fbbf24" opacity="0.9"/>'
          + '<path d="M0 95 L40 88 L70 100 L110 82 L150 98 L190 78 L230 96 L270 85 L310 100 L350 90 L400 98 L400 130 L0 130 Z" fill="#1e3a5f"/>'
          + '<rect x="0" y="128" width="400" height="92" fill="url(#mdWater)"/>'
          + '<path d="M0 140 Q50 132 100 142 T200 138 T300 146 T400 140" stroke="#bae6fd" stroke-width="2" fill="none" opacity="0.5"/>'
          + '<path d="M0 160 Q60 150 120 162 T240 158 T360 166 T400 160" stroke="#e0f2fe" stroke-width="1.5" fill="none" opacity="0.35"/>'
          + '<ellipse cx="70" cy="175" rx="22" ry="10" fill="#0c4a6e" opacity="0.5"/>'
          + '<path d="M55 175 q15 -18 30 0" stroke="#f97316" stroke-width="2.5" fill="none"/>'
          + '<circle cx="70" cy="168" r="3" fill="#fbbf24"/>';
      }
    },
    virginia: {
      label: 'VIRGINIA',
      scene: function () {
        return ''
          + '<defs><linearGradient id="vaSky" x1="0" y1="0" x2="0" y2="1">'
          + '<stop offset="0%" stop-color="#1e1b4b"/><stop offset="55%" stop-color="#312e81"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient></defs>'
          + '<rect width="400" height="220" fill="url(#vaSky)"/>'
          + '<circle cx="80" cy="50" r="22" fill="#fde68a" opacity="0.85"/>'
          + '<path d="M0 150 L50 110 L100 140 L150 90 L200 130 L260 85 L320 125 L380 95 L400 120 L400 220 L0 220 Z" fill="#1e3a2f"/>'
          + '<path d="M0 170 L70 140 L130 165 L190 125 L260 160 L330 130 L400 155 L400 220 L0 220 Z" fill="#14532d"/>'
          + '<path d="M0 195 L100 175 L200 192 L300 170 L400 188 L400 220 L0 220 Z" fill="#166534"/>'
          + '<rect x="300" y="100" width="14" height="50" fill="#a8a29e"/>'
          + '<polygon points="307,100 280,120 334,120" fill="#78716c"/>';
      }
    },
    pennsylvania: {
      label: 'PENNSYLVANIA',
      scene: function () {
        return ''
          + '<defs><linearGradient id="paSky" x1="0" y1="0" x2="0" y2="1">'
          + '<stop offset="0%" stop-color="#1c1917"/><stop offset="100%" stop-color="#292524"/></linearGradient></defs>'
          + '<rect width="400" height="220" fill="url(#paSky)"/>'
          + '<rect x="40" y="70" width="50" height="100" fill="#44403c"/>'
          + '<rect x="100" y="50" width="40" height="120" fill="#57534e"/>'
          + '<rect x="150" y="85" width="55" height="85" fill="#44403c"/>'
          + '<rect x="220" y="40" width="45" height="130" fill="#3f3f46"/>'
          + '<rect x="275" y="75" width="60" height="95" fill="#52525b"/>'
          + '<rect x="0" y="150" width="400" height="70" fill="#1c1917"/>'
          + '<path d="M0 155 H400" stroke="#f59e0b" stroke-width="2" opacity="0.6"/>'
          + '<circle cx="60" cy="100" r="3" fill="#fbbf24"/><circle cx="120" cy="80" r="3" fill="#fbbf24"/>'
          + '<circle cx="175" cy="110" r="3" fill="#fbbf24"/><circle cx="245" cy="70" r="3" fill="#fbbf24"/>'
          + '<circle cx="300" cy="100" r="3" fill="#fbbf24"/>'
          + '<path d="M310 40 L320 20 L330 40" fill="none" stroke="#a8a29e" stroke-width="3"/>'
          + '<rect x="314" y="40" width="12" height="30" fill="#78716c"/>';
      }
    },
    delaware: {
      label: 'DELAWARE',
      scene: function () {
        return ''
          + '<defs><linearGradient id="deSky" x1="0" y1="0" x2="0" y2="1">'
          + '<stop offset="0%" stop-color="#0c4a6e"/><stop offset="50%" stop-color="#0369a1"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>'
          + '<linearGradient id="deSand" x1="0" y1="0" x2="0" y2="1">'
          + '<stop offset="0%" stop-color="#fcd34d"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs>'
          + '<rect width="400" height="220" fill="url(#deSky)"/>'
          + '<circle cx="300" cy="55" r="32" fill="#fef3c7"/>'
          + '<rect x="0" y="130" width="400" height="50" fill="#0ea5e9" opacity="0.7"/>'
          + '<path d="M0 145 Q100 135 200 148 T400 142" stroke="#e0f2fe" stroke-width="2" fill="none"/>'
          + '<rect x="0" y="175" width="400" height="45" fill="url(#deSand)"/>'
          + '<ellipse cx="90" cy="185" rx="18" ry="10" fill="#fb923c"/>'
          + '<path d="M90 175 q8 -12 16 -2" stroke="#4ade80" stroke-width="2" fill="none"/>'
          + '<path d="M250 190 q20 -35 40 0" stroke="#78350f" stroke-width="3" fill="none"/>'
          + '<path d="M270 165 q-15 10 -5 25 q15 -5 5 -25" fill="#16a34a"/>';
      }
    },
    'west-virginia': {
      label: 'WEST VIRGINIA',
      scene: function () {
        return ''
          + '<defs><linearGradient id="wvSky" x1="0" y1="0" x2="0" y2="1">'
          + '<stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e3a5f"/></linearGradient></defs>'
          + '<rect width="400" height="220" fill="url(#wvSky)"/>'
          + '<circle cx="70" cy="45" r="18" fill="#f8fafc" opacity="0.9"/>'
          + '<path d="M0 160 L60 100 L120 150 L180 70 L250 140 L320 60 L400 130 L400 220 L0 220 Z" fill="#14532d"/>'
          + '<path d="M0 180 L80 130 L150 170 L220 110 L300 165 L380 120 L400 150 L400 220 L0 220 Z" fill="#166534"/>'
          + '<path d="M0 200 L100 175 L200 195 L300 170 L400 190 L400 220 L0 220 Z" fill="#15803d"/>'
          + '<path d="M200 110 L210 90 L220 110 Z" fill="#fef3c7" opacity="0.4"/>';
      }
    }
  };

  var MOTIFS = {
    peach: '<g><circle cx="14" cy="16" r="10" fill="#fb923c"/><circle cx="10" cy="14" r="6" fill="#fdba74"/><path d="M14 6 q4 -5 8 -2" stroke="#4ade80" stroke-width="2" fill="none"/></g>',
    mug: '<g><rect x="2" y="6" width="14" height="16" rx="2" fill="#f8fafc"/><path d="M16 9 h5 a4 4 0 0 1 0 8 h-5" stroke="#f8fafc" stroke-width="2" fill="none"/><rect x="2" y="6" width="14" height="4" fill="#fbbf24"/></g>',
    football: '<g transform="rotate(-20 12 14)"><ellipse cx="12" cy="14" rx="12" ry="8" fill="#78350f"/><line x1="6" y1="14" x2="18" y2="14" stroke="#f8fafc" stroke-width="1.5"/></g>',
    tent: '<g><polygon points="12,4 22,22 2,22" fill="#facc15"/><line x1="12" y1="4" x2="12" y2="22" stroke="#78350f" stroke-width="1.5"/></g>',
    flame: '<g><path d="M12 2 C6 10 6 14 9 18 C7 15 9 13 10 12 C10 16 14 17 14 20 C18 17 18 10 12 2 Z" fill="#f97316"/></g>',
    note: '<g><circle cx="6" cy="20" r="4" fill="#f472b6"/><circle cx="18" cy="16" r="4" fill="#f472b6"/><path d="M10 20 V6 L22 3 V16" stroke="#f472b6" stroke-width="2" fill="none"/></g>',
    fair: '<g><path d="M12 4 L14 10 L20 10 L15 14 L17 20 L12 16 L7 20 L9 14 L4 10 L10 10 Z" fill="#fbbf24"/></g>'
  };

  var MOTIF_RULES = [
    { test: /peach/i, id: 'peach' },
    { test: /brewery|beer|ale|bourbon/i, id: 'mug' },
    { test: /football|steelers|ravens/i, id: 'football' },
    { test: /camp(?!fire)|tent/i, id: 'tent' },
    { test: /bonfire|campfire|fire/i, id: 'flame' },
    { test: /music|concert|fest|jazz|folk/i, id: 'note' },
    { test: /fair|carnival|parade/i, id: 'fair' }
  ];

  function pickMotifs(text, max) {
    max = max || 2;
    var found = [];
    for (var i = 0; i < MOTIF_RULES.length && found.length < max; i++) {
      if (MOTIF_RULES[i].test.test(text)) found.push(MOTIF_RULES[i].id);
    }
    return found;
  }

  function normalizeRegion(r) {
    if (!r) return null;
    r = String(r).toLowerCase().trim();
    if (r === 'wv' || r === 'w virginia' || r === 'w. virginia') return 'west-virginia';
    if (r === 'md') return 'maryland';
    if (r === 'va') return 'virginia';
    if (r === 'pa') return 'pennsylvania';
    if (r === 'de') return 'delaware';
    return REGIONS[r] ? r : null;
  }

  function renderScene(text, regionKey) {
    text = text || '';
    regionKey = normalizeRegion(regionKey);
    var region = regionKey ? REGIONS[regionKey] : null;
    var body;
    if (region) {
      body = region.scene();
    } else {
      body = '<rect width="400" height="220" fill="#0f172a"/>'
        + '<polygon points="40,180 120,80 200,180" fill="#334155"/>'
        + '<polygon points="160,180 260,60 360,180" fill="#475569"/>'
        + '<circle cx="320" cy="50" r="24" fill="#fbbf24"/>';
    }

    var motifs = pickMotifs(text);
    var motifSvg = motifs.map(function (id, idx) {
      var m = MOTIFS[id];
      if (!m) return '';
      var x = 340 - idx * 36;
      return '<g transform="translate(' + x + ',16) scale(1.15)">' + m + '</g>';
    }).join('');

    var label = region ? region.label : '';
    var labelSvg = label
      ? '<defs><linearGradient id="lblFade" x1="0" y1="0" x2="0" y2="1">'
        + '<stop offset="0%" stop-color="#020617" stop-opacity="0"/>'
        + '<stop offset="100%" stop-color="#020617" stop-opacity="0.85"/></linearGradient></defs>'
        + '<rect x="0" y="150" width="400" height="70" fill="url(#lblFade)"/>'
        + '<text x="20" y="200" font-family="Outfit, system-ui, sans-serif" font-weight="800" font-size="28" fill="#f8fafc" letter-spacing="0.08em">' + label + '</text>'
      : '';

    var aria = (label ? label + ' — ' : '') + text;
    aria = aria.replace(/"/g, '&quot;');

    return '<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + aria + '" style="width:100%;height:100%;display:block">'
      + body + motifSvg + labelSvg + '</svg>';
  }

  function init() {
    var nodes = document.querySelectorAll('[data-scene]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var text = el.getAttribute('data-scene') || el.textContent || '';
      var region = el.getAttribute('data-region') || '';
      el.innerHTML = renderScene(text, region);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.GetOutsideSceneGenerator = {
    renderScene: renderScene,
    regions: Object.keys(REGIONS)
  };
})();
