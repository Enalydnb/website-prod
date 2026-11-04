// js/site.js · shared navigation behaviour + scroll reveal for all public pages
(function () {
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.site-nav');
    var toggle = document.querySelector('.nav-toggle');
    var sheet = document.querySelector('.nav-sheet');

    // Nav background intensifies after scrolling
    function onScroll() {
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu
    function setMenu(open) {
      if (!nav || !sheet || !toggle) return;
      nav.classList.toggle('is-open', open);
      sheet.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (toggle) {
      toggle.addEventListener('click', function () {
        setMenu(!nav.classList.contains('is-open'));
      });
    }
    if (sheet) {
      sheet.addEventListener('click', function (e) {
        if (e.target.closest('a')) setMenu(false);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (!nav || !nav.classList.contains('is-open')) return;
      if (!e.target.closest('.site-nav') && !e.target.closest('.nav-sheet')) setMenu(false);
    });

    // Cookie settings buttons
    document.querySelectorAll('[data-cookie-settings]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.reopenCookieBanner) window.reopenCookieBanner();
      });
    });

    // Reveal on scroll
    var revealEls = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { io.observe(el); });
  });
})();
