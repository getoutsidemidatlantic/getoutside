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
      var m=L.marker([v.lat,v.lon],{icon:makeIcon(v.type,wx)}).addTo(layersByType[t]);
      m.bindPopup(
        '<strong>'+v.name+'</strong><br>'+(v.city||'')+' · '+(v.type||'')+
        '<br><button onclick="openPanel(\''+v.id+'\')" style="margin-top:6px;padding:4px 10px;border-radius:6px;border:0;background:#22c55e;color:#0b1220;font-weight:700;cursor:pointer">Intel</button>'
      );
      markerById[v.id]=m;
    });
    Object.keys(counts).forEach(function(k){
      var el=document.querySelector('[data-count="'+k+'"]');
      if(el)el.textContent=counts[k]||0;
    });
  }

  function cardHtml(e,isMarquee){
    return '<div class="feed-card'+(isMarquee?' marquee':'')+'" onclick="openPanel(\''+(e.venue_id||'')+'\')">'+
      '<div class="feed-card-date">'+(e.date||'')+(e.time?' · '+e.time:'')+'</div>'+
      '<div class="feed-card-title">'+(e.teams||e.event_name||'Event')+'</div>'+
      '<div class="feed-card-meta">'+(e.venue||'')+(e.city?' · '+e.city:'')+'</div>'+
      '<div class="feed-card-wx">'+(e.weather||'')+'</div>'+
      '<div class="fc-hype">'+(e.enthusiasm||e.caption||'')+'</div>'+
    '</div>';
  }

  function renderFeed(){
    var marqueeBox=document.getElementById('feedMarquee');
    var scrollBox=document.getElementById('feedScroll');
    if(!scrollBox)return;

    var items=[];
    venues.forEach(function(v){
      (v.events||[]).forEach(function(ev){
        items.push({
          venue_id:v.id,venue:v.name,city:v.city,type:v.type,
          event_name:ev.event_name||ev.teams||'Event',teams:ev.teams,
          date:ev.date,time:ev.time,weather:ev.weather,enthusiasm:ev.enthusiasm
        });
      });
    });

    var now=new Date();now.setHours(0,0,0,0);
    var cutoff=new Date(now.getTime()+rangeDays*86400000);
    var inRange=items.filter(function(e){
      if(!e.date)return true;
      var dt=parseLocal(e.date);
      return dt&&dt>=now&&dt<=cutoff;
    });
    var mq=(marquee||[]).filter(function(e){
      if(!e.date)return true;
      var dt=parseLocal(e.date);
      return dt&&dt>=now&&dt<=cutoff;
    }).slice(0,4);

    var countEl=document.getElementById('feedCount');
    if(countEl)countEl.textContent=inRange.length+' events';

    if(marqueeBox){
      if(mq.length){
        var mh='<div class="marquee-label">Marquee</div>';
        mq.forEach(function(e){mh+=cardHtml(e,true);});
        marqueeBox.innerHTML=mh;
      }else{
        marqueeBox.innerHTML='';
      }
    }

    inRange.sort(function(a,b){return(a.date||'').localeCompare(b.date||'');});
    var html='';
    inRange.slice(0,50).forEach(function(e){html+=cardHtml(e,false);});
    if(!html&&!mq.length)html='<div style="padding:16px;color:#6b7f9a;font-size:.8rem">No events in window.</div>';
    scrollBox.innerHTML=html;

    var tick=document.getElementById('tickerContent');
    if(tick){
      tick.textContent=mq.length
        ? mq.map(function(e){return(e.teams||e.event_name)+' · '+(e.date||'');}).join('   ✦   ')+'   ✦   '
        : 'Ops Center · Mid-Atlantic outdoor action';
    }
  }

  window.openPanel=function(id){
    if(!id)return;
    var v=venues.find(function(x){return x.id===id;});
    if(!v){
      var m=markerById[id];
      if(m){map.flyTo(m.getLatLng(),11);m.openPopup();}
      return;
    }
    var hero=document.getElementById('panelHeroWrap');
    if(hero){
      if(v.image){
        hero.innerHTML='<img class="panel-hero" src="'+v.image+'" alt="" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=panel-hero-fallback>No venue photo</div>\'">';
      }else{
        hero.innerHTML='<div class="panel-hero-fallback">No venue photo yet</div>';
      }
    }
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
    (v.events||[]).slice(0,10).forEach(function(ev){
      body+='<div class="event-card"><div class="event-date">'+(ev.date||'')+' '+(ev.time||'')+'</div>';
      body+='<div class="event-teams">'+(ev.teams||ev.event_name||'Event')+'</div>';
      var meta=[];
      if(ev.outdoor==='Yes')meta.push('Outdoor');
      if(ev.weather)meta.push(ev.weather);
      if(ev.temp_f)meta.push(ev.temp_f+'°F');
      body+='<div class="event-sport">'+meta.join(' · ')+'</div>';
      if(ev.enthusiasm)body+='<p style="font-size:.78rem;color:#a8b8d0;margin-top:8px;line-height:1.4">'+ev.enthusiasm+'</p>';
      body+='</div>';
    });
    if(!(v.events||[]).length)body+='<p style="color:#6b7f9a;font-size:.8rem">No events in window.</p>';
    document.getElementById('panelBody').innerHTML=body;
    document.getElementById('panel').classList.add('open');
    document.body.classList.remove('mobile-layers-open','mobile-feed-open');
    if(v.lat&&v.lon)map.flyTo([v.lat,v.lon],11,{duration:0.8});
  };
  window.closePanel=function(){document.getElementById('panel').classList.remove('open');};
  window.flyTo=function(id){var m=markerById[id];if(m){map.flyTo(m.getLatLng(),11);m.openPopup();}};

  function syncLayerVisibility(){
    document.querySelectorAll('#layers input[data-type]').forEach(function(cb){
      var t=cb.getAttribute('data-type'),group=layersByType[t];
      if(!group)return;
      if(cb.checked){if(!map.hasLayer(group))group.addTo(map);}
      else{if(map.hasLayer(group))map.removeLayer(group);}
    });
    var heatCb=document.getElementById('lyHeat');
    if(heatLayer&&heatCb){
      if(heatCb.checked){if(!map.hasLayer(heatLayer))map.addLayer(heatLayer);}
      else{if(map.hasLayer(heatLayer))map.removeLayer(heatLayer);}
    }
  }

  document.querySelectorAll('#layers input[data-type]').forEach(function(cb){
    cb.addEventListener('change',function(){syncLayerVisibility();renderFeed();});
  });
  var lyWeather=document.getElementById('lyWeather');
  if(lyWeather)lyWeather.addEventListener('change',function(e){document.body.classList.toggle('show-weather',e.target.checked);});
  var lyHype=document.getElementById('lyHype');
  if(lyHype)lyHype.addEventListener('change',function(e){document.body.classList.toggle('show-hype',e.target.checked);});
  var lyHeat=document.getElementById('lyHeat');
  if(lyHeat)lyHeat.addEventListener('change',function(){syncLayerVisibility();});

  var btnSelectAll=document.getElementById('btnSelectAll');
  var btnClear=document.getElementById('btnClearLayers');
  if(btnSelectAll)btnSelectAll.addEventListener('click',function(){
    document.querySelectorAll('#layers input[type=checkbox]').forEach(function(cb){cb.checked=true;});
    document.body.classList.add('show-weather','show-hype');
    syncLayerVisibility();
    document.querySelectorAll('.field-layer-cb').forEach(function(cb){
      cb.checked=true;cb.dispatchEvent(new Event('change'));
    });
  });
  if(btnClear)btnClear.addEventListener('click',function(){
    document.querySelectorAll('#layers input[type=checkbox]').forEach(function(cb){cb.checked=false;});
    document.body.classList.remove('show-weather','show-hype');
    syncLayerVisibility();
    document.querySelectorAll('.field-layer-cb').forEach(function(cb){
      cb.checked=false;cb.dispatchEvent(new Event('change'));
    });
  });

  document.querySelectorAll('.ops-group-toggle').forEach(function(btn){
    btn.addEventListener('click',function(){
      var id=btn.getAttribute('data-target');
      var body=document.getElementById(id);
      if(!body)return;
      var open=body.style.display!=='none';
      body.style.display=open?'none':'block';
      btn.setAttribute('aria-expanded', open?'false':'true');
      var chev=btn.querySelector('.ops-group-chevron');
      if(chev)chev.textContent=open?'▸':'▾';
    });
  });

  document.querySelectorAll('.time-filters button').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.time-filters button').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      rangeDays=parseInt(btn.getAttribute('data-range'),10)||30;
      renderFeed();
    });
  });

  (function(){
    var feed=document.getElementById('feed');
    var btn=document.getElementById('btnFeedCollapse');
    if(!feed||!btn)return;
    function setCollapsed(on){
      feed.classList.toggle('collapsed',on);
      btn.textContent=on?'‹':'›';
      btn.title=on?'Expand feed':'Collapse feed';
      btn.setAttribute('aria-label',on?'Expand live feed':'Collapse live feed');
      setTimeout(function(){if(map)map.invalidateSize();},300);
    }
    btn.addEventListener('click',function(){
      setCollapsed(!feed.classList.contains('collapsed'));
    });
  })();

  (function(){
    var scrim=document.getElementById('scrim');
    var btnLayers=document.getElementById('btnLayers');
    var btnFeed=document.getElementById('btnFeed');
    function closeMobile(){
      document.body.classList.remove('mobile-layers-open','mobile-feed-open');
      if(btnLayers)btnLayers.classList.remove('active');
      if(btnFeed)btnFeed.classList.remove('active');
      setTimeout(function(){if(map)map.invalidateSize();},280);
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
