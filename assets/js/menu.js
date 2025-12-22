export function initMenu({ onOpen, onClose } = {}) {
    const menuButton = document.getElementById('menu-button');
    if (!menuButton) return;

    const menuOverlay = document.getElementById('menu-overlay');
    if (!menuOverlay) return;

    const topLine = menuButton.querySelector('.line-top');
    const bottomLine = menuButton.querySelector('.line-bottom');

    function openMenu() {
        menuButton.classList.add('menu-open');
        menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');

        document.dispatchEvent(new CustomEvent('menuOpen'));

        if (typeof onOpen === 'function') onOpen();
    }

    function closeMenu() {
        menuButton.classList.remove('menu-open');
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');

        document.dispatchEvent(new CustomEvent('menuClose'));

        if (typeof onClose === 'function') onClose();
    }

    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.classList.contains('menu-open');
        isOpen ? closeMenu() : openMenu();
    });
}
