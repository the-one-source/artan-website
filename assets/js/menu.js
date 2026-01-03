(function () {
  const menuButton = document.getElementById('menu-button');
  const menuOverlay = document.getElementById('menu-overlay');
  if (!menuButton || !menuOverlay) return;

  const menuLinks = menuOverlay.querySelectorAll('.menu-link');
  const menuItems = menuOverlay.querySelectorAll('.menu-item');
  const animatedNodes = Array.from(
    menuOverlay.querySelectorAll('.menu-col-b-section-b .menu-item, .menu-col-b-section-b .menu-sep')
  );
  const menuList = menuOverlay.querySelector('.menu-col-b-section-b .menu-list');
  const menuClose = menuOverlay.querySelector('.menu-close');
  const menuPackToggle = document.getElementById('menu-pack-toggle');
  function setActiveItem(next) {
    menuItems.forEach((it) => it.classList.toggle('is-active', it === next));
  }

  function staggerIn() {
    animatedNodes.forEach((el, i) => {
      el.style.transitionDelay = `${i * STAGGER_IN_STEP}ms`;
      el.classList.add('menu-animate-in');
      el.classList.remove('menu-animate-out');
    });
  }

  function staggerOut() {
    animatedNodes.slice().reverse().forEach((el, i) => {
      el.style.transitionDelay = `${i * STAGGER_OUT_STEP}ms`;
      el.classList.add('menu-animate-out');
      el.classList.remove('menu-animate-in');
    });
  }

  function letterify(el) {
    if (el.dataset.letterified === 'true') return;

    const inner = el.querySelector('.menu-link-inner');
    if (!inner) return;

    const text = inner.textContent;
    inner.textContent = '';

    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      span.style.transition = 'transform 220ms ease, opacity 220ms ease';
      inner.appendChild(span);
    });

    el.dataset.letterified = 'true';
  }

  function hoverIn(el) {
    /* handled purely by CSS scale */
  }

  function hoverOut(el) {
    /* handled purely by CSS scale */
  }

  const previewTitle = document.getElementById('menu-preview-title');
  const previewSub = document.getElementById('menu-preview-sub');

  let isOpen = false;
  let isAnimating = false;
  const CLOSE_DURATION = 420;
  const STAGGER_IN_START_DELAY = 220;
  const STAGGER_IN_STEP = 95;
  const STAGGER_OUT_STEP = 70;

  function openMenu() {
    if (isAnimating) return;
    isAnimating = true;

    menuButton.classList.add('menu-open');
    menuOverlay.classList.add('active');
    menuOverlay.setAttribute('aria-hidden', 'false');
    animatedNodes.forEach(el => { el.style.transitionDelay = ''; });
    // Let the overlay settle in first, then bring the rail in
    setTimeout(staggerIn, STAGGER_IN_START_DELAY);
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
    menuOverlay.setAttribute('aria-hidden', 'true');
    staggerOut();
    document.body.classList.remove('menu-active');

    document.dispatchEvent(new CustomEvent('menuClose'));

    setTimeout(() => {
      menuOverlay.classList.remove('active', 'closing');
      menuOverlay.setAttribute('aria-hidden', 'true');
      menuButton.classList.remove('menu-open');
      animatedNodes.forEach(el => {
        el.style.transitionDelay = '';
        el.classList.remove('menu-animate-in', 'menu-animate-out');
      });
      isAnimating = false;
    }, CLOSE_DURATION);
  }

  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen ? closeMenu() : openMenu();
  });

  if (menuClose) {
    menuClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) closeMenu();
    });
  }

  // Prevent the pack toggle button from triggering overlay close
  if (menuPackToggle) {
    menuPackToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  // Backdrop click closes (only when clicking outside the columns)
  menuOverlay.addEventListener('click', (e) => {
    if (!isOpen) return;
    if (e.target.closest('#menu-pack-toggle')) return;
    if (e.target.closest('.menu-columns')) return;
    closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  /* ===================
     Hover Preview Logic
     =================== */

  if ((previewTitle || previewSub) && menuItems.length) {
    menuItems.forEach((item) => {
      const link = item.querySelector('.menu-link');
      if (!link) return;

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

      const onEnter = () => {
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
      };

      const onLeave = () => {
        menuOverlay.classList.remove('has-preview');
      };

      // item.addEventListener('mouseenter', onEnter);
      // item.addEventListener('mouseleave', onLeave);

      item.addEventListener('click', (e) => {
        // Allow normal link clicks to pass through
        if (e.target.closest('a')) return;
        const href = link.getAttribute('href');
        if (href) window.location.href = href;
      });

      // Expose handlers for the stabilizer
      item.__onEnter = onEnter;
      item.__onLeave = onLeave;
    });
  }

  // =======================
  // Hover Stabilizer (Rail)
  // =======================
  if (menuList && menuItems.length) {
    let active = null;
    let raf = 0;

    const pickNearest = (x) => {
      let best = null;
      let bestD = Infinity;
      menuItems.forEach((it) => {
        const r = it.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const d = Math.abs(cx - x);
        if (d < bestD) {
          bestD = d;
          best = it;
        }
      });
      return best;
    };

    const activate = (it) => {
      if (!it || it === active) return;

      if (active && active.__onLeave) active.__onLeave();
      active = it;
      setActiveItem(active);
      if (active.__onEnter) active.__onEnter();
    };

    const onMove = (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const item = el ? el.closest('.menu-item') : null;
        activate(item || pickNearest(e.clientX));
      });
    };

    const onLeaveRail = () => {
      if (active && active.__onLeave) active.__onLeave();
      active = null;
      setActiveItem(null);
    };

    menuList.addEventListener('pointermove', onMove);
    menuList.addEventListener('pointerleave', onLeaveRail);
  }
})();
