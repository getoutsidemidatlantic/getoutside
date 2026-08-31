(function(){
  'use strict';
  var statusEl=document.getElementById('statusBar');
  function setStatus(msg,kind){
    if(!statusEl)return;
    statusEl.textContent=msg; statusEl.className=kind||''; statusEl.style.display='block';
    if(kind==='ok')setTimeout(function(){if(statusEl.textContent===msg)statusEl.style.display='none';},2200);
  }
  var map=L.map('map',{center:[39.2,-78.0],zoom:7});
  window.map=map;
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',{attribution:'Tiles © Esri',maxZoom:16}).addTo(map);
  var layersByType={nfl:L.layerGroup().addTo(map),mlb:L.layerGroup().addTo(map),soccer:L.layerGroup().addTo(map),practice:L.layerGroup().addTo(map),college:L.layerGroup().addTo(map),milb:L.layerGroup().addTo(map),d2:L.layerGroup().addTo(map),d3:L.layerGroup().addTo(map),golf:L.layerGroup().addTo(map)};
  var markerById={},venues=[],marquee=[],rangeDays=30,heatLayer=null;
  var affiliateKits=null;
  function loadAffiliateKits(){
    return fetch('./data/affiliate-kits.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('affiliate');return r.json();}).then(function(d){affiliateKits=d;}).catch(function(){affiliateKits=null;});
  }
  function resolveGearKeys(ctx){
    if(!affiliateKits)return [];
    var keys=[],seen={};
    function add(list){(list||[]).forEach(function(k){if(k&&!seen[k]&&affiliateKits.kits&&affiliateKits.kits[k]){seen[k]=1;keys.push(k);}});}
    if(ctx.id)add((affiliateKits.by_venue_id||{})[ctx.id]);
    if(ctx.type)add((affiliateKits.by_venue_type||{})[String(ctx.type).toLowerCase()]);
    if(ctx.sublayer)add((affiliateKits.by_sublayer||{})[ctx.sublayer]);
    (ctx.occasions||[]).forEach(function(o){add((affiliateKits.by_occasion||{})[o]);});
    return keys.slice(0,affiliateKits.max_per_panel||3);
  }
  function renderGearSection(ctx){
    var keys=resolveGearKeys(ctx); if(!keys.length)return '';
    var html='<div class="panel-section-label">Gear for this</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px">';
    keys.forEach(function(k){ var kit=affiliateKits.kits[k]; if(!kit||!kit.url)return; html+='<a href="'+kit.url+'" target="_blank" rel="noopener sponsored" style="display:inline-block;padding:5px 10px;border-radius:999px;background:#1e3a55;border:1px solid #2a4a6a;color:#e8eef7;font-size:.72rem;font-weight:600;text-decoration:none">'+(kit.label||k)+' →</a>'; });
    html+='</div><p style="font-size:.62rem;color:#6b7f9a;margin-bottom:12px">'+(affiliateKits.disclosure||'As an Amazon Associate I earn from qualifying purchases.')+'</p>';
    return html;
  }
  var iconEmoji={nfl:'🏈',mlb:'⚾',soccer:'⚽',practice:'🏈',college:'🏈',milb:'⚾',d2:'🏈',d3:'🏈',golf:'⛳'};
  function normType(t){ t=(t||'').toLowerCase(); if(t==='mls'||t==='nwsl')return'soccer'; if(t==='d1')return'college'; if(t==='d3')return'd2'; return t; }
  function makeIcon(type){ var t=normType(type); return L.divIcon({className:'',html:'<div class="soc-icon '+t+'">'+(iconEmoji[t]||'📍')+'</div>',iconSize:[30,30],iconAnchor:[15,15]}); }
  function parseLocal(d){ if(!d)return null; var p=String(d).split('-'); if(p.length<3)return new Date(d); return new Date(+p[0],+p[1]-1,+p[2]); }
  function buildMarkers(){
    Object.values(layersByType).forEach(function(g){g.clearLayers();});
    Object.keys(markerById).forEach(function(k){delete markerById[k];});
    var counts={nfl:0,mlb:0,soccer:0,practice:0,college:0,milb:0,d2:0,golf:0};
    venues.forEach(function(v){
      var t=normType(v.type); if(!layersByType[t])return;
      counts[t]=(counts[t]||0)+1;
      var m=L.marker([v.lat,v.lon],{icon:makeIcon(t)});
      m.bindPopup('<div style="min-width:160px"><div style="font-weight:700">'+(v.name||'')+'</div><div style="font-size:0.75rem;color:#94a3b8">'+(v.city||'')+'</div><div style="font-size:0.72rem;color:#64748b">'+((v.events||[]).length)+' events</div><br><button onclick="openPanel(\''+v.id+'\')" style="padding:4px 10px;border-radius:6px;border:0;background:#22c55e;font-weight:700;cursor:pointer">Intel</button></div>');
      m.on('click',function(){openPanel(v.id);});
      layersByType[t].addLayer(m); markerById[v.id]=m;
    });
    Object.keys(counts).forEach(function(k){ var el=document.querySelector('[data-count="'+k+'"]'); if(el)el.textContent=counts[k]||0; });
  }
  function syncLayerVisibility(){
    document.querySelectorAll('#ops-sports input[data-type]').forEach(function(cb){
      var t=cb.getAttribute('data-type'); var g=layersByType[t]; if(!g)return;
      if(cb.checked){ if(!map.hasLayer(g)) g.addTo(map); } else { if(map.hasLayer(g)) map.removeLayer(g); }
    });
  }
  function eventInRange(e){ var d=parseLocal(e.date); if(!d||isNaN(d))return false; var now=new Date(); now.setHours(0,0,0,0); var end=new Date(now); end.setDate(end.getDate()+rangeDays); return d>=now && d<=end; }
  function renderFeed(){
    var box=document.getElementById('feedScroll'); var marq=document.getElementById('feedMarquee'); var countEl=document.getElementById('feedCount'); if(!box)return;
    var cards=[], marqueeCards=[];
    venues.forEach(function(v){ (v.events||[]).forEach(function(e){
      if(!eventInRange(e))return;
      var html='<div class="feed-card" onclick="openPanel(\''+(v.id||'')+'\')"><div class="feed-card-date">'+(e.date||'')+'</div><div class="feed-card-title">'+(e.title||e.teams||v.name||'')+'</div><div class="feed-card-meta">'+(v.name||'')+(v.city?' · '+v.city:'')+'</div>'+(e.enthusiasm?'<div class="fc-hype">'+e.enthusiasm+'</div>':'')+'</div>';
      cards.push({html:html,date:e.date});
    }); });
    cards.sort(function(a,b){return (a.date||'').localeCompare(b.date||'');});
    if(marq) marq.innerHTML='';
    box.innerHTML=cards.map(function(c){return c.html;}).join('') || '<div style="padding:16px;color:#6b7f9a">No events in current window.</div>';
    if(countEl)countEl.textContent=cards.length+' events';
  }
  function setHero(imgUrl){
    var hero=document.getElementById('panelHeroWrap'); if(!hero)return;
    if(imgUrl) hero.innerHTML='<img class="panel-hero" src="'+imgUrl+'" alt="" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=panel-hero-fallback>No venue photo</div>\'">';
    else hero.innerHTML='<div class="panel-hero-fallback">No venue photo yet</div>';
  }
  function openFieldPanel(s){
    setHero(s.image||'');
    document.getElementById('panelVenue').textContent=s.name||s.title||'Site';
    document.getElementById('panelCity').textContent=s.city||'';
    document.getElementById('panelChips').innerHTML='<span class="chip">'+(s.sublayer||s.group||'Field')+'</span>';
    var body=''; if(s.note) body+='<div class="panel-section-label">Intel</div><p style="font-size:.8rem;color:#c5d4e8;line-height:1.45">'+s.note+'</p>';
    if(s.official||s.url) body+='<p style="margin-top:10px"><a href="'+(s.official||s.url)+'" target="_blank" rel="noopener" style="color:#38bdf8">Open official site →</a></p>';
    document.getElementById('panelBody').innerHTML=body||'<p style="color:#6b7f9a">No extra intel.</p>';
    document.getElementById('panel').classList.add('open');
    if(s.lat!=null) map.flyTo([s.lat,s.lon||s.lng],11,{duration:0.8});
  }
  window.openPanel=function(id){
    if(!id)return;
    var v=venues.find(function(x){return x.id===id;});
    if(!v){ var fs=(window.fieldSites||[]).find(function(x){return x.id===id;}); if(fs){openFieldPanel(fs);return;} return; }
    setHero(v.image||'');
    document.getElementById('panelVenue').textContent=v.name;
    document.getElementById('panelCity').textContent=(v.city||'')+' · '+String(v.type||'').toUpperCase();
    document.getElementById('panelChips').innerHTML='<span class="chip count">'+(v.events||[]).length+' events</span><span class="chip">'+(v.type||'')+'</span>';
    var body='';
    if(v.history) body+='<div class="panel-section-label">History</div><p style="font-size:.8rem;color:#c5d4e8;margin-bottom:12px">'+v.history+'</p>';
    if(v.people_love) body+='<div class="panel-section-label">Why people love it</div><p style="font-size:.8rem;color:#c5d4e8;margin-bottom:12px">'+v.people_love+'</p>';
    body+='<div class="panel-section-label">Upcoming</div>';
    (v.events||[]).filter(eventInRange).slice(0,12).forEach(function(ev){
      body+='<div class="event-card"><div class="event-date">'+(ev.date||'')+' '+(ev.time||'')+'</div><div class="event-teams">'+(ev.teams||ev.title||'')+'</div>';
      if(ev.enthusiasm) body+='<p style="font-size:.78rem;color:#a8b8d0;margin-top:8px">'+ev.enthusiasm+'</p>';
      body+='</div>';
    });
    if(!(v.events||[]).length) body+='<p style="color:#6b7f9a;font-size:.8rem">No events in window.</p>';
    body+=renderGearSection({id:v.id,type:v.type,occasions:v.occasions||[]});
    document.getElementById('panelBody').innerHTML=body;
    document.getElementById('panel').classList.add('open');
    if(v.lat&&v.lon) map.flyTo([v.lat,v.lon],11,{duration:0.8});
  };
  window.closePanel=function(){document.getElementById('panel').classList.remove('open');};
  document.querySelectorAll('#ops-sports input[data-type]').forEach(function(cb){ cb.addEventListener('change',syncLayerVisibility); });
  function setAllLayerChecks(on){
    document.querySelectorAll('#ops-sports input[data-type]').forEach(function(cb){cb.checked=!!on;});
    document.querySelectorAll('.field-layer-cb').forEach(function(cb){ cb.checked=!!on; try{cb.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){} });
    syncLayerVisibility();
  }
  var btnSelectAll=document.getElementById('btnSelectAll'); var btnClear=document.getElementById('btnClearLayers');
  if(btnSelectAll)btnSelectAll.addEventListener('click',function(){setAllLayerChecks(true);});
  if(btnClear)btnClear.addEventListener('click',function(){setAllLayerChecks(false);});
  var lyH=document.getElementById('lyHype'); if(lyH) lyH.addEventListener('change',function(){document.body.classList.toggle('show-hype',lyH.checked);});
  var lyW=document.getElementById('lyWeather'); if(lyW) lyW.addEventListener('change',function(){document.body.classList.toggle('show-weather',lyW.checked);});
  var lyHeat=document.getElementById('lyHeat'); if(lyHeat) lyHeat.addEventListener('change',function(){ if(!heatLayer)return; if(lyHeat.checked) heatLayer.addTo(map); else map.removeLayer(heatLayer); });
  document.querySelectorAll('.time-filters button').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.time-filters button').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active'); rangeDays=parseInt(btn.getAttribute('data-range'),10)||30; renderFeed();
    });
  });
  var btnFeedCollapse=document.getElementById('btnFeedCollapse');
  if(btnFeedCollapse)btnFeedCollapse.addEventListener('click',function(){ var feed=document.getElementById('feed'); if(feed)feed.classList.toggle('collapsed'); });
  (function(){
    var btnLayers=document.getElementById('btnLayers'); var btnFeed=document.getElementById('btnFeed'); var scrim=document.getElementById('scrim');
    function closeMobile(){ document.body.classList.remove('mobile-layers-open','mobile-feed-open'); if(btnLayers)btnLayers.classList.remove('active'); if(btnFeed)btnFeed.classList.remove('active'); }
    if(btnLayers)btnLayers.addEventListener('click',function(){ var open=document.body.classList.contains('mobile-layers-open'); document.body.classList.remove('mobile-feed-open'); if(btnFeed)btnFeed.classList.remove('active'); if(open){ document.body.classList.remove('mobile-layers-open'); btnLayers.classList.remove('active'); } else { document.body.classList.add('mobile-layers-open'); btnLayers.classList.add('active'); } });
    if(btnFeed)btnFeed.addEventListener('click',function(){ var open=document.body.classList.contains('mobile-feed-open'); document.body.classList.remove('mobile-layers-open'); if(btnLayers)btnLayers.classList.remove('active'); if(open){ document.body.classList.remove('mobile-feed-open'); btnFeed.classList.remove('active'); } else { document.body.classList.add('mobile-feed-open'); btnFeed.classList.add('active'); } });
    if(scrim)scrim.addEventListener('click',closeMobile);
  })();
  function tick(){ var el=document.getElementById('liveClock'); if(el)el.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }
  setInterval(tick,1000); tick();
  loadAffiliateKits();
  Promise.all([
    fetch('./data/soc-a.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('data-a');return r.json();}),
    fetch('./data/soc-b.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('data-b');return r.json();}),
    fetch('./data/soc-milb.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():{venues:[]};}).catch(function(){return {venues:[]};})
  ]).then(function(parts){
    var seen={}; venues=[];
    parts.forEach(function(p){ (p.venues||[]).forEach(function(v){ if(!v||!v.id)return; if(seen[v.id]){ if((v.events||[]).length>(seen[v.id].events||[]).length){ var i=venues.indexOf(seen[v.id]); seen[v.id]=v; if(i>=0)venues[i]=v; } return; } seen[v.id]=v; venues.push(v); }); });
    buildMarkers(); syncLayerVisibility(); renderFeed();
    setStatus('Live · '+venues.length+' venues','ok');
  }).catch(function(err){ console.error(err); setStatus('Data load failed','err'); });
})();
