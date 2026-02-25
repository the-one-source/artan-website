/* =============================================================================
   01) HOME ESSENCE — PINNED LIGHT PASS (3-LINE)
   - Pins the essence lines in-frame.
   - Drives the internal light sweep via scroll runway.
   - Releases scroll after completion.
   - Header logo fades across steps (INTELLIGENCE → SYSTEMS) and stays hidden after.
============================================================================= */
(() => {
  window.__artanRunAfterEnter(() => {
  const section = document.querySelector('.home-essence');
  const wrap = document.querySelector('.home-ink-reveal');
  const lines = document.querySelectorAll('.home-ink-reveal .ink-line');
  if (!section || !wrap || lines.length < 3) return;

  let raf = false;
  let active = false;
  let snapped = false;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------------------------------------------------------------------------
     HOME HEADER (top-left logo container)
     - Fade the entire header to guarantee sync with Essence.
  --------------------------------------------------------------------------- */
  const getHomeHeader = () =>
    document.querySelector('#site-header')
    || document.querySelector('header')
    || document.querySelector('.site-header');

  const ensureHeaderFx = (el) => {
    if (!el || el.dataset.essenceHeaderFx === '1') return;
    el.dataset.essenceHeaderFx = '1';
    el.style.willChange = 'opacity';
    el.style.setProperty(
      'transition',
      'opacity 650ms cubic-bezier(0.22, 1, 0.36, 1)',
      'important'
    );
  };

  const logoShow = () => {
    const header = getHomeHeader();
    if (!header) return;
    ensureHeaderFx(header);
    header.style.setProperty('opacity', '1', 'important');
    header.style.setProperty('pointer-events', '', 'important');
  };

  const logoHide = () => {
    const header = getHomeHeader();
    if (!header) return;
    ensureHeaderFx(header);
    header.style.setProperty('opacity', '0', 'important');
    header.style.setProperty('pointer-events', 'none', 'important');
  };

  const logoAuto = (progress) => {
    const header = getHomeHeader();
    if (!header) return;
    ensureHeaderFx(header);

    // Fade window: start at INTELLIGENCE (0.55), fully gone by SYSTEMS (0.90)
    const t = clamp((progress - 0.55) / (0.90 - 0.55), 0, 1);
    const o = String(1 - t);

    if (!active) return;

    header.style.setProperty('opacity', o, 'important');
    header.style.setProperty('pointer-events', (t >= 0.98) ? 'none' : '', 'important');
  };

  // Create scroll runway (additive; no HTML edits)
  const ensureSpacer = () => {
    let spacer = document.querySelector('#essence-scroll-spacer');
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.id = 'essence-scroll-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      section.insertAdjacentElement('afterend', spacer);
    }
    return spacer;
  };

  const spacer = ensureSpacer();

  // Backdrop (fixed) — carries the blurred chroma during the Essence sequence
  const ensureBackdrop = () => {
    let bd = document.querySelector('#essence-pin-backdrop');
    if (!bd) {
      bd = document.createElement('div');
      bd.id = 'essence-pin-backdrop';
      bd.setAttribute('aria-hidden', 'true');
      bd.style.position = 'fixed';
      bd.style.inset = '0';
      bd.style.pointerEvents = 'none';
      bd.style.display = 'none';
      bd.style.zIndex = '1';
      bd.style.filter = 'saturate(1.06)';
      bd.style.opacity = '0';
      document.body.appendChild(bd);
    }
    return bd;
  };

  const backdrop = ensureBackdrop();

  const supportsColorMix = (() => {
    try {
      return (
        typeof CSS !== 'undefined' &&
        CSS.supports &&
        CSS.supports('color', 'color-mix(in srgb, #000 50%, #fff)')
      );
    } catch (_) {
      return false;
    }
  })();

  const isLightMode = () => document.body.classList.contains('light-mode');

  const buildChroma = (step, intensity) => {
    const a = Math.max(0, Math.min(1, intensity));
    const washTop = isLightMode()
      ? `rgba(255,255,255,${0.16 * a})`
      : `rgba(0,0,0,${0.28 * a})`;

    if (!supportsColorMix) {
      const s1 = `radial-gradient(1200px 680px at 24% 42%, rgba(145,124,111,${0.26 * a}) 0%, transparent 62%),
                  radial-gradient(900px 560px at 78% 62%, rgba(80,68,22,${0.22 * a}) 0%, transparent 60%),
                  linear-gradient(180deg, ${washTop} 0%, rgba(0,0,0,0) 74%)`;

      const s2 = `radial-gradient(1200px 680px at 22% 38%, rgba(0,128,128,${0.22 * a}) 0%, transparent 62%),
                  radial-gradient(900px 560px at 80% 66%, rgba(34,43,0,${0.22 * a}) 0%, transparent 60%),
                  linear-gradient(180deg, ${washTop} 0%, rgba(0,0,0,0) 74%)`;

      const s3 = `radial-gradient(1200px 680px at 26% 42%, rgba(255,204,0,${0.18 * a}) 0%, transparent 62%),
                  radial-gradient(900px 560px at 76% 62%, rgba(145,124,111,${0.18 * a}) 0%, transparent 60%),
                  linear-gradient(180deg, ${washTop} 0%, rgba(0,0,0,0) 74%)`;

      return step === 1 ? s1 : (step === 2 ? s2 : s3);
    }

    const pct = (n) => Math.round(n * a);

    const s1 = `radial-gradient(1200px 680px at 24% 42%, color-mix(in srgb, var(--color-primary1) ${pct(34)}%, transparent) 0%, transparent 62%),
                radial-gradient(900px 560px at 78% 62%, color-mix(in srgb, var(--color-primary2) ${pct(30)}%, transparent) 0%, transparent 60%),
                linear-gradient(180deg, ${washTop} 0%, rgba(0,0,0,0) 74%)`;

    const s2 = `radial-gradient(1200px 680px at 22% 38%, color-mix(in srgb, var(--color-primary5) ${pct(30)}%, transparent) 0%, transparent 62%),
                radial-gradient(900px 560px at 80% 66%, color-mix(in srgb, var(--color-primary4) ${pct(30)}%, transparent) 0%, transparent 60%),
                linear-gradient(180deg, ${washTop} 0%, rgba(0,0,0,0) 74%)`;

    const s3 = `radial-gradient(1200px 680px at 26% 42%, color-mix(in srgb, var(--color-primary10) ${pct(24)}%, transparent) 0%, transparent 62%),
                radial-gradient(900px 560px at 76% 62%, color-mix(in srgb, var(--color-primary1) ${pct(22)}%, transparent) 0%, transparent 60%),
                linear-gradient(180deg, ${washTop} 0%, rgba(0,0,0,0) 74%)`;

    return step === 1 ? s1 : (step === 2 ? s2 : s3);
  };

  const setEssenceBackdrop = (step, intensity) => {
    backdrop.style.transition =
      'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), background 1200ms cubic-bezier(0.22, 1, 0.36, 1)';
    backdrop.style.background = buildChroma(step, intensity);
    backdrop.style.opacity = String(Math.max(0, Math.min(1, intensity)));
  };

  const hideEssenceBackdrop = () => {
    backdrop.style.opacity = '0';
    backdrop.style.background = '';
    backdrop.style.display = 'none';
  };

  const restore = {
    wrapStyle: wrap.getAttribute('style') || '',
  };

  const setRunwayHeight = () => {
    const h = Math.round(window.innerHeight * 4.6);
    spacer.style.height = `${h}px`;
    spacer.style.width = '1px';
  };

  const setPinned = (on) => {
    if (on) {
      backdrop.style.display = 'block';
      setEssenceBackdrop(1, 0.78);

      wrap.style.position = 'fixed';
      wrap.style.left = '50%';
      wrap.style.top = '50%';
      wrap.style.transform = 'translate(-50%, -50%)';

      wrap.style.width = 'min(74ch, calc(100vw - (2 * var(--site-gutter))))';
      wrap.style.maxWidth = 'none';
      wrap.style.margin = '0';
      wrap.style.padding = '0';
      wrap.style.display = 'block';
      wrap.style.textAlign = 'center';
      wrap.style.zIndex = '3';
      wrap.style.visibility = 'visible';
      wrap.style.opacity = '1';

      document.body.classList.add('essence-pinned');
      active = true;
    } else {
      if (restore.wrapStyle) wrap.setAttribute('style', restore.wrapStyle);
      else wrap.removeAttribute('style');

      document.body.classList.remove('essence-pinned');
      active = false;
      hideEssenceBackdrop();

      // Leaving pinned state: restore logo unless we already completed (completion keeps it hidden).
      // If you want completion to always win, it will be enforced in `update()` when y>=end.
      const y = window.scrollY || window.pageYOffset || 0;
      const { start } = getRanges();
      if (y < start) logoShow();
    }
  };

  const getRanges = () => {
    const rect = section.getBoundingClientRect();
    const pageY = window.scrollY || window.pageYOffset || 0;
    const top = rect.top + pageY;

    const start = top + Math.round(window.innerHeight * 0.15);
    const length =
      spacer.getBoundingClientRect().height || Math.round(window.innerHeight * 4.6);
    const end = start + length;

    return { start, end, length, top };
  };

  const resetIfAbove = (y, top) => {
    if (y < top - 60) {
      setPinned(false);
      for (const el of lines) {
        el.style.setProperty('--ink', 0);
        el.style.setProperty('--sheen', 0);
        el.style.transform = '';
      }
      hideEssenceBackdrop();
      snapped = false;
      logoShow();
      return true;
    }
    return false;
  };

  const bump = (p, a, b) => {
    const t = clamp((p - a) / (b - a), 0, 1);
    return 1 + (0.08 * (1 - Math.abs(t - 0.5) * 2));
  };

  const isRTL = () => {
    const html = document.documentElement;
    return (
      html.classList.contains('lang-rtl') ||
      html.getAttribute('dir') === 'rtl' ||
      document.body.classList.contains('lang-rtl')
    );
  };

  const setSheen = (el, t) => {
    const tt = clamp(t, 0, 1);
    const dirT = isRTL() ? tt : (1 - tt);
    el.style.setProperty('--sheen', dirT);
  };

  // Tracking for step changes
  let lastStep = 0;
  let lastStepSetAt = 0;

  const update = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    const { start, end, length, top } = getRanges();

    if (resetIfAbove(y, top)) return;

    // After completion: release and remove highlight (and keep logo hidden).
    if (y >= end) {
      lastStep = 0;
      if (active) setPinned(false);
      hideEssenceBackdrop();
      document.body.classList.remove('essence-step-1', 'essence-step-2', 'essence-step-3');

      if (!snapped) {
        const target = document.querySelector('#home-sound-figure')
          || document.querySelector('#essence-scroll-spacer + section + section');

        if (target) {
          const r = target.getBoundingClientRect();
          const pageY = window.scrollY || window.pageYOffset || 0;
          const topTarget = Math.round(r.top + pageY);
          snapped = true;
          window.scrollTo({ top: topTarget, behavior: 'smooth' });
        }
      }

      lines[0].style.setProperty('--ink', 1);
      lines[1].style.setProperty('--ink', 1);
      lines[2].style.setProperty('--ink', 1);

      setSheen(lines[0], 0);
      setSheen(lines[1], 0);
      setSheen(lines[2], 0);

      lines[0].style.transform = 'scale(1)';
      lines[1].style.transform = 'scale(1)';
      lines[2].style.transform = 'scale(1)';

      logoHide();
      return;
    }

    // Before start: unpinned, show logo.
    if (y < start) {
      lastStep = 0;
      if (active) setPinned(false);

      lines[0].style.setProperty('--ink', 0);
      lines[1].style.setProperty('--ink', 0);
      lines[2].style.setProperty('--ink', 0);

      setSheen(lines[0], 0);
      setSheen(lines[1], 0);
      setSheen(lines[2], 0);

      lines[0].style.transform = '';
      lines[1].style.transform = '';
      lines[2].style.transform = '';
      snapped = false;
      document.body.classList.remove('essence-step-1', 'essence-step-2', 'essence-step-3');
      hideEssenceBackdrop();

      logoShow();
      return;
    }

    // Inside pinned narrative
    if (!active) setPinned(true);

    const progress = clamp((y - start) / length, 0, 1);

    // Sync header logo fade with Essence progression.
    logoAuto(progress);

    let step = 1;
    if (progress >= 0.55 && progress < 0.90) step = 2;
    if (progress >= 0.90) step = 3;

    const intensity = Math.min(0.96, 0.70 + (progress * 0.22));

    if (step !== lastStep) {
      lastStep = step;
      lastStepSetAt = performance.now();
      setEssenceBackdrop(step, intensity);

      backdrop.style.opacity = String(Math.max(0, Math.min(1, intensity * 0.85)));
      requestAnimationFrame(() => {
        backdrop.style.opacity = String(Math.max(0, Math.min(1, intensity)));
      });
    } else {
      backdrop.style.opacity = String(Math.max(0, Math.min(1, intensity)));
    }

    document.body.classList.remove('essence-step-1', 'essence-step-2', 'essence-step-3');
    document.body.classList.add(`essence-step-${step}`);

    const l1 = clamp(progress / 0.40, 0, 1);
    const l2 = clamp((progress - 0.55) / 0.25, 0, 1);
    const l3 = clamp((progress - 0.90) / 0.10, 0, 1);

    lines[0].style.setProperty('--ink', l1);
    setSheen(lines[0], l1);

    lines[1].style.setProperty('--ink', l2);
    setSheen(lines[1], l2);

    lines[2].style.setProperty('--ink', l3);
    setSheen(lines[2], l3);

    lines[0].style.transform = `scale(${bump(progress, 0.40, 0.55)})`;
    lines[1].style.transform = `scale(${bump(progress, 0.80, 0.90)})`;
    lines[2].style.transform = `scale(${bump(progress, 0.98, 1.00)})`;
  };

  const onScroll = () => {
    if (raf) return;
    raf = true;
    requestAnimationFrame(() => {
      raf = false;
      update();
    });
  };

  const boot = () => {
    setRunwayHeight();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener(
      'resize',
      () => {
        setRunwayHeight();
        update();
      },
      { passive: true }
    );
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  });
})();

/* =============================================================================
   02) HOME CLOSING — SCROLL REVEAL
   - SEO-safe: text remains in DOM.
   - Adds/removes `.is-visible` as the closing enters/leaves viewport.
============================================================================= */

(() => {
  window.__artanRunAfterEnter(() => {
  const boot = () => {
    const closing = document.querySelector('#home-closing.reveal-on-scroll');
    if (!closing) return;

    // Fallback: keep visible if IO unsupported
    if (!('IntersectionObserver' in window)) {
      closing.classList.add('is-visible');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
            closing.classList.add('is-visible');
          } else {
            closing.classList.remove('is-visible');
          }
        }
      },
      { threshold: [0, 0.15, 0.35] }
    );

    io.observe(closing);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  });
})();

/* =============================================================================
   03) COLLECTIONS MODULE — HOME LOADER (SOVEREIGN)
   - Loads collections.js only on homepage (CSS is linked statically)
   - Keeps home.js focused on hero/essence
============================================================================= */

(() => {
  window.__artanRunAfterEnter(() => {

    const loadJS = (src, id) => {
      if (id && document.getElementById(id)) return;
      if ([...document.scripts].some((s) => (s.src || '').includes(src))) return;
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      if (id) script.id = id;
      document.body.appendChild(script);
    };

    const hasCollections =
      document.querySelector('.featured-grid') ||
      document.querySelector('.featured-card') ||
      document.querySelector('[data-collections]');

    if (!hasCollections) return;

    loadJS('assets/js/collections.js', 'collections-js');
  });
})();