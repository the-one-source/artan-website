document.addEventListener("DOMContentLoaded", () => {
  /* =================== Theme Management =================== */

  const body = document.body;
  const toggle = document.getElementById("theme-toggle");
  const footer = document.querySelector("footer");

  const darkBg = "#000000";
  const darkText = "#ffffff";
  const lightBg = "#ffffff";
  const lightText = "#000000";

  const savedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  let currentTheme = savedTheme || (prefersDark ? "dark" : "light");

  function applyTheme(theme) {
    currentTheme = theme;

    if (theme === "dark") {
      body.style.backgroundColor = darkBg;
      body.style.color = darkText;
      if (toggle) toggle.style.backgroundColor = darkText;
      if (footer) footer.style.color = darkText;
    } else {
      body.style.backgroundColor = lightBg;
      body.style.color = lightText;
      if (toggle) toggle.style.backgroundColor = lightText;
      if (footer) footer.style.color = lightText;
    }

    localStorage.setItem("theme", theme);
  }

  applyTheme(currentTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  /* =================== Custom Cursor (RTL-safe + re-init on language/dir change) =================== */

  let cursorRAF = null;

  function ensureCursorNode() {
    let node = document.querySelector(".custom-cursor");
    if (!node) {
      node = document.createElement("div");
      node.className = "custom-cursor";
      document.body.appendChild(node);
    }
    return node;
  }

  function stopCursorLoop() {
    if (cursorRAF) cancelAnimationFrame(cursorRAF);
    cursorRAF = null;
  }

  function initCustomCursor() {
    stopCursorLoop();

    const customCursor = ensureCursorNode();
    if (!customCursor) return;

    customCursor.style.display = "";
    customCursor.style.opacity = "1";
    customCursor.style.transform = "translate(-50%, -50%) scale(1)";

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const speed = 0.15;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Hard-restore in case RTL/dir switches leave it invisible
      if (customCursor.style.display === "none") customCursor.style.display = "";
      if (customCursor.style.opacity === "0") customCursor.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMove, { passive: true });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      customCursor.style.left = cursorX + "px";
      customCursor.style.top = cursorY + "px";
      cursorRAF = requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Pointer-based interaction feedback (RTL-safe)
    document.addEventListener(
      "pointerover",
      (e) => {
        const target = e.target;
        const interactive =
          target &&
          target.closest(
            "button, a, input, select, textarea, [role='button'], .enter-button, .logo-container, .country-option, #country-overlay-close, #country-selector, #language-toggle, #language-dropdown"
          );

        if (interactive) {
          customCursor.style.transform = "translate(-50%, -50%) scale(0.4)";
          customCursor.style.opacity = "0.35";
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "pointerout",
      () => {
        customCursor.style.transform = "translate(-50%, -50%) scale(1)";
        customCursor.style.opacity = "1";
      },
      { passive: true }
    );
  }

  initCustomCursor();

  // Re-init cursor when language / direction changes (RTL flips)
  const reinitCursor = () => {
    // next paint: let other scripts finish updating DOM/dir
    requestAnimationFrame(() => initCustomCursor());
  };

  // Custom events (if your locale system dispatches any)
  window.addEventListener("languagechange", reinitCursor);
  window.addEventListener("artan:languageChanged", reinitCursor);
  window.addEventListener("artan:dirChanged", reinitCursor);

  // Mutation observer: catches dir/lang/class flips on html/body
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (
        m.type === "attributes" &&
        (m.attributeName === "dir" ||
          m.attributeName === "lang" ||
          m.attributeName === "class")
      ) {
        reinitCursor();
        break;
      }
    }
  });

  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["dir", "lang", "class"],
  });
  mo.observe(document.body, {
    attributes: true,
    attributeFilter: ["dir", "lang", "class"],
  });

  /* =================== Menu Overlay =================== */

  function initMenu() {
    const menuButton = document.getElementById("menu-button");
    const menuOverlay = document.getElementById("menu-overlay");

    if (!menuButton || !menuOverlay) return;

    let isOpen = false;
    let isAnimating = false;
    const CLOSE_DURATION = 420;

    function openMenu() {
      if (isAnimating) return;
      isAnimating = true;

      menuButton.classList.add("menu-open");
      menuOverlay.classList.add("active");
      document.body.classList.add("menu-active");

      isOpen = true;
      requestAnimationFrame(() => {
        isAnimating = false;
      });
    }

    function closeMenu() {
      if (isAnimating) return;
      isAnimating = true;

      isOpen = false;
      menuOverlay.classList.add("closing");
      document.body.classList.remove("menu-active");

      setTimeout(() => {
        menuOverlay.classList.remove("active", "closing");
        menuButton.classList.remove("menu-open");
        isAnimating = false;
      }, CLOSE_DURATION);
    }

    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen ? closeMenu() : openMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    });
  }

  window.initMenu = initMenu;
  initMenu();
});