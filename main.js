/* Progressive enhancement only — the page is fully readable with JS disabled. */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });

    // Close after tapping a link on small screens.
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------
     Header shadow once the page scrolls away from the top
     --------------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
     Highlight the nav link for the section currently in view
     --------------------------------------------------------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__menu a'));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------------------------------------------------------------
     Reveal sections on scroll. The `js-reveal` class is what arms the
     hiding rule in CSS, so content stays visible if this never runs.
     --------------------------------------------------------------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('js-reveal');

    var targets = document.querySelectorAll('.section .wrap > *');
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });

    var revealAll = function () {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-visible'); });
    };

    var revealer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(targets, function (el) { revealer.observe(el); });

    // Safety nets — content must never stay hidden. If the observer is throttled,
    // the tab was backgrounded, or the page is being printed or captured, show
    // everything rather than risk a blank section.
    setTimeout(revealAll, 2500);
    window.addEventListener('beforeprint', revealAll);
  }
})();
