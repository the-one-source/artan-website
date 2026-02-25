/* =============================================================================
   FOOTER MODULE — REVEAL CONTROLLER (SOVEREIGN)
   - Waits for fragment mount
   - Uses IntersectionObserver
   - Adds .footer-visible when footer enters viewport
   - Removes when scrolling back up (bidirectional)
============================================================================= */

(() => {
  const initFooterReveal = () => {
    const footer = document.querySelector('.site-footer');
    if (!footer) return false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            footer.classList.add('footer-visible');
          } else {
            footer.classList.remove('footer-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(footer);
    return true;
  };

  // Try immediately
  if (initFooterReveal()) return;

  // If footer fragment not yet mounted, observe DOM
  const mo = new MutationObserver(() => {
    if (initFooterReveal()) {
      mo.disconnect();
    }
  });

  mo.observe(document.body, { childList: true, subtree: true });
})();