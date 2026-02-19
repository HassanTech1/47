/**
 * 4Seven's Shopify Theme — theme.js
 * Handles: slideshow, sticky header, search overlay
 */

// ─── Slideshow ────────────────────────────────────────────
(function () {
  'use strict';

  function initSlideshows() {
    var slideshows = document.querySelectorAll('.hero-slideshow');

    slideshows.forEach(function (el) {
      var slides = Array.from(el.querySelectorAll('.slideshow__slide'));
      var dots   = Array.from(el.querySelectorAll('.slideshow__dot'));
      var prevBtn = el.querySelector('.slideshow__btn--prev');
      var nextBtn = el.querySelector('.slideshow__btn--next');

      if (slides.length < 2) return;

      var current  = 0;
      var autoplay = el.dataset.autoplay !== 'false';
      var delay    = (parseInt(el.dataset.delay, 10) || 6) * 1000;
      var timer    = null;

      function goTo(index) {
        slides[current].classList.remove('slideshow__slide--active');
        dots.length && dots[current].classList.remove('slideshow__dot--active');

        current = (index + slides.length) % slides.length;

        slides[current].classList.add('slideshow__slide--active');
        dots.length && dots[current].classList.add('slideshow__dot--active');
      }

      function startAutoplay() {
        if (!autoplay) return;
        timer = setInterval(function () { goTo(current + 1); }, delay);
      }

      function stopAutoplay() {
        clearInterval(timer);
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          stopAutoplay();
          goTo(current - 1);
          startAutoplay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          stopAutoplay();
          goTo(current + 1);
          startAutoplay();
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          stopAutoplay();
          goTo(i);
          startAutoplay();
        });
      });

      startAutoplay();
    });
  }

  // ─── Search overlay (simple) ──────────────────────────
  window.toggleSearch = function () {
    var overlay = document.getElementById('SearchOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'SearchOverlay';
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:200',
        'background:rgba(0,0,0,0.9)',
        'display:flex', 'align-items:center', 'justify-content:center',
      ].join(';');

      var form = document.createElement('form');
      form.action = '/search';
      form.method = 'get';
      form.style.cssText = 'display:flex;gap:0.5rem;width:90%;max-width:600px;';

      var input = document.createElement('input');
      input.type = 'search';
      input.name = 'q';
      input.placeholder = 'Search products…';
      input.style.cssText = [
        'flex:1', 'padding:1rem', 'font-size:1rem',
        'border:2px solid #fff', 'background:#000', 'color:#fff',
        'outline:none',
      ].join(';');

      var btn = document.createElement('button');
      btn.type = 'submit';
      btn.textContent = 'Search';
      btn.style.cssText = [
        'padding:1rem 2rem', 'background:#fff', 'color:#000',
        'border:none', 'cursor:pointer', 'font-weight:700',
      ].join(';');

      var close = document.createElement('button');
      close.type = 'button';
      close.textContent = '✕';
      close.style.cssText = [
        'position:absolute', 'top:1rem', 'right:1rem',
        'background:none', 'border:none', 'color:#fff',
        'font-size:1.5rem', 'cursor:pointer',
      ].join(';');
      close.addEventListener('click', function () {
        overlay.style.display = 'none';
      });

      overlay.style.position = 'fixed';
      form.appendChild(input);
      form.appendChild(btn);
      overlay.appendChild(close);
      overlay.appendChild(form);
      document.body.appendChild(overlay);
      input.focus();
    } else {
      overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
      if (overlay.style.display !== 'none') {
        overlay.querySelector('input') && overlay.querySelector('input').focus();
      }
    }
  };

  // ─── Cart drawer (basic add-to-cart fetch) ─────────────
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches('.product-form')) return;
    var cartType = document.documentElement.dataset.cartType;
    if (cartType !== 'drawer') return;

    e.preventDefault();
    var data = new FormData(form);

    fetch('/cart/add.js', { method: 'POST', body: data })
      .then(function (r) { return r.json(); })
      .then(function () {
        return fetch('/cart.js');
      })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        var badge = document.querySelector('.cart-count');
        if (badge) badge.textContent = cart.item_count;
        window.location.href = '/cart';
      })
      .catch(function (err) {
        console.error('Cart error:', err);
      });
  });

  // ─── Init ─────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlideshows);
  } else {
    initSlideshows();
  }
})();
