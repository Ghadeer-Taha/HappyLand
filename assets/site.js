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
      if(window.matchMedia('(max-width:980px)').matches){
        e.preventDefault(); t.parentElement.classList.toggle('open');
      }
    });
  });

  /* --- reveal on scroll --- */
  var reveals=document.querySelectorAll('[data-anim],.step');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.16,rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(function(el){io.observe(el);});
  } else { reveals.forEach(function(el){el.classList.add('in');}); }

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
})();
