/* ── Moda ECCI · translate.js ─────────────────────────────
   Botón flotante para traducir toda la página EN <-> ES
   usando Google Translate Element (widget oficial gratuito).
   ----------------------------------------------------------- */

(function () {
  // Contenedor oculto requerido por el widget de Google
  const gtDiv = document.createElement('div');
  gtDiv.id = 'google_translate_element';
  gtDiv.style.display = 'none';
  document.body.appendChild(gtDiv);

  // Botón flotante
  const btn = document.createElement('button');
  btn.id = 'translateToggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Traducir página / Translate page');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:18px;height:18px">
      <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>
    </svg>
    <span id="translateLabel">EN</span>
  `;
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '1.6rem',
    right: '1.6rem',
    zIndex: '9998',
    background: 'rgba(22,22,22,.96)',
    border: '1px solid rgba(201,168,76,.45)',
    color: '#e3c87a',
    fontFamily: "'Inter',sans-serif",
    fontSize: '.72rem',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    padding: '.7rem 1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '.5rem',
    cursor: 'pointer',
    transition: 'border-color .2s, color .2s'
  });
  btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#c9a84c'; btn.style.color = '#c9a84c'; });
  btn.addEventListener('mouseleave', () => { btn.style.borderColor = 'rgba(201,168,76,.45)'; btn.style.color = '#e3c87a'; });
  document.body.appendChild(btn);

  // Carga del script de Google Translate (lazy, solo cuando se necesite)
  let loaded = false;
  let translated = false;

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      { pageLanguage: 'es', includedLanguages: 'en,es', autoDisplay: false },
      'google_translate_element'
    );
  };

  function loadGoogleTranslate() {
    return new Promise((resolve) => {
      if (loaded) return resolve();
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.onload = () => { loaded = true; resolve(); };
      document.body.appendChild(script);
    });
  }

  // Helper para fijar la cookie que controla el idioma del widget
  function setGoogTransCookie(lang) {
    const value = lang === 'es' ? '/es/es' : `/es/${lang}`;
    document.cookie = `googtrans=${value}; path=/`;
    document.cookie = `googtrans=${value}; path=/; domain=.${location.hostname}`;
  }

  btn.addEventListener('click', async () => {
    const label = document.getElementById('translateLabel');

    if (!translated) {
      // Traducir ES -> EN
      btn.style.opacity = '.6';
      await loadGoogleTranslate();
      setGoogTransCookie('en');
      translated = true;
      label.textContent = 'ES';
      // Pequeño delay para que el widget procese la cookie
      setTimeout(() => location.reload(), 150);
    } else {
      // Volver a ES (idioma original)
      setGoogTransCookie('es');
      translated = false;
      label.textContent = 'EN';
      setTimeout(() => location.reload(), 150);
    }
  });

  // Al cargar, si la cookie indica inglés, ajustar el label del botón
  document.addEventListener('DOMContentLoaded', () => {
    if (document.cookie.includes('googtrans=/es/en')) {
      translated = true;
      const label = document.getElementById('translateLabel');
      if (label) label.textContent = 'ES';
    }
  });
})();
