/* Happy Land — populates product-detail.html from HL_PRODUCTS / HL_CATEGORIES (see products-data.js).
   Uses a URL hash (#slug) rather than a query string so product links keep working
   under static-file hosts that don't forward query strings on navigation. Re-renders
   on hashchange too, since switching between two product-detail.html#slug links is a
   same-document navigation and won't reload the page or re-run this script. */
(function(){
  "use strict";

  function render(){
    var slug = decodeURIComponent(window.location.hash.slice(1));
    var product = slug && HL_PRODUCTS[slug];

    if(!product){ window.location.replace("products.html"); return; }

    var category = HL_CATEGORIES[product.category];
    var images = product.images && product.images.length ? product.images : ["img/fa4ff283-d633-48e6-85d5-4b709a28ac25.jpg"];

    document.title = product.title + " — Happy Land Dairy Products";

    var bg = document.getElementById("pd-bgimg");
    bg.src = images[0];
    bg.alt = product.title;

    var img = document.getElementById("pd-image");
    img.src = images[0];
    img.alt = product.title;

    /* thumbnail gallery — only shown once a product has more than one photo */
    var thumbsWrap = document.getElementById("pd-thumbs");
    thumbsWrap.innerHTML = "";
    thumbsWrap.hidden = images.length < 2;
    images.forEach(function(src, i){
      var b = document.createElement("button");
      b.className = "pd-thumb" + (i === 0 ? " on" : "");
      b.setAttribute("aria-label", "Show photo " + (i + 1));
      b.innerHTML = '<img src="' + src + '" alt="">';
      b.addEventListener("click", function(){
        img.src = src;
        bg.src = src;
        thumbsWrap.querySelectorAll(".pd-thumb").forEach(function(t){ t.classList.remove("on"); });
        b.classList.add("on");
      });
      thumbsWrap.appendChild(b);
    });

    document.getElementById("pd-title").textContent = product.title + ".";
    document.getElementById("pd-name").textContent = product.title;
    document.getElementById("pd-category").textContent = category.name;
    document.getElementById("pd-desc").textContent = product.description;

    var brandEl = document.getElementById("pd-brandtag");
    brandEl.hidden = true;
    if(product.brandtag){ brandEl.textContent = product.brandtag; brandEl.hidden = false; }

    /* composition / ingredients — falls back to "on request" copy when not supplied,
       rather than guessing at a real ingredient list */
    var compList = document.getElementById("pd-ingredients");
    var compFallback = document.getElementById("pd-ingredients-fallback");
    if(product.ingredients && product.ingredients.length){
      compList.innerHTML = product.ingredients.map(function(item){ return "<li>" + item + "</li>"; }).join("");
      compList.hidden = false;
      compFallback.hidden = true;
    } else {
      compList.hidden = true;
      compFallback.hidden = false;
    }

    document.getElementById("pd-crumb").innerHTML =
      '<a href="index.html">Home</a> &nbsp;/&nbsp; ' +
      '<a href="products.html">Products</a> &nbsp;/&nbsp; ' +
      '<a href="' + category.href + '">' + category.name + '</a> &nbsp;/&nbsp; ' +
      '<b>' + product.title + '</b>';

    var backBtn = document.getElementById("pd-back");
    backBtn.href = category.href;
    backBtn.textContent = "← Back to " + category.name;

    /* highlight the matching nav item (clear any previous highlight first) */
    document.querySelectorAll('.menu a.active').forEach(function(a){ a.classList.remove("active"); });
    var navLink = document.querySelector('.menu a[href="' + category.href + '"]');
    if(navLink){ navLink.classList.add("active"); }
    var productsTrigger = document.querySelector('.menu .has-drop .drop-t[href="products.html"]');
    if(productsTrigger){ productsTrigger.classList.add("active"); }

    /* other products from the same category */
    var relatedWrap = document.getElementById("pd-related");
    relatedWrap.innerHTML = "";
    document.getElementById("pd-related-title").textContent = "More " + category.name;
    Object.keys(HL_PRODUCTS).forEach(function(key){
      if(key === slug || HL_PRODUCTS[key].category !== product.category) return;
      var p = HL_PRODUCTS[key];
      var a = document.createElement("a");
      a.className = "card";
      a.href = "product-detail.html#" + key;
      a.setAttribute("data-anim", "up");
      a.innerHTML =
        '<div class="ph">' + (p.brandtag ? '<span class="brandtag">' + p.brandtag + '</span>' : '') +
        '<img src="' + p.images[0] + '" alt="' + p.title + '"></div>' +
        '<div class="bd"><h3>' + p.title + '</h3><p>' + p.description + '</p>' +
        '<span class="more">View Details <span class="arw">→</span></span></div>';
      relatedWrap.appendChild(a);
    });
    document.getElementById("pd-related-section").hidden = !relatedWrap.children.length;

    var relatedReveals = [].slice.call(relatedWrap.querySelectorAll("[data-anim]"));
    if("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
      },{threshold:.16,rootMargin:"0px 0px -8% 0px"});
      relatedReveals.forEach(function(el){ io.observe(el); });
    } else {
      relatedReveals.forEach(function(el){ el.classList.add("in"); });
    }
    /* safety net, same as site.js: some mobile browsers don't fire IntersectionObserver
       for elements already in view, leaving them stuck invisible */
    function revealRelatedVisible(){
      relatedReveals.forEach(function(el){
        if(el.classList.contains("in")) return;
        var r = el.getBoundingClientRect();
        if(r.top < window.innerHeight*0.92 && r.bottom > 0) el.classList.add("in");
      });
    }
    revealRelatedVisible();
    window.addEventListener("scroll", revealRelatedVisible, {passive:true});

    window.scrollTo(0, 0);
  }

  render();
  window.addEventListener("hashchange", render);
})();
