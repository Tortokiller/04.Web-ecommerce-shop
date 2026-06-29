/* 7 DRAGONS — main.js */
(function () {
  'use strict';

  /* ---- CART ---- */
  var cart = [];

  function fmt(n) { return '€' + n.toFixed(2).replace('.', ','); }
  function save() { try { localStorage.setItem('7d', JSON.stringify(cart)); } catch(_){} }
  function load() { try { var d=localStorage.getItem('7d'); if(d) cart=JSON.parse(d); } catch(_){} }

  function render() {
    var items = document.getElementById('cart-items');
    var footer = document.getElementById('cart-footer');
    var count = document.getElementById('cart-count');
    var total = document.getElementById('cart-total');
    if (!items) return;
    var qty = cart.reduce(function(s,i){return s+i.qty;},0);
    if (count) { count.textContent = qty; count.dataset.empty = qty===0 ? 'true':'false'; }
    if (!cart.length) {
      items.innerHTML = '<p class="cart-empty-msg">Tu carrito está vacío.</p>';
      if (footer) footer.hidden = true;
      return;
    }
    if (footer) footer.hidden = false;
    if (total) total.textContent = fmt(cart.reduce(function(s,i){return s+i.price*i.qty;},0));
    items.innerHTML = cart.map(function(item,idx){
      return '<div class="cart-item">'
        +'<span class="cart-item-icon">🃏</span>'
        +'<div class="cart-item-info">'
          +'<div class="cart-item-name">'+item.name+'</div>'
          +'<div class="cart-item-price">'+fmt(item.price)+' × '+item.qty+'</div>'
        +'</div>'
        +'<button class="cart-item-remove" data-i="'+idx+'" aria-label="Eliminar">✕</button>'
        +'</div>';
    }).join('');
    items.querySelectorAll('.cart-item-remove').forEach(function(b){
      b.addEventListener('click', function(){
        cart.splice(Number(b.dataset.i),1); save(); render();
      });
    });
  }

  function addToCart(id, name, price) {
    var ex = cart.find(function(i){return i.id===id;});
    if (ex) ex.qty++; else cart.push({id:id,name:name,price:parseFloat(price),qty:1});
    save(); render(); openCart();
  }

  /* ---- DRAWER ---- */
  function openCart() {
    document.getElementById('cart-drawer')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    document.getElementById('cart-drawer')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---- SLIDESHOW ---- */
  var si = 0, timer;
  function goSlide(n) {
    var slides = document.querySelectorAll('.slideshow-slide');
    var dots   = document.querySelectorAll('.slide-dot');
    if (!slides.length) return;
    slides[si].classList.remove('active'); dots[si].classList.remove('active');
    si = (n + slides.length) % slides.length;
    slides[si].classList.add('active'); dots[si].classList.add('active');
  }
  function autoplay() {
    clearInterval(timer);
    timer = setInterval(function(){ goSlide(si+1); }, 4500);
  }

  /* ---- TABS ---- */
  function initTabs() {
    var tabs  = document.querySelectorAll('.collection-tab');
    var cards = document.querySelectorAll('.product-card[data-col]');
    var title = document.getElementById('section-title') || document.querySelector('.section-title');
    var link  = document.getElementById('section-link');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.forEach(function(t){ t.classList.remove('active'); });
        tab.classList.add('active');
        var col = tab.dataset.col;
        if (title) title.textContent = tab.dataset.label || col;
        if (link && tab.dataset.href) link.href = tab.dataset.href;
        cards.forEach(function(c){
          c.style.display = c.dataset.col === col ? 'flex' : 'none';
        });
      });
    });
  }

  /* ---- MOBILE MENU ---- */
  function initMobile() {
    var btn     = document.getElementById('mobile-nav-btn');
    var drawer  = document.getElementById('mobile-drawer');
    var overlay = document.getElementById('drawer-overlay');
    var close   = document.getElementById('mobile-close-btn');
    function open() {
      drawer?.classList.add('open');
      overlay?.classList.add('open');
      btn?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function shut() {
      drawer?.classList.remove('open');
      overlay?.classList.remove('open');
      btn?.classList.remove('open');
      document.body.style.overflow = '';
    }
    btn?.addEventListener('click', open);
    close?.addEventListener('click', shut);
    overlay?.addEventListener('click', shut);
  }

  /* ---- SEARCH ---- */
  function initSearch() {
    var panel  = document.getElementById('search-panel');
    var toggle = document.getElementById('search-toggle');
    var close  = document.getElementById('search-close');
    var field  = document.getElementById('search-field');
    toggle?.addEventListener('click', function(){
      panel?.classList.toggle('open');
      if (panel?.classList.contains('open')) field?.focus();
    });
    close?.addEventListener('click', function(){ panel?.classList.remove('open'); });
    field?.addEventListener('keydown', function(e){ if(e.key==='Enter') doSearch(); });
  }

  window.doSearch = function() {
    var q = document.getElementById('search-field')?.value.trim();
    if (q) window.location.href = '/search?q=' + encodeURIComponent(q);
  };

  /* ---- NEWSLETTER ---- */
  function initNewsletter() {
    document.getElementById('newsletter-form')?.addEventListener('submit', function(e){
      e.preventDefault();
      var em = document.getElementById('newsletter-email')?.value;
      alert('¡Gracias! ' + em + ' ya está en nuestra lista 🐉');
      e.target.reset();
    });
  }

  /* ---- STICKY HIDE ON SCROLL DOWN ---- */
  function initSticky() {
    var header = document.getElementById('site-header');
    var last = 0;
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if (y > 80 && y > last) header?.classList.add('hide');
      else header?.classList.remove('hide');
      last = y;
    }, { passive: true });
  }

  /* ---- INIT ---- */
  function init() {
    load(); render();

    document.getElementById('cart-toggle')?.addEventListener('click', openCart);
    document.getElementById('cart-close')?.addEventListener('click', closeCart);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

    document.querySelectorAll('.add-to-cart').forEach(function(b){
      b.addEventListener('click', function(){ addToCart(b.dataset.id, b.dataset.name, b.dataset.price); });
    });

    document.getElementById('slide-next')?.addEventListener('click', function(){ goSlide(si+1); autoplay(); });
    document.getElementById('slide-prev')?.addEventListener('click', function(){ goSlide(si-1); autoplay(); });
    document.querySelectorAll('.slide-dot').forEach(function(d){
      d.addEventListener('click', function(){ goSlide(Number(d.dataset.i)); autoplay(); });
    });
    autoplay();

    initTabs();
    initMobile();
    initSearch();
    initNewsletter();
    initSticky();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
