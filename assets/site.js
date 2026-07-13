/* Happy Land — shared interactions: nav, reveal-on-scroll, counters,
   hero slider, testimonial slider. Vanilla, no dependencies. */
(function(){
  "use strict";

  /* --- sticky nav shrink --- */
  var nav = document.querySelector('.nav');
  if(nav){
    var onScroll=function(){ nav.classList.toggle('shrink', window.scrollY>10); };
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }

  /* --- contact form: mockup only, no backend wired up yet --- */
  var form=document.querySelector('.form');
  if(form){ form.addEventListener('submit',function(e){ e.preventDefault(); }); }

  /* --- mobile menu --- */
  var burger=document.querySelector('.burger'), menu=document.querySelector('.menu');
  if(burger&&menu){
    burger.addEventListener('click',function(){ menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){ if(!a.classList.contains('drop-t')) menu.classList.remove('open'); });
    });
  }

  /* --- language switch (EN / AR) — placeholder for future i18n --- */
  var navCta=document.querySelector('.nav-cta');
  if(navCta && !navCta.querySelector('.lang-switch')){
    var ls=document.createElement('div');
    ls.className='lang-switch';
    ls.setAttribute('role','group');
    ls.setAttribute('aria-label','Language');
    ls.innerHTML='<button class="on" data-lang="en" aria-pressed="true">EN</button>'+
                 '<button data-lang="ar" aria-pressed="false" title="Arabic version coming soon">AR</button>';
    navCta.insertBefore(ls, navCta.firstChild);
    ls.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click',function(){
        ls.querySelectorAll('button').forEach(function(x){ x.classList.remove('on'); x.setAttribute('aria-pressed','false'); });
        b.classList.add('on'); b.setAttribute('aria-pressed','true');
        try{ localStorage.setItem('hl_lang', b.dataset.lang); }catch(e){}
        /* Future: load Arabic content + set document.dir='rtl'. English-only for now. */
      });
    });
  }

  /* --- dropdown (click toggle on mobile) --- */
  document.querySelectorAll('.has-drop .drop-t').forEach(function(t){
    t.addEventListener('click',function(e){
      if(window.matchMedia('(max-width:1360px)').matches){
        e.preventDefault(); t.parentElement.classList.toggle('open');
      }
    });
  });

  /* --- reveal on scroll --- */
  var reveals=[].slice.call(document.querySelectorAll('[data-anim],.step'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.16,rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(function(el){io.observe(el);});
  } else { reveals.forEach(function(el){el.classList.add('in');}); }

  /* Safety net: some mobile browsers don't fire IntersectionObserver for elements
     already in view on load, leaving them stuck at opacity:0. Force-reveal anything
     visible on scroll/load, and force-reveal everything after a short delay regardless. */
  function revealVisible(){
    reveals.forEach(function(el){
      if(el.classList.contains('in')) return;
      var r=el.getBoundingClientRect();
      if(r.top<window.innerHeight*0.92 && r.bottom>0) el.classList.add('in');
    });
  }
  revealVisible();
  window.addEventListener('scroll',revealVisible,{passive:true});
  window.addEventListener('resize',revealVisible);
  setTimeout(function(){ reveals.forEach(function(el){ el.classList.add('in'); }); },2500);

  /* --- count-up counters --- */
  var counters=document.querySelectorAll('[data-count]');
  if(counters.length && 'IntersectionObserver' in window){
    var cio=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        var el=e.target, target=parseFloat(el.dataset.count), suf=el.dataset.suffix||'', dec=(el.dataset.dec|0);
        var t0=null, dur=1500;
        function tick(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1); var ease=1-Math.pow(1-p,3);
          el.textContent=(target*ease).toFixed(dec)+suf; if(p<1)requestAnimationFrame(tick); }
        requestAnimationFrame(tick); cio.unobserve(el);
      });
    },{threshold:.5});
    counters.forEach(function(el){cio.observe(el);});
  }

  /* --- generic slider factory --- */
  function makeSlider(opts){
    var slides=opts.slides, dots=opts.dots, current=0, timer=null;
    function render(){
      slides.forEach(function(s,i){ s.classList.toggle('on', i===current); });
      if(dots) dots.forEach(function(d,i){ d.classList.toggle('on', i===current); });
      if(opts.onChange) opts.onChange(current);
    }
    function go(n){ current=(n+slides.length)%slides.length; render(); restart(); }
    function next(){ go(current+1); } function prev(){ go(current-1); }
    function restart(){ if(!opts.auto) return; clearInterval(timer); timer=setInterval(next,opts.auto); }
    render(); restart();
    return {go:go,next:next,prev:prev};
  }

  /* --- hero slider (crossfade) --- */
  var hero=document.querySelector('.hero');
  if(hero){
    var hslides=[].slice.call(hero.querySelectorAll('.slide'));
    var dotWrap=hero.querySelector('.dots');
    var hdots=[];
    if(dotWrap){
      hslides.forEach(function(_,i){
        var b=document.createElement('button'); b.setAttribute('aria-label','Go to slide '+(i+1));
        b.addEventListener('click',function(){ hs.go(i); }); dotWrap.appendChild(b); hdots.push(b);
      });
    }
    var hs=makeSlider({slides:hslides,dots:hdots,auto:6000});
    var nx=hero.querySelector('.next'), pv=hero.querySelector('.prev');
    if(nx)nx.addEventListener('click',hs.next); if(pv)pv.addEventListener('click',hs.prev);
  }

  /* --- testimonial slider (track slide) --- */
  var q=document.querySelector('.quotes');
  if(q){
    var track=q.querySelector('.q-track');
    var items=[].slice.call(q.querySelectorAll('.q-item'));
    var navWrap=q.querySelector('.q-nav');
    var qdots=[], qi=0, qtimer;
    items.forEach(function(_,i){
      var b=document.createElement('button'); b.setAttribute('aria-label','Testimonial '+(i+1));
      b.addEventListener('click',function(){ qgo(i); }); navWrap.appendChild(b); qdots.push(b);
    });
    function qrender(){ track.style.transform='translateX(-'+(qi*100)+'%)';
      qdots.forEach(function(d,i){ d.classList.toggle('on',i===qi); }); }
    function qgo(n){ qi=(n+items.length)%items.length; qrender(); clearInterval(qtimer); qtimer=setInterval(function(){qgo(qi+1);},7000); }
    qrender(); qtimer=setInterval(function(){qgo(qi+1);},7000);
  }

  /* --- year in footer --- */
  var y=document.querySelector('[data-year]'); if(y)y.textContent=new Date().getFullYear();

  /* --- certificate thumbnail zoom lightbox --- */
  var certBox=document.querySelector('.cert-lightbox');
  if(certBox){
    var certImg=certBox.querySelector('img'), certTitle=certBox.querySelector('b'), certPdfLink=certBox.querySelector('.cert-pdf-link');
    document.querySelectorAll('.cert-thumb').forEach(function(t){
      t.addEventListener('click',function(){
        certImg.src=t.dataset.full; certImg.alt=t.dataset.name;
        certTitle.textContent=t.dataset.name;
        certPdfLink.href=t.dataset.pdf;
        certBox.classList.add('on');
      });
    });
    certBox.addEventListener('click',function(e){ if(e.target===certBox) certBox.classList.remove('on'); });
    certBox.querySelector('.cert-lightbox-close').addEventListener('click',function(){ certBox.classList.remove('on'); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') certBox.classList.remove('on'); });
  }

  /* --- interactive Gulf map: hover/tap a country or pin for details --- */
  var imap=document.querySelector('.interactive-map');
  if(imap){
    var tip=imap.querySelector('.im-tooltip');
    var countries=[].slice.call(imap.querySelectorAll('.im-country'));
    var pins=[].slice.call(imap.querySelectorAll('.im-pin'));
    var info={
      "Saudi Arabia":{full:"Kingdom of Saudi Arabia",flag:'<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#0f7a3d"/><rect x="9" y="24" width="34" height="3.4" rx="1.7" fill="#fff"/><circle cx="47" cy="25.7" r="2.6" fill="#fff"/><path d="M9 24c4-3 8-3 12 0" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>'},
      "UAE":{full:"United Arab Emirates",flag:'<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#fff"/><rect x="15" width="45" height="13.33" fill="#00732F"/><rect x="15" y="13.33" width="45" height="13.34" fill="#fff"/><rect x="15" y="26.67" width="45" height="13.33" fill="#000"/><rect width="15" height="40" fill="#FF0000"/></svg>'},
      "Bahrain":{full:"Kingdom of Bahrain",flag:'<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#CE1126"/><path d="M0 0 H22 L14 4 22 8 14 12 22 16 14 20 22 24 14 28 22 32 14 36 22 40 H0 Z" fill="#fff"/></svg>'},
      "Kuwait":{full:"State of Kuwait",flag:'<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#fff"/><rect width="60" height="13.33" fill="#007A3D"/><rect y="26.67" width="60" height="13.33" fill="#CE1126"/><path d="M0 0 L20 0 8 20 20 40 0 40 Z" fill="#000"/></svg>'},
      "Qatar":{full:"State of Qatar",flag:'<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#8A1538"/><path d="M0 0 H18 L10 4 18 8 10 12 18 16 10 20 18 24 10 28 18 32 10 36 18 40 H0 Z" fill="#fff"/></svg>'}
    };
    function setActive(name){
      countries.forEach(function(c){ c.classList.toggle('im-active', c.dataset.country===name); });
      pins.forEach(function(p){ p.classList.toggle('im-active', p.dataset.country===name); });
    }
    function showTip(name, anchorEl){
      var d=info[name]; if(!d) return;
      tip.innerHTML='<span class="flag-ic">'+d.flag+'</span><span><b>'+name+'</b><span>'+d.full+'</span></span>';
      var svg=imap.querySelector('svg'); var svgBox=svg.getBoundingClientRect(); var mapBox=imap.getBoundingClientRect();
      var pt=anchorEl.getBoundingClientRect();
      var x=(pt.left+pt.right)/2 - mapBox.left;
      var yTop=pt.top - mapBox.top;
      tip.style.left=x+'px'; tip.style.top=yTop+'px';
      tip.classList.add('on');
      setActive(name);
    }
    function hideTip(){ tip.classList.remove('on'); setActive(null); }
    function bind(el){
      var name=el.dataset.country;
      el.addEventListener('mouseenter',function(){ showTip(name, el); });
      el.addEventListener('mouseleave',hideTip);
      el.addEventListener('click',function(e){
        e.stopPropagation();
        if(tip.classList.contains('on') && tip.dataset.current===name){ hideTip(); tip.dataset.current=''; }
        else { showTip(name, el); tip.dataset.current=name; }
      });
      el.setAttribute('tabindex','0');
      el.addEventListener('focus',function(){ showTip(name, el); });
      el.addEventListener('blur',hideTip);
    }
    countries.forEach(bind); pins.forEach(bind);
    document.addEventListener('click',function(){ hideTip(); tip.dataset.current=''; });
  }
})();
