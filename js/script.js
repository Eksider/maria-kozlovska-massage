(function () {
  var heroWrapper = document.getElementById('heroWrapper');
  var hands = document.getElementById('heroHands');
  var heroContent = document.getElementById('heroContent');
  var scrollHint = document.getElementById('scrollHint');
  var siteNav = document.getElementById('siteNav');

  var START_Y = 72; // vh, hands start below the viewport
  var END_Y = -18;  // vh, hands end above the viewport (near shoulders)

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateHero() {
    var wrapperHeight = heroWrapper.offsetHeight;
    var viewportHeight = window.innerHeight;
    var scrollable = wrapperHeight - viewportHeight;
    var scrolledInto = -heroWrapper.getBoundingClientRect().top;
    var progress = scrollable > 0 ? clamp(scrolledInto / scrollable, 0, 1) : 0;

    var y = START_Y + (END_Y - START_Y) * progress;
    var scale = 1.05 - 0.18 * progress;
    var handsOpacity = progress > 0.82 ? clamp(1 - (progress - 0.82) / 0.18, 0, 1) : 1;

    hands.style.transform = 'translate(-50%, ' + y + 'vh) scale(' + scale + ')';
    hands.style.opacity = handsOpacity;

    var textOpacity = clamp(1 - progress * 2.4, 0, 1);
    heroContent.style.opacity = textOpacity;

    scrollHint.style.opacity = progress > 0.04 ? '0' : '1';

    siteNav.classList.toggle('visible', progress > 0.9);
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateHero();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateHero();

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var LANG_KEY = 'site-lang';
  var TITLES = {
    uk: "Марія Козловська — масажистка",
    en: "Maria Kozlovska — Massage Therapist",
    et: "Maria Kozlovska — massöör"
  };
  var DESCRIPTIONS = {
    uk: "Приватна масажна студія. Класичний, загальний та антицелюлітний масаж. Запис онлайн.",
    en: "Private massage studio. Classic, full-body and anti-cellulite massage. Book online.",
    et: "Privaatne massaažistuudio. Klassikaline, terve keha ja antitselluliidi massaaž. Broneeri veebis."
  };
  var langButtons = document.querySelectorAll('.lang-btn');

  function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.title = TITLES[lang] || TITLES.uk;

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', DESCRIPTIONS[lang] || DESCRIPTIONS.uk);

    document.querySelectorAll('[data-' + lang + '-html]').forEach(function (el) {
      var html = el.getAttribute('data-' + lang + '-html');
      if (html) el.innerHTML = html;
    });

    document.querySelectorAll('[data-' + lang + ']').forEach(function (el) {
      var text = el.getAttribute('data-' + lang);
      if (text) el.textContent = text;
    });

    langButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.langBtn === lang);
    });

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLanguage(btn.dataset.langBtn);
    });
  });

  var savedLang = 'uk';
  try { savedLang = localStorage.getItem(LANG_KEY) || 'uk'; } catch (e) {}
  applyLanguage(savedLang);
})();
