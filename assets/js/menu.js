(function () {
  const menuButton = document.getElementById('menu-button');
  const menuOverlay = document.getElementById('menu-overlay');
  if (!menuButton || !menuOverlay) return;

  const menuLinks = menuOverlay.querySelectorAll('.menu-link');

  function letterify(el) {
    if (el.dataset.letterified === 'true') return;
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      span.style.transition = 'transform 220ms ease, opacity 220ms ease';
      el.appendChild(span);
    });
    el.dataset.letterified = 'true';
  }

  function hoverIn(el) {
    el.querySelectorAll('span').forEach(s => {
      s.style.transform = 'translateX(-0.35em)';
      s.style.opacity = '0.95';
    });
  }

  function hoverOut(el) {
    el.querySelectorAll('span').forEach(s => {
      s.style.transform = 'translateX(0)';
      s.style.opacity = '1';
    });
  }

  const previewTitle = document.getElementById('menu-preview-title');
  const previewSub = document.getElementById('menu-preview-sub');

  let isOpen = false;
  let isAnimating = false;
  const CLOSE_DURATION = 420;

  function openMenu() {
    if (isAnimating) return;
    isAnimating = true;

    menuButton.classList.add('menu-open');
    menuOverlay.classList.add('active');
    document.body.classList.add('menu-active');

    isOpen = true;
    document.dispatchEvent(new CustomEvent('menuOpen'));

    requestAnimationFrame(() => {
      isAnimating = false;
    });
  }

  function closeMenu() {
    if (isAnimating) return;
    isAnimating = true;

    isOpen = false;
    menuOverlay.classList.add('closing');
    document.body.classList.remove('menu-active');

    document.dispatchEvent(new CustomEvent('menuClose'));

    setTimeout(() => {
      menuOverlay.classList.remove('active', 'closing');
      menuButton.classList.remove('menu-open');
      isAnimating = false;
    }, CLOSE_DURATION);
  }

  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  /* ===================
     Hover Preview Logic
     =================== */

  if ((previewTitle || previewSub) && menuLinks.length) {
    menuLinks.forEach((link) => {
      letterify(link);

      const titleKey =
        link.dataset.previewTitleI18n ||
        link.getAttribute('data-preview-title-i18n');

      const subKey =
        link.dataset.previewSubI18n ||
        link.getAttribute('data-preview-sub-i18n');

      const rawTitle =
        link.dataset.previewTitle ||
        link.getAttribute('data-preview-title') ||
        link.dataset.text ||
        link.textContent.trim();

      const rawSub =
        link.dataset.previewSub ||
        link.getAttribute('data-preview-sub') ||
        '';

      link.addEventListener('mouseenter', () => hoverIn(link));
      link.addEventListener('mouseleave', () => hoverOut(link));

      link.addEventListener('mouseenter', () => {
        const t = window.ARTAN_TRANSLATION;

        const title = titleKey && t && typeof t.t === 'function'
          ? (t.t(titleKey) || rawTitle)
          : rawTitle;

        const sub = subKey && t && typeof t.t === 'function'
          ? (t.t(subKey) || rawSub)
          : rawSub;

        if (previewTitle) previewTitle.textContent = title;
        if (previewSub) previewSub.textContent = sub;
        menuOverlay.classList.add('has-preview');
        menuOverlay.style.setProperty(
          '--menu-accent',
          link.dataset.accent || 'rgba(255,255,255,0.06)'
        );
      });

      link.addEventListener('mouseleave', () => {
        menuOverlay.classList.remove('has-preview');
      });
    });
  }
})();
