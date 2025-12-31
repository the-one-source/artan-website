export function initMenu({ onOpen, onClose } = {}) {
    const menuButton = document.getElementById('menu-button');
    const menuOverlay = document.getElementById('menu-overlay');
    if (!menuButton || !menuOverlay) return;

    const topLine = menuButton.querySelector('.line-top');
    const bottomLine = menuButton.querySelector('.line-bottom');

    const menuLinks = menuOverlay.querySelectorAll('.menu-link');
    const preview = menuOverlay.querySelector('.menu-preview-text');

    function openMenu() {
        menuButton.classList.add('menu-open');
        menuOverlay.classList.add('active');
        document.dispatchEvent(new CustomEvent('menuOpen'));
        if (typeof onOpen === 'function') onOpen();
    }

    function closeMenu() {
        menuButton.classList.remove('menu-open');
        menuOverlay.classList.remove('active');
        document.dispatchEvent(new CustomEvent('menuClose'));
        if (typeof onClose === 'function') onClose();
    }

    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.classList.contains('menu-open');
        isOpen ? closeMenu() : openMenu();
    });

    /* ===================
       Hover Preview Logic
       =================== */

    if (preview && menuLinks.length) {
        menuLinks.forEach(link => {
            const text =
                link.dataset.preview ||
                link.getAttribute('data-preview') ||
                link.textContent;

            link.addEventListener('mouseenter', () => {
                preview.textContent = text;
                menuOverlay.classList.add('has-preview');
                menuOverlay.style.setProperty(
                    '--menu-accent',
                    link.dataset.accent || 'rgba(255,255,255,0.06)'
                );
            });

            link.addEventListener('mouseleave', () => {
                preview.textContent = '';
                menuOverlay.classList.remove('has-preview');
            });
        });
    }
}
