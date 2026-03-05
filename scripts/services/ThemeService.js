export class ThemeService {
    load() {
        return localStorage.getItem('theme') || 'light';
    }

    apply(themeName) {
        document.body.className = themeName === 'dark' ? 'dark-theme' : '';

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = themeName === 'dark' ? '☀️' : '🌙';
        }
    }

    toggle() {
        const current = this.load();
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        this.apply(next);
        return next;
    }
}
