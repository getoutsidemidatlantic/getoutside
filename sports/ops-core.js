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
        '<div style="font-weight:700;font-size:0.95rem">'+ (v.name||'') +'</div>'+
        '<div style="font-size:0.75rem;color:#94a3b8">'+ (v.city||'') +'</div>'+
        '<div style="font-size:0.72rem;color:#64748b;margin-top:4px">'+ ((v.events||[]).length) +' events in window</div>'+
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
          (e.hype?'<div class="fc-hype">'+e.hype+'</div>':'')+
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

  function openFieldPanel(s){
    var panel=document.getElementById('panel');
    var hero=document.getElementById('panelHeroWrap');
    var venue=document.getElementById('panelVenue');
    var city=document.getElementById('panelCity');
    var chips=document.getElementById('panelChips');
    var body=document.getElementById('panelBody');
    if(!panel)return;
    if(hero){
      if(s.image){
        hero.innerHTML='<img class="panel-hero" src="'+s.image+'" alt="" onerror="this.style.display=\'none\'">';
      }else{
        hero.innerHTML='<div class="panel-hero-fallback">No image</div>';
      }
    }
    if(venue)venue.textContent=s.name||s.title||'Site';
    if(city)city.textContent=(s.city||'')+(s.group?' · '+s.group:'');
    if(chips){
      var c=[];
      if(s.group)c.push('<span class="chip">'+s.group+'</span>');
      if(s.sublayer)c.push('<span class="chip">'+s.sublayer+'</span>');
      if(s.time_sensitive)c.push('<span class="chip count">Time-sensitive</span>');
      if(s.dates)c.push('<span class="chip occasion">'+s.dates+'</span>');
      chips.innerHTML=c.join('');
    }
    if(body){
      var html='';
      if(s.note)html+='<div class="panel-section-label">Note</div><div style="font-size:.85rem;line-height:1.45;color:#c5d4e8">'+s.note+'</div>';
      if(s.dates)html+='<div class="panel-section-label">Dates</div><div style="font-size:.85rem">'+s.dates+'</div>';
      if(s.official)html+='<div class="panel-section-label">Official</div><a href="'+s.official+'" target="_blank" rel="noopener" style="color:#38bdf8;font-size:.85rem">'+s.official+'</a>';
      body.innerHTML=html||'<div style="color:#6b7f9a">No additional details.</div>';
    }
    panel.classList.add('open');
  }

  window.openPanel=function(id){
    if(!id)return;
    var v=venues.find(function(x){return x.id===id;});
    if(!v){
      var fs=(window.fieldSites||[]).find(function(x){return x.id===id;});
      if(fs){openFieldPanel(fs);return;}
      return;
    }
    var panel=document.getElementById('panel');
    var hero=document.getElementById('panelHeroWrap');
    var venue=document.getElementById('panelVenue');
    var city=document.getElementById('panelCity');
    var chips=document.getElementById('panelChips');
    var body=document.getElementById('panelBody');
    if(!panel)return;
    if(hero){
      if(v.image){
        hero.innerHTML='<img class="panel-hero" src="'+v.image+'" alt="" onerror="this.style.display=\'none\'">';
      }else{
        hero.innerHTML='<div class="panel-hero-fallback">No image</div>';
      }
    }
    if(venue)venue.textContent=v.name||'Venue';
    if(city)city.textContent=v.city||'';
    if(chips){
      var c=[];
      c.push('<span class="chip count">'+(v.eventCount||(v.events||[]).length||0)+' events</span>');
      (v.occasions||[]).forEach(function(o){c.push('<span class="chip occasion">'+o+'</span>');});
      chips.innerHTML=c.join('');
    }
    if(body){
      var html='';
      (v.events||[]).filter(eventInRange).forEach(function(e){
        html+='<div class="event-card">'+
          '<div class="event-date">'+(e.date||'')+'</div>'+
          '<div class="event-teams">'+(e.title||e.teams||'')+'</div>'+
          '<div class="event-sport">'+(e.sport||v.type||'')+(e.outdoor?' · Outdoor':'')+'</div>'+
          (e.weather?'<div style="font-size:.72rem;color:#94a3b8;margin-top:4px">'+e.weather+'</div>':'')+
          (e.hype?'<div style="font-size:.75rem;color:#a8b8d0;margin-top:4px">'+e.hype+'</div>':'')+
          '</div>';
      });
      body.innerHTML=html||'<div style="color:#6b7f9a">No events in current window.</div>';
    }
    panel.classList.add('open');
  };

  window.closePanel=function(){
    var panel=document.getElementById('panel');
    if(panel)panel.classList.remove('open');
  };

  // Layer toggles
  document.querySelectorAll('#ops-sports input[data-type]').forEach(function(cb){
    cb.addEventListener('change',syncLayerVisibility);
  });
  var btnSelectAll=document.getElementById('btnSelectAll');
  var btnClear=document.getElementById('btnClearLayers');
  if(btnSelectAll)btnSelectAll.addEventListener('click',function(){
    document.querySelectorAll('#ops-sports input[data-type]').forEach(function(cb){cb.checked=true;});
    syncLayerVisibility();
  });
  if(btnClear)btnClear.addEventListener('click',function(){
    document.querySelectorAll('#ops-sports input[data-type]').forEach(function(cb){cb.checked=false;});
    syncLayerVisibility();
  });

  // Weather / Hype / Heat toggles
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

  // Time range buttons
  document.querySelectorAll('.time-filters button').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.time-filters button').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      rangeDays=parseInt(btn.getAttribute('data-range'),10)||30;
      renderFeed();
    });
  });

  // Feed collapse (desktop)
  var btnFeedCollapse=document.getElementById('btnFeedCollapse');
  if(btnFeedCollapse)btnFeedCollapse.addEventListener('click',function(){
    var feed=document.getElementById('feed');
    if(feed)feed.classList.toggle('collapsed');
  });

  // Group toggles
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

  // Mobile Layers / Feed drawers
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
