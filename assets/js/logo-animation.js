/**
 * Logo Intro Animation — PinkFloyd-style
 *
 * What it does:
 * 1) On first load: show ONLY the logo, centered, with a subtle pop + settle.
 * 2) Logo travels back to its real layout position.
 * 3) Reveal the stage content (announcement + enter + essence).
 * 4) On ENTER click: hide stage-only intro UI (announcement + enter), reveal header/footer.
 *
 * Notes:
 * - Self-contained (no dependency on main.js).
 * - Additive: only affects UI while body has intro classes.
 * - Safe on refresh: intro runs again on each load.
 */

(() => {
  const REVEAL_MS = 1400;
  const SETTLE_MS = 520;
  const HOLD_MS = 900;
  const TRAVEL_MS = 1200;

  const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
  const EASE_INOUT = "cubic-bezier(0.4, 0, 0.2, 1)";

  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  const prefersReducedMotion = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const once = (fn) => {
    let done = false;
    return (...args) => {
      if (done) return;
      done = true;
      fn(...args);
    };
  };

  const setA11yHidden = (el, hidden) => {
    if (!el) return;
    if (hidden) el.setAttribute("aria-hidden", "true");
    else el.removeAttribute("aria-hidden");
  };

  const setInline = (el, styles) => {
    if (!el) return;
    Object.keys(styles).forEach((k) => {
      el.style[k] = styles[k];
    });
  };

  const clearInline = (el, keys) => {
    if (!el) return;
    keys.forEach((k) => {
      el.style[k] = "";
    });
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const body = document.body;
    if (!body || body.hasAttribute("data-disable-logo-intro")) return;

    const logoEl = qs(".site-logo");
    if (!logoEl) return;

    const waitForLogoReady = async () => {
      // Ensure SVG/IMG has real dimensions before we measure.
      try {
        if (logoEl.tagName === "IMG") {
          if (!logoEl.complete) {
            await new Promise((resolve) =>
              logoEl.addEventListener("load", resolve, { once: true })
            );
          }
          if (typeof logoEl.decode === "function") {
            await logoEl.decode().catch(() => {});
          }
        }
      } catch (_) {
        // fail open
      }

      // One frame so layout settles.
      await new Promise((r) => requestAnimationFrame(r));
    };

    await waitForLogoReady();

    // Core stage elements
    const stage = qs("#stage") || qs(".stage-container");
    const stageCircle = qs(".stage-circle");
    const announcement = qs("#announcement");
    const enterButton = qs("#enter-button");
    const essence = qs(".site-essence");

    // Global chrome
    const headerControls = qs("#header-controls");
    const footerSeparator = qs(".footer-separator");
    const footer = qs(".site-footer");
    const menuOverlay = qs("#menu-overlay");

    // Persist original essence placement so we can restore on ENTER.
    const essenceOriginal = essence
      ? { parent: essence.parentElement, next: essence.nextElementSibling }
      : null;

    const mountEssenceIntoStage = () => {
      if (!essence || !stage) return;
      if (stage.contains(essence)) return;
      stage.appendChild(essence);
    };

    const restoreEssenceToOriginal = () => {
      if (!essence || !essenceOriginal?.parent) return;
      const { parent, next } = essenceOriginal;
      if (next && next.parentElement === parent) parent.insertBefore(essence, next);
      else parent.appendChild(essence);
    };

    // During intro: hide chrome and any overlays.
    const hideChrome = () => {
      setA11yHidden(headerControls, true);
      setA11yHidden(footerSeparator, true);
      setA11yHidden(footer, true);
      setA11yHidden(menuOverlay, true);

      setInline(headerControls, { opacity: "0", pointerEvents: "none" });
      setInline(footerSeparator, { opacity: "0", pointerEvents: "none" });
      setInline(footer, { opacity: "0", pointerEvents: "none" });
      setInline(menuOverlay, { opacity: "0", pointerEvents: "none" });
    };

    const showChrome = () => {
      setA11yHidden(headerControls, false);
      setA11yHidden(footerSeparator, false);
      setA11yHidden(footer, false);
      setA11yHidden(menuOverlay, false);

      // Let CSS own final look; we only gently fade-in.
      [headerControls, footerSeparator, footer].forEach((el) => {
        if (!el) return;
        el.style.transition = `opacity 600ms ${EASE_OUT}`;
        el.style.opacity = "1";
        el.style.pointerEvents = "";
      });

      if (menuOverlay) {
        menuOverlay.style.opacity = "";
        menuOverlay.style.pointerEvents = "";
      }
    };

    // During intro: hide stage content except logo.
    const hideStageContent = () => {
      // Keep stageCircle present (for layout), but visually quiet.
      if (stageCircle) {
        stageCircle.setAttribute("aria-hidden", "true");
        stageCircle.style.pointerEvents = "none";
      }

      [announcement, enterButton, essence].forEach((el) => {
        if (!el) return;
        setA11yHidden(el, true);
        setInline(el, {
          opacity: "0",
          transform: "translateY(10px)",
          pointerEvents: "none",
        });
      });

      // Ensure ENTER is not focusable while hidden.
      if (enterButton) {
        enterButton.tabIndex = -1;
      }
    };

    const revealStageContent = () => {
      // Keep essence inside stage until ENTER.
      mountEssenceIntoStage();

      [announcement, enterButton, essence].forEach((el) => {
        if (!el) return;
        setA11yHidden(el, false);
        el.style.transition = [
          `opacity 800ms ${EASE_OUT}`,
          `transform 900ms ${EASE_OUT}`,
        ].join(", ");
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        el.style.pointerEvents = "";
      });

      if (enterButton) {
        enterButton.removeAttribute("aria-hidden");
        enterButton.tabIndex = 0;
      }

      if (stageCircle) {
        stageCircle.removeAttribute("aria-hidden");
        stageCircle.style.pointerEvents = "";
      }
    };

    const cleanupIntroLogoInline = () => {
      clearInline(logoEl, [
        "position",
        "top",
        "left",
        "transform",
        "transformOrigin",
        "transition",
        "zIndex",
        "willChange",
        "opacity",
      ]);
    };

    let placeholder = null;

    const removePlaceholder = () => {
      if (placeholder?.parentNode) placeholder.parentNode.removeChild(placeholder);
      placeholder = null;
    };

    const finishIntro = once(() => {
      body.classList.remove("intro-loading");
      body.classList.add("intro-reveal");

      // Dock back into normal flow.
      cleanupIntroLogoInline();
      logoEl.classList.remove("intro-logo", "intro-pop", "intro-settle");
      logoEl.classList.add("intro-docked");

      removePlaceholder();

      // Reveal stage content (still no header/footer).
      revealStageContent();
    });

    const enterSite = once(() => {
      body.classList.remove("intro-loading");
      body.classList.remove("intro-reveal");
      body.classList.add("site-entered");

      // Hide intro-only elements.
      [announcement, enterButton].forEach((el) => {
        if (!el) return;
        el.style.transition = `opacity 450ms ${EASE_OUT}, transform 600ms ${EASE_OUT}`;
        el.style.opacity = "0";
        el.style.transform = "translateY(6px)";
        el.style.pointerEvents = "none";
        setA11yHidden(el, true);
      });

      // Restore essence to its original location (if that is your normal layout).
      restoreEssenceToOriginal();

      // Reveal chrome.
      showChrome();

      // Remove ENTER from tab order.
      if (enterButton) {
        enterButton.tabIndex = -1;
      }
    });

    if (enterButton) {
      enterButton.addEventListener("click", (e) => {
        e.preventDefault();
        enterSite();
      });
    }

    // Reduced motion: no travel; just reveal stage content.
    if (prefersReducedMotion()) {
      body.classList.add("intro-reveal");
      hideChrome();
      hideStageContent();
      revealStageContent();
      return;
    }

    // Start intro.
    body.classList.add("intro-loading");
    hideChrome();
    hideStageContent();

    // Placeholder keeps layout stable while logo is fixed.
    const rect = logoEl.getBoundingClientRect();
    placeholder = document.createElement("div");
    placeholder.style.width = `${rect.width}px`;
    placeholder.style.height = `${rect.height}px`;
    placeholder.style.pointerEvents = "none";
    placeholder.style.display = "inline-block";
    placeholder.style.verticalAlign = "middle";
    logoEl.parentNode?.insertBefore(placeholder, logoEl.nextSibling);

    const getTargetCenter = () => {
      const r = placeholder.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    // Intro look.
    logoEl.classList.add("intro-logo");

    // Pin logo to viewport center.
    setInline(logoEl, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transformOrigin: "center",
      transform: "translate(-50%, -50%) scale(0.52)",
      opacity: "0",
      zIndex: "300000",
      willChange: "transform, top, left, opacity",
    });

    requestAnimationFrame(() => {
      // Pop-in.
      logoEl.classList.add("intro-pop");
      logoEl.style.transition = [
        `opacity 600ms ease`,
        `transform ${REVEAL_MS}ms ${EASE_OUT}`,
      ].join(", ");
      logoEl.style.opacity = "1";
      logoEl.style.transform = "translate(-50%, -50%) scale(1.08)";

      // Settle.
      window.setTimeout(() => {
        logoEl.classList.add("intro-settle");
        logoEl.style.transition = `transform ${SETTLE_MS}ms ${EASE_INOUT}`;
        logoEl.style.transform = "translate(-50%, -50%) scale(1.0)";
      }, Math.max(0, REVEAL_MS - 260));

      // Travel back.
      window.setTimeout(() => {
        const target = getTargetCenter();

        logoEl.style.transition = [
          `top ${TRAVEL_MS}ms ${EASE_OUT}`,
          `left ${TRAVEL_MS}ms ${EASE_OUT}`,
          `transform ${TRAVEL_MS}ms ${EASE_OUT}`,
        ].join(", ");

        logoEl.style.top = `${target.y}px`;
        logoEl.style.left = `${target.x}px`;
        logoEl.style.transform = "translate(-50%, -50%) scale(1)";

        window.setTimeout(finishIntro, TRAVEL_MS + 50);
      }, REVEAL_MS + HOLD_MS);

      // Safety: never get stuck.
      window.setTimeout(
        finishIntro,
        REVEAL_MS + HOLD_MS + TRAVEL_MS + 1400
      );
    });

    // BFCache safety.
    window.addEventListener(
      "pageshow",
      () => {
        if (body.classList.contains("intro-loading")) finishIntro();
      },
      { once: true }
    );

    // Escape exits intro (still keeps intro content revealed, but no chrome).
    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") finishIntro();
      },
      { once: true }
    );

    // Optional: if user scrolls, do not break intro.
    window.addEventListener(
      "scroll",
      () => {
        // Keep it stable; no-op.
      },
      { passive: true }
    );

    // Ensure only one "enter" handler exists.
    qsa("#enter-button").forEach((btn) => {
      if (btn !== enterButton) btn.setAttribute("aria-hidden", "true");
    });
  });
})();