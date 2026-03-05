export class NavigationService {
    initActiveState() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav ul li a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                const hrefFilename = href.split('/').pop();
                const currentFilename = currentPath.split('/').pop();
                if (hrefFilename && hrefFilename === currentFilename) {
                    link.style.background = 'rgba(255, 255, 255, 0.3)';
                    link.style.borderRadius = 'var(--border-radius)';
                }
            }
        });
    }

    bindHashNavigation(handlers) {
        document.addEventListener('click', function(e) {
            const el = e.target.closest('a');
            if (el) {
                const href = el.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const handler = handlers[href];
                    if (typeof handler === 'function') {
                        handler();
                    }
                }
            }
        });
    }
}