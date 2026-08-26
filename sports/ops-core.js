(function(){
  'use strict';
  var statusEl=document.getElementById('statusBar');
  function setStatus(msg,kind){
    if(!statusEl)return;
    statusEl.textContent=msg;
    statusEl.className=kind||'';
    statusEl.style.display='block';
    if(kind==='ok')setTimeout(function(){if(statusEl.textContent===msg)statusEl.style.display='none';},2200);
  }

  var map=L.map('map',{center:[39.2,-78.0],zoom:7});
  window.map=map;
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'© OSM © CARTO',subdomains:'abcd',maxZoom:19
  }).addTo(map);

  var layersByType={
    nfl:L.layerGroup().addTo(map),mlb:L.layerGroup().addTo(map),
    soccer:L.layerGroup().addTo(map),practice:L.layerGroup().addTo(map),
    college:L.layerGroup().addTo(map),milb:L.layerGroup().addTo(map),
    d2:L.layerGroup().addTo(map),d3:L.layerGroup().addTo(map),golf:L.layerGroup().addTo(map)
  };
  var markerById={},venues=[],marquee=[],rangeDays=30,heatLayer=null;

  var affiliateKits=null;
  function loadAffiliateKits(){
    return fetch('./data/affiliate-kits.json',{cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('affiliate '+r.status);return r.json();})
      .then(function(d){affiliateKits=d;})
      .catch(function(err){console.warn('Affiliate kits:',err);affiliateKits=null;});
  }
  function resolveGearKeys(ctx){
    if(!affiliateKits)return [];
    var keys=[], seen={};
    function add(list){
      (list||[]).forEach(function(k){
        if(k&&!seen[k]&&affiliateKits.kits&&affiliateKits.kits[k]){seen[k]=1;keys.push(k);}
      });
    }
    if(ctx.id)add((affiliateKits.by_venue_id||{})[ctx.id]);
    if(ctx.type)add((affiliateKits.by_venue_type||{})[String(ctx.type).toLowerCase()]);
    if(ctx.sublayer)add((affiliateKits.by_sublayer||{})[ctx.sublayer]);
    (ctx.occasions||[]).forEach(function(o){add((affiliateKits.by_occasion||{})[o]);});
    var max=affiliateKits.max_per_panel||3;
    return keys.slice(0,max);
  }
  function renderGearSection(ctx){
    var keys=resolveGearKeys(ctx);
    if(!keys.length)return '';
    var html='<div class="panel-section-label">Gear for this</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px">';
    keys.forEach(function(k){
      var kit=affiliateKits.kits[k];
      if(!kit||!kit.url)return;
      html+='<a href="'+kit.url+'" target="_blank" rel="noopener sponsored" style="display:inline-block;padding:5px 10px;border-radius:999px;background:#1e3a55;border:1px solid #2a4a6a;color:#e8eef7;font-size:.72rem;font-weight:600;text-decoration:none">'+(kit.label||k)+' →</a>';
    });
    html+='</div>';
    html+='<p style="font-size:.62rem;color:#6b7f9a;margin-bottom:12px;line-height:1.35">'+(affiliateKits.disclosure||'As an Amazon Associate I earn from qualifying purchases.')+' · <a href="'+(affiliateKits.gear_hub||'/gear.html')+'" style="color:#38bdf8">Full weekend kit</a></p>';
    return html;
  }

  var iconEmoji={nfl:'🏈',mlb:'⚾',mls:'⚽',soccer:'⚽',practice:'🏈',college:'🏈',milb:'⚾',d2:'🏈',d3:'🏈',golf:'⛳'};

  function normType(t){
    t=(t||'').toLowerCase();
    if(t==='mls'||t==='nwsl')return'soccer';
    if(t==='d1')return'college';
    if(t==='d3')return'd2';
    return t;
  }
  function makeIcon(type,wxLabel){
    var t=normType(type);
    var emoji=iconEmoji[t]||'📍';
    var chip=wxLabel?'<span class="wx-chip">'+wxLabel+'</span>':'';
    return L.divIcon({
      className:'',
      html:'<div style="position:relative"><div class="soc-icon '+t+'">'+emoji+'</div>'+chip+'</div>',
      iconSize:[30,30],iconAnchor:[15,15]
    });
  }
  function shortWx(e){
    if(e&&e.temp_f)return e.temp_f+'°';
    if(!e||!e.weather)return'';
    var m=String(e.weather).match(/(\d+)/);
    return m?m[1]+'°':'';
  }
  function parseLocal(d){
    if(!d)return null;
    var p=String(d).split('-');
    if(p.length<3)return new Date(d);
    return new Date(+p[0],+p[1]-1,+p[2]);
  }

  function buildMarkers(){
    Object.values(layersByType).forEach(function(g){g.clearLayers();});
    Object.keys(markerById).forEach(function(k){delete markerById[k];});
    var counts={nfl:0,mlb:0,soccer:0,practice:0,college:0,milb:0,d2:0,golf:0};
    venues.forEach(function(v){
      var t=normType(v.type);
      if(!layersByType[t])return;
      counts[t]=(counts[t]||0)+1;
      var outdoorEv=(v.events||[]).find(function(e){return e.outdoor==='Yes';})||(v.events||[])[0];
      var wx=shortWx(outdoorEv);
      var m=L.marker([v.lat,v.lon],{icon:makeIcon(t,wx)});
      m.bindPopup(
        '<div style="min-width:160px;font-family:system-ui,sans-serif">'+
        '<div style="font-weight:700;font-size:0.95rem">'+(v.name||'')+'</div>'+
        '<div style="font-size:0.75rem;color:#94a3b8">'+(v.city||'')+'</div>'+
        '<div style="font-size:0.72rem;color:#64748b;margin-top:4px">'+((v.events||[]).length)+' events in window</div>'+
        '<br><button onclick="openPanel(\''+v.id+'\')" style="margin-top:6px;padding:4px 10px;border-radius:6px;border:0;background:#22c55e;color:#0b1220;font-weight:700;cursor:pointer">Intel</button>'+
        '</div>'
      );
      m.on('click',function(){openPanel(v.id);});
      layersByType[t].addLayer(m);
      markerById[v.id]=m;
    });
    Object.keys(counts).forEach(function(k){
      var el=document.querySelector('[data-count="'+k+'"]');
      if(el)el.textContent=counts[k]||0;
    });
  }

  function syncLayerVisibility(){
    document.querySelectorAll('#ops-sports input[data-type]').forEach(function(cb){
      var t=cb.getAttribute('data-type');
      var g=layersByType[t];
      if(!g)return;
      if(cb.checked){ if(!map.hasLayer(g)) g.addTo(map); }
      else { if(map.hasLayer(g)) map.removeLayer(g); }
    });
  }

  function eventInRange(e){
    var d=parseLocal(e.date);
    if(!d||isNaN(d))return false;
    var now=new Date();
    now.setHours(0,0,0,0);
    var end=new Date(now);
    end.setDate(end.getDate()+rangeDays);
    return d>=now && d<=end;
  }

  function renderFeed(){
    var box=document.getElementById('feedScroll');
    var marq=document.getElementById('feedMarquee');
    var countEl=document.getElementById('feedCount');
    if(!box)return;
    var cards=[];
    var marqueeCards=[];
    venues.forEach(function(v){
      (v.events||[]).forEach(function(e){
        if(!eventInRange(e))return;
        var isMarquee=marquee.some(function(m){return m.venue_id===v.id || (m.title&&e.title&&m.title===e.title);});
        var cardHtml=
          '<div class="feed-card'+(isMarquee?' marquee':'')+'" onclick="openPanel(\''+(v.id||'')+'\')">'+
          '<div class="feed-card-date">'+(e.date||'')+'</div>'+
          '<div class="feed-card-title">'+(e.title||e.teams||v.name||'')+'</div>'+
          '<div class="feed-card-meta">'+(v.name||'')+(v.city?' · '+v.city:'')+'</div>'+
          (e.weather?'<div class="feed-card-wx">'+e.weather+'</div>':'')+
          (e.enthusiasm||e.hype?'<div class="fc-hype">'+(e.enthusiasm||e.hype)+'</div>':'')+
          '</div>';
        if(isMarquee) marqueeCards.push(cardHtml);
        else cards.push({html:cardHtml,date:e.date});
      });
    });
    cards.sort(function(a,b){return (a.date||'').localeCompare(b.date||'');});
    if(marq){
      if(marqueeCards.length){
        marq.innerHTML='<div class="marquee-label">Marquee</div>'+marqueeCards.join('');
      }else marq.innerHTML='';
    }
    box.innerHTML=cards.map(function(c){return c.html;}).join('') || '<div style="padding:16px;color:#6b7f9a">No events in current window.</div>';
    if(countEl)countEl.textContent=(cards.length+marqueeCards.length)+' events';
  }

  function setHero(imgUrl){
    var hero=document.getElementById('panelHeroWrap');
    if(!hero)return;
    if(imgUrl){
      hero.innerHTML='<img class="panel-hero" src="'+imgUrl+'" alt="" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=panel-hero-fallback>No venue photo</div>\'">';
    }else{
      hero.innerHTML='<div class="panel-hero-fallback">No venue photo yet</div>';
    }
  }

  function openFieldPanel(s){
    setHero(s.image||'');
    document.getElementById('panelVenue').textContent=s.name||s.title||'Site';
    var sub=[s.group,s.sublayer].filter(Boolean).join(' · ');
    document.getElementById('panelCity').textContent=(s.city||'')+(sub?' · '+sub:'');
    var chips='';
    if(s.group)chips+='<span class="chip">'+s.group+'</span>';
    if(s.sublayer)chips+='<span class="chip">'+s.sublayer+'</span>';
    if(s.time_sensitive)chips+='<span class="chip count">Time-sensitive</span>';
    if(s.dates)chips+='<span class="chip">'+s.dates+'</span>';
    document.getElementById('panelChips').innerHTML=chips||'<span class="chip">Field</span>';
    var body='';
    if(s.note)body+='<div class="panel-section-label">Intel</div><p style="font-size:.8rem;color:#c5d4e8;margin-bottom:12px;line-height:1.45">'+s.note+'</p>';
    if(s.dates)body+='<div class="panel-section-label">When</div><p style="font-size:.8rem;color:#c5d4e8;margin-bottom:12px">'+s.dates+'</p>';
    var url=s.official||s.url||'';
    if(url)body+='<div class="panel-section-label">Source</div><p style="margin-bottom:12px"><a href="'+url+'" target="_blank" rel="noopener" style="color:#38bdf8;font-weight:600;font-size:.85rem">Open official site →</a></p>';
    if(!body)body='<p style="color:#6b7f9a;font-size:.8rem">No extra intel for this site.</p>';
    body+=renderGearSection({id:s.id,type:null,sublayer:s.sublayer,occasions:s.occasions||[]});
    document.getElementById('panelBody').innerHTML=body;
    document.getElementById('panel').classList.add('open');
    document.body.classList.remove('mobile-layers-open','mobile-feed-open');
    if(s.lat!=null&&(s.lon!=null||s.lng!=null)){
      map.flyTo([s.lat,s.lon!=null?s.lon:s.lng],11,{duration:0.8});
    }
  }

  window.openPanel=function(id){
    if(!id)return;
    var v=venues.find(function(x){return x.id===id;});
    if(!v){
      var fs=(window.fieldSites||[]).find(function(x){return x.id===id;});
      if(fs){openFieldPanel(fs);return;}
      var m=markerById[id];
      if(m){map.flyTo(m.getLatLng(),11);m.openPopup();}
      return;
    }
    setHero(v.image||'');
    document.getElementById('panelVenue').textContent=v.name;
    document.getElementById('panelCity').textContent=(v.city||'')+(v.type?' · '+String(v.type).toUpperCase():'');
    var chips='<span class="chip count">'+(v.events||[]).length+' events</span>';
    if(v.type)chips+='<span class="chip">'+v.type+'</span>';
    if(v.fan_sentiment_score!=null)chips+='<span class="chip" style="background:#1e3a5f">sentiment '+Math.round(v.fan_sentiment_score*100)/100+'</span>';
    if(v.fan_themes)chips+='<span class="chip">'+v.fan_themes+'</span>';
    var occ=v.occasions||[];
    if(occ.length){
      chips+='<div class="occasion-row">';
      occ.forEach(function(t){chips+='<span class="chip occasion">'+t+'</span>';});
      chips+='</div>';
    }
    document.getElementById('panelChips').innerHTML=chips;
    var body='';
    if(v.history)body+='<div class="panel-section-label">History</div><p style="font-size:.8rem;color:#c5d4e8;margin-bottom:12px;line-height:1.45">'+v.history+'</p>';
    if(v.people_love)body+='<div class="panel-section-label">Why people love it</div><p style="font-size:.8rem;color:#c5d4e8;margin-bottom:12px;line-height:1.45">'+v.people_love+'</p>';
    body+='<div class="panel-section-label">Upcoming</div>';
    (v.events||[]).filter(eventInRange).slice(0,10).forEach(function(ev){
      body+='<div class="event-card"><div class="event-date">'+(ev.date||'')+' '+(ev.time||'')+'</div>';
      body+='<div class="event-teams">'+(ev.teams||ev.event_name||ev.title||'Event')+'</div>';
      var meta=[];
      if(ev.outdoor==='Yes'||ev.outdoor===true)meta.push('Outdoor');
      if(ev.weather)meta.push(ev.weather);
      if(ev.temp_f)meta.push(ev.temp_f+'°F');
      body+='<div class="event-sport">'+meta.join(' · ')+'</div>';
      if(ev.enthusiasm)body+='<p style="font-size:.78rem;color:#a8b8d0;margin-top:8px;line-height:1.4">'+ev.enthusiasm+'</p>';
      else if(ev.hype)body+='<p style="font-size:.78rem;color:#a8b8d0;margin-top:8px;line-height:1.4">'+ev.hype+'</p>';
      body+='</div>';
    });
    if(!(v.events||[]).length)body+='<p style="color:#6b7f9a;font-size:.8rem">No events in window.</p>';
    body+=renderGearSection({id:v.id,type:v.type,sublayer:null,occasions:v.occasions||[]});
    document.getElementById('panelBody').innerHTML=body;
    document.getElementById('panel').classList.add('open');
    document.body.classList.remove('mobile-layers-open','mobile-feed-open');
    if(v.lat&&v.lon)map.flyTo([v.lat,v.lon],11,{duration:0.8});
  };
  window.closePanel=function(){document.getElementById('panel').classList.remove('open');};
  window.flyTo=function(id){var m=markerById[id];if(m){map.flyTo(m.getLatLng(),11);m.openPopup();}};

  document.querySelectorAll('#ops-sports input[data-type]').forEach(function(cb){
    cb.addEventListener('change',syncLayerVisibility);
  });
  function setAllLayerChecks(on){
    document.querySelectorAll('#ops-sports input[data-type]').forEach(function(cb){cb.checked=!!on;});
    document.querySelectorAll('.field-layer-cb').forEach(function(cb){
      cb.checked=!!on;
      try{cb.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}
    });
    syncLayerVisibility();
  }
  var btnSelectAll=document.getElementById('btnSelectAll');
  var btnClear=document.getElementById('btnClearLayers');
  if(btnSelectAll)btnSelectAll.addEventListener('click',function(){setAllLayerChecks(true);});
  if(btnClear)btnClear.addEventListener('click',function(){setAllLayerChecks(false);});

  var lyW=document.getElementById('lyWeather');
  var lyH=document.getElementById('lyHype');
  var lyHeat=document.getElementById('lyHeat');
  if(lyW)lyW.addEventListener('change',function(){document.body.classList.toggle('show-weather',lyW.checked);});
  if(lyH)lyH.addEventListener('change',function(){document.body.classList.toggle('show-hype',lyH.checked);});
  if(lyHeat)lyHeat.addEventListener('change',function(){
    if(!heatLayer)return;
    if(lyHeat.checked) heatLayer.addTo(map);
    else map.removeLayer(heatLayer);
  });

  document.querySelectorAll('.time-filters button').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.time-filters button').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      rangeDays=parseInt(btn.getAttribute('data-range'),10)||30;
      renderFeed();
    });
  });

  var btnFeedCollapse=document.getElementById('btnFeedCollapse');
  if(btnFeedCollapse)btnFeedCollapse.addEventListener('click',function(){
    var feed=document.getElementById('feed');
    if(feed)feed.classList.toggle('collapsed');
  });

  document.querySelectorAll('.ops-group-toggle').forEach(function(btn){
    btn.addEventListener('click',function(){
      var id=btn.getAttribute('data-target');
      var body=document.getElementById(id);
      if(!body)return;
      var open=body.style.display!=='none';
      body.style.display=open?'none':'block';
      btn.setAttribute('aria-expanded',open?'false':'true');
      var chev=btn.querySelector('.ops-group-chevron');
      if(chev)chev.textContent=open?'▸':'▾';
    });
  });

  (function(){
    var btnLayers=document.getElementById('btnLayers');
    var btnFeed=document.getElementById('btnFeed');
    var scrim=document.getElementById('scrim');
    function closeMobile(){
      document.body.classList.remove('mobile-layers-open','mobile-feed-open');
      if(btnLayers)btnLayers.classList.remove('active');
      if(btnFeed)btnFeed.classList.remove('active');
    }
    if(btnLayers)btnLayers.addEventListener('click',function(){
      var open=document.body.classList.contains('mobile-layers-open');
      document.body.classList.remove('mobile-feed-open');
      if(btnFeed)btnFeed.classList.remove('active');
      if(open){
        document.body.classList.remove('mobile-layers-open');
        btnLayers.classList.remove('active');
      }else{
        document.body.classList.add('mobile-layers-open');
        btnLayers.classList.add('active');
      }
      setTimeout(function(){if(map)map.invalidateSize();},280);
    });
    if(btnFeed)btnFeed.addEventListener('click',function(){
      var open=document.body.classList.contains('mobile-feed-open');
      document.body.classList.remove('mobile-layers-open');
      if(btnLayers)btnLayers.classList.remove('active');
      if(open){
        document.body.classList.remove('mobile-feed-open');
        btnFeed.classList.remove('active');
      }else{
        document.body.classList.add('mobile-feed-open');
        btnFeed.classList.add('active');
      }
      setTimeout(function(){if(map)map.invalidateSize();},280);
    });
    if(scrim)scrim.addEventListener('click',closeMobile);
  })();

  function tick(){
    var el=document.getElementById('liveClock');
    if(el)el.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  }
  setInterval(tick,1000);tick();

  loadAffiliateKits();
  Promise.all([
    fetch('./data/soc-a.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('data-a '+r.status);return r.json();}),
    fetch('./data/soc-b.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('data-b '+r.status);return r.json();})
  ]).then(function(parts){
    venues=(parts[0].venues||[]).concat(parts[1].venues||[]);
    marquee=parts[0].marquee||parts[1].marquee||[];
    var heatPoints=[];
    venues.forEach(function(v){
      var intensity=Math.max(.2,Math.min(1,(v.eventCount||(v.events||[]).length||1)/13));
      var n=Math.max(2,Math.round((v.eventCount||(v.events||[]).length||1)*1.2));
      for(var i=0;i<n;i++){
        heatPoints.push([v.lat+(Math.random()-.5)*.015,v.lon+(Math.random()-.5)*.015,intensity]);
      }
    });
    if(typeof L.heatLayer==='function'){
      heatLayer=L.heatLayer(heatPoints,{
        radius:36,blur:26,maxZoom:11,max:1,
        gradient:{.2:'#0000ff',.4:'#00ff00',.6:'#ffff00',.8:'#ff8800',1:'#ff0000'}
      });
    }
    buildMarkers();
    syncLayerVisibility();
    renderFeed();
    setStatus('Live · '+venues.length+' venues','ok');
  }).catch(function(err){
    console.error(err);
    setStatus('Data load failed','err');
    var box=document.getElementById('feedScroll');
    if(box)box.innerHTML='<div style="padding:16px;color:#f87171">Could not load data. '+err.message+'</div>';
  });
})();
