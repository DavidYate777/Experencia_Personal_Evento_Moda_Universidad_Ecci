/* ── Moda ECCI · main.js ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* Navbar scroll */
  const nb = document.querySelector('.navbar');
  window.addEventListener('scroll', () => nb?.classList.toggle('scrolled', window.scrollY > 55));

  /* Cerrar nav en mobile al hacer click */
  const nc = document.getElementById('navbarMain');
  if (nc) {
    document.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        const c = bootstrap.Collapse.getInstance(nc);
        if (c) c.hide();
      });
    });
  }

  /* Reveal on scroll */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('up'); ro.unobserve(e.target); } });
  }, { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* Contadores animados */
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = target / 55;
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.round(cur) + suffix;
        if (cur >= target) clearInterval(t);
      }, 22);
      co.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

  /* Welcome alert */
  const wa = document.getElementById('wAlert');
  if (wa) setTimeout(() => { wa.style.opacity = '1'; wa.style.transform = 'translateY(0)'; }, 700);

  /* Filtro glosario */
  const fi = document.getElementById('glossaryFilter');
  if (fi) {
    fi.addEventListener('input', () => {
      const q = fi.value.toLowerCase();
      document.querySelectorAll('#glossaryBody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  /* Pantone chips toast */
  document.querySelectorAll('.p-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const code = chip.querySelector('.p-chip-code')?.textContent;
      const name = chip.querySelector('.p-chip-name')?.textContent;
      if (code && name) showToast(`Pantone ${code} — ${name}`);
    });
  });

  /* Toast helper */
  function showToast(msg) {
    let t = document.getElementById('_toast');
    if (!t) {
      t = document.createElement('div');
      t.id = '_toast';
      Object.assign(t.style, {
        position:'fixed', bottom:'2rem', right:'2rem', zIndex:'9999',
        background:'rgba(22,22,22,.96)', border:'1px solid rgba(201,168,76,.4)',
        color:'#e3c87a', padding:'.85rem 1.5rem', fontSize:'.8rem',
        letterSpacing:'.1em', opacity:'0', transition:'opacity .3s',
        fontFamily:"'Inter',sans-serif"
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, 2600);
  }
});
