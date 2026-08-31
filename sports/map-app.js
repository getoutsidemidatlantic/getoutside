// Ops Center map-app.js — field shards + slow intel ticker
(function () {
  const fieldColor = {Festivals:'#f59e0b',Concerts:'#a855f7',Camping:'#22c55e',Trails:'#16a34a','Scenic Lookouts':'#0ea5e9',Lakes:'#06b6d4',History:'#a78bfa',Paddling:'#14b8a6',Parks:'#14b8a6',Fairs:'#eab308',Food:'#f97316',Breweries:'#b45309','Dock Bars':'#0369a1',Waterfalls:'#0284c7','MX / ORV':'#92400e',Fishing:'#0f766e',Other:'#64748b'};
  const fieldEmoji = {Festivals:'🎪',Concerts:'🎵',Camping:'⛺',Trails:'🥾','Scenic Lookouts':'🏔️',Lakes:'💧',History:'🏛️',Paddling:'🛶',Parks:'🏞️',Fairs:'🎡',Food:'🍺',Breweries:'🍺','Dock Bars':'🍹',Waterfalls:'💦','MX / ORV':'🏍️',Fishing:'🎣',Other:'📍'};
  const fieldLayerGroups = {}; window.fieldLayerGroups = fieldLayerGroups;
  function ensureGroup(sub){ if(!fieldLayerGroups[sub]) fieldLayerGroups[sub]=L.layerGroup(); return fieldLayerGroups[sub]; }
  function makeFieldIcon(sub){ return L.divIcon({className:'',html:'<div class="field-icon" style="background:'+(fieldColor[sub]||'#64748b')+'">'+(fieldEmoji[sub]||'📍')+'</div>',iconSize:[28,28],iconAnchor:[14,14]}); }
  function popupHtml(item){ const title=item.title||item.name||''; const note=item.note||''; const tag=item.tag||item.sublayer||''; const url=item.url||item.official||'#'; const id=item.id||''; const city=item.city?'<div style="font-size:0.75rem;color:#94a3b8">'+item.city+'</div>':''; const dates=item.dates?'<div style="font-size:0.72rem;color:#64748b">'+item.dates+'</div>':''; const btn=id?'<button type="button" onclick="openPanel(\''+id+'\')" style="margin-top:4px;padding:4px 10px;border-radius:6px;border:0;background:#22c55e;color:#0b1220;font-weight:700;cursor:pointer">Intel</button>':''; const link=(url&&url!=='#')?'<a href="'+url+'" target="_blank" rel="noopener" style="font-size:0.75rem;color:#0284c7">Open</a>':''; return '<div style="min-width:180px;font-family:system-ui">'+'<div style="font-size:0.7rem;font-weight:700;color:#f59e0b;text-transform:uppercase">'+tag+'</div>'+'<div style="font-weight:700">'+title+'</div>'+city+dates+'<div style="font-size:0.8rem;color:#64748b">'+note+'</div>'+btn+link+'</div>'; }
  function getLatLng(item){ if(item.lat!=null&&(item.lon!=null||item.lng!=null)) return [item.lat, item.lon!=null?item.lon:item.lng]; return [39,-77.5]; }
  function injectLayerUI(sites){ const box=document.getElementById('layers'); if(!box||document.getElementById('opsFieldGroups')) return; const fieldSubs={},entSubs={}; (sites||[]).forEach(function(s){ const g=s.group||'Field'; const sub=s.sublayer||'Other'; if(g==='Entertainment') entSubs[sub]=(entSubs[sub]||0)+1; else fieldSubs[sub]=(fieldSubs[sub]||0)+1; }); function groupHtml(id,title,subs){ const rows=Object.keys(subs).sort().map(function(sub){ return '<label class="layer-item field-sub"><input type="checkbox" class="field-layer-cb" data-sublayer="'+sub+'" checked/> <span class="layer-swatch" style="background:'+(fieldColor[sub]||'#64748b')+'">'+(fieldEmoji[sub]||'📍')+'</span> '+sub+' <span class="layer-count">'+subs[sub]+'</span></label>'; }).join(''); return '<div class="ops-group"><button type="button" class="ops-group-toggle"><span>'+title+'</span></button><div class="ops-group-body">'+rows+'</div></div>'; } const wrap=document.createElement('div'); wrap.id='opsFieldGroups'; wrap.innerHTML=groupHtml('opsGroupField','Field',fieldSubs)+groupHtml('opsGroupEnt','Entertainment',entSubs); box.appendChild(wrap); wrap.querySelectorAll('.field-layer-cb').forEach(function(cb){ cb.addEventListener('change',function(){ const sub=cb.getAttribute('data-sublayer'); const lg=fieldLayerGroups[sub]; const m=window.map; if(!lg||!m) return; if(cb.checked) lg.addTo(m); else m.removeLayer(lg); }); }); }
  function grab(url){ return fetch(url,{cache:'no-store'}).then(function(r){ return r.ok?r.json():{sites:[]}; }).catch(function(){ return {sites:[]}; }); }
  function loadFieldSites(){ const urls=['./data/field-sites.json','./data/field-sites-extra.json','./data/field-sites-breweries.json','./data/field-sites-docks.json','./data/field-sites-camping.json','./data/field-sites-fairs.json','./data/field-sites-falls.json']; return Promise.all(urls.map(grab)).then(function(parts){ const m=window.map; if(!m){ setTimeout(loadFieldSites,400); return; } const seen={}, list=[]; parts.forEach(function(data){ ((data&&data.sites)||[]).forEach(function(s){ if(!s||!s.id||seen[s.id]) return; seen[s.id]=true; list.push(s); }); }); window.fieldSites=list; list.forEach(function(s){ const sub=s.sublayer||'Other'; const lg=ensureGroup(sub); const marker=L.marker(getLatLng(s),{icon:makeFieldIcon(sub)}); marker.bindPopup(popupHtml(s)); marker.on('click',function(){ if(typeof window.openPanel==='function') window.openPanel(s.id); }); lg.addLayer(marker); }); Object.values(fieldLayerGroups).forEach(function(lg){ if(!m.hasLayer(lg)) lg.addTo(m); }); injectLayerUI(list); }); }
  function loadIntelTicker(){
    function line(x){ return x?[x.tag,x.title].filter(Boolean).join(' · ')+(x.note?' — '+x.note:''):''; }
    Promise.all([grab('./intel.json'), grab('./data/intel.json')]).then(function(parts){
      var data=parts[0]||parts[1]; if(!data) return;
      var bits=[]; if(data.headline) bits.push(data.headline);
      (data.big_money||[]).forEach(function(x){ var l=line(x); if(l) bits.push(l); });
      (data.sleepers||[]).forEach(function(x){ var l=line(x); if(l) bits.push(l); });
      var tick=document.getElementById('tickerContent');
      if(!tick||!bits.length) return;
      var loop=bits.join('     ✦     ')+'     ✦     ';
      tick.textContent=loop+loop;
      var secs=Math.max(90, Math.min(220, Math.round(loop.length/5.5)));
      tick.style.animationDuration=secs+'s';
      tick.style.animationTimingFunction='linear';
    });
  }
  function boot(){ if(window.map){ loadFieldSites(); loadIntelTicker(); } else setTimeout(boot,200); }
  boot();
})();
