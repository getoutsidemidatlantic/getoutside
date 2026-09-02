(function(){
  var ALIAS={
    navy:'navystad',
    navystadium:'navystad',
    wolftrap:'wolftrap-ttb',
    'wolftrap-ttb':'wolftrap-ttb',
    mtbank:'mtbank',
    linc:'linc',
    lincoln:'linc'
  };
  function intelId(){
    var q=new URLSearchParams(window.location.search).get('intel');
    if(!q && window.location.hash){
      var m=String(window.location.hash).match(/intel=([^&]+)/);
      if(m) q=decodeURIComponent(m[1]);
    }
    if(!q) return '';
    q=String(q).trim();
    return ALIAS[q]||q;
  }
  function panelOpen(){
    var p=document.getElementById('panel');
    return p && p.classList.contains('open');
  }
  function run(n){
    var id=intelId();
    if(!id) return;
    if(typeof window.openPanel==='function') window.openPanel(id);
    if(panelOpen()) return;
    if(n<24) setTimeout(function(){ run(n+1); }, 250);
  }
  if(document.readyState==='complete') run(0);
  else window.addEventListener('load', function(){ run(0); });
})();
