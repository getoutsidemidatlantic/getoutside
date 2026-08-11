/*
  Get Outside Mid Atlantic — automated scene banner generator.

  No photos, no manual image picking. Each card banner is an SVG rendered
  entirely from that card's own headline text (data-scene attribute).
  A weekly content update just changes the text — the artwork updates
  itself by keyword match. Add new templates/motifs below as the
  content vocabulary grows.
*/
(function () {
  var TEMPLATES = {
    nightlife: function () {
      return '<rect width="300" height="170" fill="#1e1b4b"/>' +
        '<rect x="0" y="105" width="60" height="65" fill="#312e81"/>' +
        '<rect x="55" y="85" width="55" height="85" fill="#1e1b4b"/>' +
        '<rect x="105" y="115" width="70" height="55" fill="#312e81"/>' +
        '<rect x="170" y="95" width="50" height="75" fill="#1e1b4b"/>' +
        '<rect x="215" y="125" width="85" height="45" fill="#312e81"/>' +
        '<path d="M0 90 Q75 122 150 90 T300 90" stroke="#fbbf24" stroke-width="2" fill="none"/>' +
        '<circle cx="30" cy="94" r="3" fill="#fbbf24"/>' +
        '<circle cx="90" cy="106" r="3" fill="#fbbf24"/>' +
        '<circle cx="150" cy="95" r="3" fill="#fbbf24"/>' +
        '<circle cx="210" cy="106" r="3" fill="#fbbf24"/>' +
        '<circle cx="270" cy="94" r="3" fill="#fbbf24"/>';
    },
    waterfront: function () {
      return '<rect width="300" height="170" fill="#0c2d48"/>' +
        '<rect x="0" y="120" width="300" height="50" fill="#1d6fa5"/>' +
        '<path d="M0 128 Q40 120 80 130 T160 126 T240 132 T300 126" stroke="#bae6fd" stroke-width="2.5" fill="none"/>' +
        '<rect x="60" y="95" width="14" height="35" fill="#0c4a6e"/>' +
        '<rect x="130" y="95" width="14" height="35" fill="#0c4a6e"/>' +
        '<rect x="200" y="95" width="14" height="35" fill="#0c4a6e"/>' +
        '<rect x="40" y="88" width="220" height="10" fill="#475569"/>';
    },
    sunsetKayak: function () {
      return '<rect width="300" height="170" fill="#3b1d0a"/>' +
        '<circle cx="150" cy="90" r="42" fill="#f59e0b"/>' +
        '<rect x="0" y="115" width="300" height="55" fill="#3b1d0a"/>' +
        '<path d="M0 118 Q75 108 150 118 T300 118 V125 Q225 115 150 125 T0 125 Z" fill="#78350f"/>' +
        '<path d="M100 140 q30 -12 60 0 q-5 8 -30 8 q-25 0 -30 -8 z" fill="#111827"/>' +
        '<polygon points="245,170 260,145 275,170" fill="#7f1d1d"/>' +
        '<polygon points="252,170 260,153 268,170" fill="#f59e0b"/>';
    },
    river: function () {
      return '<rect width="300" height="170" fill="#052e28"/>' +
        '<path d="M0 130 Q75 100 150 130 T300 130 V170 H0 Z" fill="#0f6e56"/>' +
        '<path d="M0 150 Q75 125 150 150 T300 150 V170 H0 Z" fill="#16a34a"/>' +
        '<circle cx="230" cy="55" r="42" fill="#064e3b"/>' +
        '<rect x="210" y="65" width="16" height="24" rx="2" fill="#34d399"/>' +
        '<rect x="232" y="60" width="16" height="29" rx="2" fill="#34d399"/>';
    },
    stage: function () {
      return '<rect width="300" height="170" fill="#3b0a1e"/>' +
        '<polygon points="90,10 210,10 240,55 60,55" fill="#7c2d4a"/>' +
        '<rect x="80" y="55" width="140" height="65" fill="#5b1f38"/>' +
        '<circle cx="110" cy="30" r="6" fill="#f9c9dc"/>' +
        '<circle cx="150" cy="22" r="6" fill="#f9c9dc"/>' +
        '<circle cx="190" cy="30" r="6" fill="#f9c9dc"/>' +
        '<circle cx="60" cy="140" r="10" fill="#1e1b4b"/>' +
        '<circle cx="95" cy="145" r="10" fill="#1e1b4b"/>' +
        '<circle cx="130" cy="138" r="10" fill="#1e1b4b"/>' +
        '<circle cx="165" cy="146" r="10" fill="#1e1b4b"/>' +
        '<circle cx="200" cy="139" r="10" fill="#1e1b4b"/>' +
        '<circle cx="235" cy="145" r="10" fill="#1e1b4b"/>';
    },
    whitewater: function () {
      return '<rect width="300" height="170" fill="#0a1f33"/>' +
        '<polygon points="0,105 60,35 120,105" fill="#0c4a6e"/>' +
        '<polygon points="90,105 160,20 230,105" fill="#0369a1"/>' +
        '<polygon points="200,105 260,50 300,105" fill="#0c4a6e"/>' +
        '<rect x="0" y="105" width="300" height="65" fill="#0ea5e9"/>' +
        '<path d="M0 125 Q40 115 80 127 T160 123 T240 129 T300 123" stroke="#e0f2fe" stroke-width="3" fill="none"/>' +
        '<path d="M0 145 Q40 137 80 147 T160 143 T240 149 T300 143" stroke="#bae6fd" stroke-width="3" fill="none"/>';
    },
    fallback: function () {
      return '<rect width="300" height="170" fill="#1c1917"/>' +
        '<polygon points="20,150 90,60 150,150" fill="#44403c"/>' +
        '<polygon points="120,150 190,45 260,150" fill="#57534e"/>' +
        '<circle cx="240" cy="40" r="20" fill="#fbbf24"/>' +
        '<rect x="0" y="150" width="300" height="20" fill="#292524"/>';
    }
  };

  var MOTIFS = {
    peach: { x: 252, y: 10, svg:
      '<circle cx="12" cy="14" r="9" fill="#fb923c"/>' +
      '<circle cx="7" cy="12" r="6" fill="#fdba74"/>' +
      '<path d="M12 5 q3 -4 7 -2" stroke="#4ade80" stroke-width="2" fill="none"/>' },
    mug: { x: 252, y: 10, svg:
      '<rect x="2" y="6" width="14" height="16" rx="2" fill="#f8fafc"/>' +
      '<path d="M16 9 h5 a4 4 0 0 1 0 8 h-5" stroke="#f8fafc" stroke-width="2" fill="none"/>' +
      '<rect x="2" y="6" width="14" height="4" fill="#fbbf24"/>' },
    football: { x: 252, y: 12, svg:
      '<ellipse cx="12" cy="14" rx="12" ry="8" fill="#78350f" transform="rotate(-20 12 14)"/>' +
      '<line x1="6" y1="14" x2="18" y2="14" stroke="#f8fafc" stroke-width="1.5" transform="rotate(-20 12 14)"/>' },
    firework: { x: 250, y: 16, svg:
      '<g stroke="#fbbf24" stroke-width="2">' +
      '<line x1="12" y1="4" x2="12" y2="-6"/>' +
      '<line x1="4" y1="12" x2="-4" y2="4"/>' +
      '<line x1="20" y1="12" x2="28" y2="4"/>' +
      '<line x1="4" y1="20" x2="-4" y2="24"/>' +
      '<line x1="20" y1="20" x2="28" y2="24"/>' +
      '</g><circle cx="12" cy="12" r="3" fill="#fbbf24"/>' },
    note: { x: 252, y: 8, svg:
      '<circle cx="6" cy="20" r="4" fill="#f472b6"/>' +
      '<circle cx="18" cy="16" r="4" fill="#f472b6"/>' +
      '<path d="M10 20 V6 L22 3 V16" stroke="#f472b6" stroke-width="2" fill="none"/>' },
    tent: { x: 254, y: 10, svg:
      '<polygon points="12,4 22,22 2,22" fill="#facc15"/>' +
      '<line x1="12" y1="4" x2="12" y2="22" stroke="#78350f" stroke-width="1.5"/>' },
    flame: { x: 256, y: 10, svg:
      '<path d="M12 2 C6 10 6 14 9 18 C7 15 9 13 10 12 C10 16 14 17 14 20 C18 17 18 10 12 2 Z" fill="#f97316"/>' }
  };

  var TEMPLATE_RULES = [
    { test: /lantern|dusk|rooftop|nightlife|string light/i, id: 'nightlife' },
    { test: /dock|marina|boardwalk|harbor|pirate/i, id: 'waterfront' },
    { test: /sunset|bonfire/i, id: 'sunsetKayak' },
    { test: /whitewater|rapids|mountain|highland|hik|trail|parkway|lake/i, id: 'whitewater' },
    { test: /river|paddl|canoe|forest/i, id: 'river' },
    { test: /music|fest|concert|steelers|stage|camp/i, id: 'stage' }
  ];

  var MOTIF_RULES = [
    { test: /peach/i, id: 'peach' },
    { test: /brewery|beer|ale/i, id: 'mug' },
    { test: /firework|labor day|july 4th|fourth of july/i, id: 'firework' },
    { test: /steelers|football/i, id: 'football' },
    { test: /jazz|music|concert/i, id: 'note' },
    { test: /camp(?!fire)/i, id: 'tent' },
    { test: /bonfire/i, id: 'flame' }
  ];

  function pickTemplate(text) {
    for (var i = 0; i < TEMPLATE_RULES.length; i++) {
      if (TEMPLATE_RULES[i].test.test(text)) return TEMPLATE_RULES[i].id;
    }
    return 'fallback';
  }

  function pickMotifs(text, max) {
    max = max || 2;
    var found = [];
    for (var i = 0; i < MOTIF_RULES.length && found.length < max; i++) {
      if (MOTIF_RULES[i].test.test(text)) found.push(MOTIF_RULES[i].id);
    }
    return found;
  }

  function renderScene(text) {
    text = text || '';
    var templateId = pickTemplate(text);
    var templateFn = TEMPLATES[templateId] || TEMPLATES.fallback;
    var motifs = pickMotifs(text);
    var motifSvg = motifs.map(function (id) {
      var m = MOTIFS[id];
      return m ? '<g transform="translate(' + m.x + ',' + m.y + ')">' + m.svg + '</g>' : '';
    }).join('');
    var label = text.replace(/"/g, '&quot;');
    return '<svg viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '" style="width:100%;height:100%;display:block;">' +
      templateFn() + motifSvg + '</svg>';
  }

  function init() {
    var nodes = document.querySelectorAll('[data-scene]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var text = el.getAttribute('data-scene') || el.textContent || '';
      el.innerHTML = renderScene(text);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.GetOutsideSceneGenerator = {
    renderScene: renderScene,
    pickTemplate: pickTemplate,
    pickMotifs: pickMotifs
  };
})();
