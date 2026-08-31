(function(){
  function setTickerText(text){
    var tick=document.getElementById('tickerContent');
    if(!tick)return;
    var t=String(text||'').replace(/\s+/g,' ').trim();
    if(!t) t='Ops Center · Mid-Atlantic outdoor action';
    tick.textContent=t+'   ✦   '+t+'   ✦   ';
  }
  function grab(url){
    return fetch(url,{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});
  }
  function line(x){
    if(!x)return '';
    return [x.tag,x.title,x.note].filter(Boolean).join(' · ');
  }
  function boot(){
    Promise.all([grab('./intel.json'), grab('./data/intel.json')]).then(function(parts){
      var data=parts[0]||parts[1];
      if(!data)return;
      var bits=[];
      if(data.headline) bits.push(data.headline);
      (data.big_money||[]).forEach(function(x){ var l=line(x); if(l) bits.push(l); });
      (data.sleepers||[]).forEach(function(x){ var l=line(x); if(l) bits.push(l); });
      if(bits.length) setTickerText(bits.join('   ✦   '));
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
