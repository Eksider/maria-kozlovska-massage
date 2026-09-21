(function () {
  var heroWrapper = document.getElementById('heroWrapper');
  var hands = document.getElementById('heroHands');
  var heroContent = document.getElementById('heroContent');
  var scrollHint = document.getElementById('scrollHint');
  var siteNav = document.getElementById('siteNav');

  var START_Y = 58;  // vh, hands start just below the viewport
  var END_Y = -12;   // vh, resting position on the upper back/shoulders

  var ARRIVE_END = 0.16; // 0-16% of scroll: hands quickly travel up onto the back
  var HOLD_END = 0.78;   // 16-78%: hands stay put, fully visible
  // 78-100%: hands fade out as the page hands off to the main content

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateHero() {
    var wrapperHeight = heroWrapper.offsetHeight;
    var viewportHeight = window.innerHeight;
    var scrollable = wrapperHeight - viewportHeight;
    var scrolledInto = -heroWrapper.getBoundingClientRect().top;
    var progress = scrollable > 0 ? clamp(scrolledInto / scrollable, 0, 1) : 0;

    var arriveT = clamp(progress / ARRIVE_END, 0, 1);
    var y = START_Y + (END_Y - START_Y) * arriveT;
    var scale = 1.05 - 0.18 * arriveT;
    var handsOpacity = progress > HOLD_END ? clamp(1 - (progress - HOLD_END) / (1 - HOLD_END), 0, 1) : 1;

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
    en: "Maria Kozlovska — Massage Therapist"
  };
  var DESCRIPTIONS = {
    uk: "Приватна масажна студія. Класичний, загальний та антицелюлітний масаж. Запис онлайн.",
    en: "Private massage studio. Classic, full-body and anti-cellulite massage. Book online."
  };
  var langButtons = document.querySelectorAll('.lang-btn');

  function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.title = TITLES[lang] || TITLES.uk;

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', DESCRIPTIONS[lang] || DESCRIPTIONS.uk);

    document.querySelectorAll('[data-uk-html], [data-en-html]').forEach(function (el) {
      var html = lang === 'en' ? el.getAttribute('data-en-html') : el.getAttribute('data-uk-html');
      if (html) el.innerHTML = html;
    });

    document.querySelectorAll('[data-uk], [data-en]').forEach(function (el) {
      var text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-uk');
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
