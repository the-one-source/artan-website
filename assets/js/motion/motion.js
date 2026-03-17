/* =============================================================================
   MOTION SYSTEM — LUXURY RECALIBRATION (GLOBAL / STAGGER / CONTROLLED PACE)
   - Sovereign module
   - Bidirectional reveal
   - Global stagger support
   - Slower, premium pacing
   - Section dwell calibration
============================================================================= */

(() => {
  const SELECTOR = '[data-motion]';

  const initMotion = () => {
    const nodes = document.querySelectorAll(SELECTOR);
    if (!nodes.length) return;

    // Base state
    nodes.forEach((el, index) => {
      el.classList.add('motion-init');

      // Global stagger (automatic unless disabled)
      if (!el.hasAttribute('data-motion-delay')) {
        el.style.transitionDelay = `${index * 0.08}s`;
      } else {
        el.style.transitionDelay = el.getAttribute('data-motion-delay');
      }
    });

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((el) => el.classList.add('motion-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;

          if (entry.isIntersecting && entry.intersectionRatio > 0.22) {
            el.classList.add('motion-visible');
          } else {
            el.classList.remove('motion-visible');
          }
        });
      },
      {
        threshold: [0, 0.22, 0.45, 0.65],
        rootMargin: '0px 0px -12% 0px' // slows reveal exit for dwell feel
      }
    );

    nodes.forEach((el) => observer.observe(el));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotion);
  } else {
    initMotion();
  }
})();
