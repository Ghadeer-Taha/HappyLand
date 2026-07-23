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

    var isAr = document.documentElement.lang === "ar";
    var t = { home:"Home", products:"Products", back:"← Back to ", more:"More ", view:"View Details", request:"available on request" };
    var tAr = { home:"الرئيسية", products:"المنتجات", back:"→ العودة إلى ", more:"المزيد من ", view:"عرض التفاصيل", request:"متوفر عند الطلب" };
    var L = isAr ? tAr : t;

    var category = HL_CATEGORIES[product.category];
    var categoryName = isAr && category.nameAr ? category.nameAr : category.name;
    var productTitle = isAr && product.titleAr ? product.titleAr : product.title;
    var productDesc = isAr && product.descriptionAr ? product.descriptionAr : product.description;
    var images = product.images && product.images.length ? product.images : ["img/fa4ff283-d633-48e6-85d5-4b709a28ac25.jpg"];

    document.title = productTitle + " — Happy Land Dairy Products";

    var bg = document.getElementById("pd-bgimg");
    bg.src = images[0];
    bg.alt = productTitle;

    var img = document.getElementById("pd-image");
    img.src = images[0];
    img.alt = productTitle;

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

    document.getElementById("pd-title").textContent = productTitle + ".";
    document.getElementById("pd-name").textContent = productTitle;
    document.getElementById("pd-category").textContent = categoryName;
    document.getElementById("pd-desc").textContent = productDesc;

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
      '<a href="index.html">' + L.home + '</a> &nbsp;/&nbsp; ' +
      '<a href="products.html">' + L.products + '</a> &nbsp;/&nbsp; ' +
      '<a href="' + category.href + '">' + categoryName + '</a> &nbsp;/&nbsp; ' +
      '<b>' + productTitle + '</b>';

    var backBtn = document.getElementById("pd-back");
    backBtn.href = category.href;
    backBtn.textContent = L.back + categoryName;

    /* highlight the matching nav item (clear any previous highlight first) */
    document.querySelectorAll('.menu a.active').forEach(function(a){ a.classList.remove("active"); });
    var navLink = document.querySelector('.menu a[href="' + category.href + '"]');
    if(navLink){ navLink.classList.add("active"); }
    var productsTrigger = document.querySelector('.menu .has-drop .drop-t[href="products.html"]');
    if(productsTrigger){ productsTrigger.classList.add("active"); }

    /* other products from the same category */
    var relatedWrap = document.getElementById("pd-related");
    relatedWrap.innerHTML = "";
    document.getElementById("pd-related-title").textContent = L.more + categoryName;
    Object.keys(HL_PRODUCTS).forEach(function(key){
      if(key === slug || HL_PRODUCTS[key].category !== product.category) return;
      var p = HL_PRODUCTS[key];
      var pTitle = isAr && p.titleAr ? p.titleAr : p.title;
      var pDesc = isAr && p.descriptionAr ? p.descriptionAr : p.description;
      var a = document.createElement("a");
      a.className = "card";
      a.href = "product-detail.html#" + key;
      a.setAttribute("data-anim", "up");
      a.innerHTML =
        '<div class="ph">' + (p.brandtag ? '<span class="brandtag">' + p.brandtag + '</span>' : '') +
        '<img src="' + p.images[0] + '" alt="' + pTitle + '"></div>' +
        '<div class="bd"><h3>' + pTitle + '</h3><p>' + pDesc + '</p>' +
        '<span class="more">' + L.view + ' <span class="arw">' + (isAr?'←':'→') + '</span></span></div>';
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
    /* safety net, same as site.js: checked every animation frame rather than on
       scroll events, since a slow scroll that ends at max-scroll can leave no more
       scroll events to catch the last section with */
    var pendingRelatedReveals = relatedReveals.slice();
    function revealRelatedVisibleFrame(){
      pendingRelatedReveals = pendingRelatedReveals.filter(function(el){
        var r = el.getBoundingClientRect();
        if(r.top < window.innerHeight*0.92 && r.bottom > 0){ el.classList.add("in"); return false; }
        return true;
      });
      if(pendingRelatedReveals.length) requestAnimationFrame(revealRelatedVisibleFrame);
    }
    requestAnimationFrame(revealRelatedVisibleFrame);

  }

  function renderAndScroll(){ render(); window.scrollTo(0, 0); }

  renderAndScroll();
  window.addEventListener("hashchange", renderAndScroll);
  window.addEventListener("hl:langchange", render);
})();
