

/* =============================================================================
   COLLECTIONS MODULE — SOVEREIGN / REUSABLE / BIDIRECTIONAL REVEAL
   - No dependency on home.js (only loaded by it)
   - Handles featured section reveal + stagger
   - Safe for reuse on any page
============================================================================= */

(() => {
  const initCollections = () => {
    const headers = document.querySelectorAll('.featured-header');
    const cards = document.querySelectorAll('.featured-card');

    if (!headers.length && !cards.length) return;

    /* -------------------------------------------------------------------------
       01) ATTACH REVEAL CLASS + STAGGER
    ------------------------------------------------------------------------- */

    headers.forEach((h) => {
      h.classList.add('reveal-on-scroll');
      h.style.setProperty('--reveal-delay', '0ms');
    });

    cards.forEach((card, i) => {
      card.classList.add('reveal-on-scroll');
      card.style.setProperty('--reveal-delay', `${Math.min(i * 120, 720)}ms`);
    });

    const nodes = document.querySelectorAll('.reveal-on-scroll');
    if (!nodes.length) return;

    /* -------------------------------------------------------------------------
       02) INTERSECTION OBSERVER (BIDIRECTIONAL)
    ------------------------------------------------------------------------- */

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.18) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: [0, 0.18, 0.35] }
    );

    nodes.forEach((n) => observer.observe(n));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollections);
  } else {
    initCollections();
  }
})();