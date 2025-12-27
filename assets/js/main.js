document.addEventListener("DOMContentLoaded", () => {
    /* =================== Theme Management =================== */

    const body = document.body;
    const toggle = document.getElementById("theme-toggle");
    const footer = document.querySelector("footer");

    // Theme colors
    const darkBg = "#000000";
    const darkText = "#ffffff";
    const lightBg = "#ffffff";
    const lightText = "#000000";

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    let currentTheme = savedTheme || (prefersDark ? "dark" : "light");

    const applyTheme = (theme) => {
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
    };

    applyTheme(currentTheme);

    if (toggle) {
        toggle.addEventListener("click", () => {
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(newTheme);
        });
    }

    window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener("change", (e) => {
        const systemTheme = e.matches ? "dark" : "light";
        if (!savedTheme) applyTheme(systemTheme);
    });

    /* =================== Custom Cursor with Global Hover Effect =================== */

    const customCursor = document.querySelector('.custom-cursor');

    if (customCursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        const speed = 0.15; // lower = slower, smoother follow

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;

            customCursor.style.top = `${cursorY}px`;
            customCursor.style.left = `${cursorX}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            const interactive = target?.closest(
                'button, a, input, select, textarea, label, [role="button"], [onclick], .enter-button, .logo-container, .country-option, #country-overlay-close'
            );

            if (customCursor) {
                // On interactive elements, hide the cursor circle; else show it
                customCursor.style.opacity = interactive ? '0' : '1';
            }
        });
    }

    /* =================== Menu Overlay =================== */

    function initMenu({ onOpen, onClose } = {}) {
        const menuButton = document.getElementById('menu-button');
        const menuOverlay = document.getElementById('menu-overlay');
        const menuItems = menuOverlay?.querySelectorAll('.menu-list li') ?? [];

        if (!menuButton || !menuOverlay) return;

        let isOpen = false;
        let isAnimating = false;
        const CLOSE_ANIMATION_DURATION = 420; // ms — matches CSS exit rhythm

        function openMenu() {
            if (isAnimating) return;
            isAnimating = true;

            menuButton.classList.add('menu-open');
            menuOverlay.classList.add('active');
            menuOverlay.classList.remove('closing');

            menuItems.forEach((item) => {
                item.style.transitionDelay = '';
            });

            document.body.classList.add('menu-active');

            isOpen = true;
            if (typeof onOpen === 'function') onOpen();

            requestAnimationFrame(() => {
                isAnimating = false;
            });
        }

        function closeMenu() {
            if (isAnimating) return;
            isAnimating = true;

            isOpen = false;

            // Trigger graceful exit animation
            menuOverlay.classList.add('closing');

            const items = Array.from(menuItems).reverse();
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.06}s`;
            });

            document.body.classList.remove('menu-active');

            if (typeof onClose === 'function') onClose();

            // Allow exit animation to fully play before hiding overlay
            setTimeout(() => {
                menuOverlay.classList.remove('active');
                menuOverlay.classList.remove('closing');
                menuButton.classList.remove('menu-open');

                menuItems.forEach((item) => {
                    item.style.transitionDelay = '';
                });

                isAnimating = false;
            }, CLOSE_ANIMATION_DURATION);
        }

        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen ? closeMenu() : openMenu();
        });

        // Optional: close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });
    }

    /* expose safely to classic scripts */
    window.initMenu = initMenu;

    // Initialize menu with cursor-safe orchestration
    if (typeof window.initMenu === 'function') {
        window.initMenu({
            onOpen: () => {
                const customCursor = document.querySelector('.custom-cursor');
                if (customCursor) customCursor.style.opacity = '0';
            },
            onClose: () => {
                const customCursor = document.querySelector('.custom-cursor');
                if (customCursor) customCursor.style.opacity = '1';
            }
        });
    }

    document.addEventListener('countryOverlayOpen', () => {
        const header = document.getElementById('header-controls');
        if (header) header.style.display = 'none';
    });

    document.addEventListener('countryOverlayClose', () => {
        const header = document.getElementById('header-controls');
        if (header) header.style.display = '';
    });

    /* =================== Stream Overlay =================== */

    const streamOverlay = document.getElementById("stream-overlay");
    const closeStreamBtn = document.getElementById("close-stream");
    const streamButtons = document.querySelectorAll(".stream-btn");

    if (streamOverlay && closeStreamBtn && streamButtons.length > 0) {

        let isAnimating = false;

        function openStream() {
            if (isAnimating) return;
            isAnimating = true;

            streamOverlay.classList.add("visible");
            document.body.classList.add("overlay-active"); // mimic menu behavior
            document.body.style.overflow = "hidden";

            requestAnimationFrame(() => { isAnimating = false; });
        }

        function closeStream() {
            if (isAnimating) return;
            isAnimating = true;

            streamOverlay.classList.remove("visible");
            document.body.classList.remove("overlay-active");
            document.body.style.overflow = "";

            requestAnimationFrame(() => { isAnimating = false; });
        }

        streamButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                openStream();
            });
        });

        closeStreamBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeStream();
        });

        // Optional: close overlay with Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && streamOverlay.classList.contains("visible")) {
                closeStream();
            }
        });
    }
});
