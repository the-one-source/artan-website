export function initMenu({ onOpen, onClose } = {}) {
    const menuButton = document.getElementById('menu-button');
    if (!menuButton) return;

    const topLine = menuButton.querySelector('.line-top');
    const bottomLine = menuButton.querySelector('.line-bottom');

    // Create overlay lazily
    const menuOverlay = document.createElement('div');
    menuOverlay.id = 'menu-overlay';
    menuOverlay.style.position = 'fixed';
    menuOverlay.style.top = '0';
    menuOverlay.style.left = '0';
    menuOverlay.style.width = '100vw';
    menuOverlay.style.height = '100vh';
    menuOverlay.style.backgroundColor = 'var(--bg-color)';
    menuOverlay.style.display = 'flex';
    menuOverlay.style.justifyContent = 'center';
    menuOverlay.style.alignItems = 'center';
    menuOverlay.style.opacity = '0';
    menuOverlay.style.visibility = 'hidden';
    menuOverlay.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
    menuOverlay.style.zIndex = '9999';
    document.body.appendChild(menuOverlay);

    function openMenu() {
        menuButton.classList.add('menu-open');
        menuOverlay.style.opacity = '1';
        menuOverlay.style.visibility = 'visible';
        topLine.style.transform = 'rotate(45deg) translate(4px, 4px)';
        bottomLine.style.transform = 'rotate(-45deg) translate(4px, -4px)';
        if (typeof onOpen === 'function') onOpen();
    }

    function closeMenu() {
        menuButton.classList.remove('menu-open');
        menuOverlay.style.opacity = '0';
        menuOverlay.style.visibility = 'hidden';
        topLine.style.transform = '';
        bottomLine.style.transform = '';
        topLine.style.backgroundColor = '';
        bottomLine.style.backgroundColor = '';
        if (typeof onClose === 'function') onClose();
    }

    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.classList.contains('menu-open');
        isOpen ? closeMenu() : openMenu();
    });

    menuButton.addEventListener('mouseenter', () => {
        if (!menuButton.classList.contains('menu-open')) {
            topLine.style.transform = 'scaleY(0.9)';
            bottomLine.style.transform = 'scaleY(0.9)';
            setTimeout(() => {
                topLine.style.transform = '';
                bottomLine.style.transform = '';
            }, 150);
        }
    });

    menuButton.addEventListener('mouseleave', () => {
        if (menuButton.classList.contains('menu-open')) {
            topLine.style.backgroundColor = '';
            bottomLine.style.backgroundColor = '';
        }
    });
}
