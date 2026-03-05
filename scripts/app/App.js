import { SessionService } from '../services/SessionService.js';
import { ThemeService } from '../services/ThemeService.js';
import { ModalService } from '../services/ModalService.js';
import { NotificationService } from '../services/NotificationService.js';
import { NavigationService } from '../services/NavigationService.js';

export class App {
    constructor() {
        this.currentUser = null;
        this.notifications = [];
        this.themeName = 'light';

        this.session = new SessionService();
        this.theme = new ThemeService();
        this.modal = new ModalService();
        this.notify = new NotificationService(this.notifications);
        this.nav = new NavigationService();
    }

    init() {
        this.loadSession();
        this.loadTheme();
        this.nav.initActiveState();
        this.addGlobalEventListeners();
    }

    loadSession() {
        const sessionData = this.session.getSession();
        if (sessionData) {
            this.currentUser = sessionData;
            this.updateUserInterface();
        }
    }

    loadTheme() {
        this.themeName = this.theme.load();
        this.theme.apply(this.themeName);
    }

    toggleTheme() {
        this.themeName = this.theme.toggle();
        this.notify.push(`Theme changed to ${this.themeName} mode`, 'info');
        return this.themeName;
    }

    updateUserInterface() {
        if (!this.currentUser) return;

        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            if (link.textContent === 'Sign Up') {
                link.textContent = 'Profile';
                link.href = '#profile';
            }
            if (link.textContent === 'Login') {
                link.textContent = 'Logout';
                link.href = '#logout';
                link.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
            }
        });
    }

    resolveHomeHref() {
        const isInComponents = window.location.pathname.includes('/components/');
        return isInComponents ? '../index.html' : 'index.html';
    }

    logout() {
        this.session.clearSession();
        this.currentUser = null;
        this.notify.push('Logged out successfully!', 'success');

        setTimeout(() => {
            window.location.href = this.resolveHomeHref();
        }, 1500);
    }

    showUserProfile() {
        if (!this.currentUser) {
            this.notify.push('Please login to view your profile', 'error');
            return;
        }

        const esc = (str) => {
            const d = document.createElement('div');
            d.appendChild(document.createTextNode(String(str)));
            return d.innerHTML;
        };

        const modal = this.modal.create('User Profile', `
        <div style="padding: 1rem;">
            <h4 style="margin: 0 0 1rem 0;">Welcome, ${esc(this.currentUser.name)}!</h4>
            <p><strong>Username:</strong> ${esc(this.currentUser.username)}</p>
            <p><strong>Role:</strong> ${esc(this.currentUser.role)}</p>
            <p><strong>Login Time:</strong> ${esc(new Date(this.currentUser.loginTime).toLocaleString())}</p>
            <p><strong>Session:</strong> ${this.currentUser.remember ? 'Remembered' : 'Current session'}</p>
            <button onclick="window.TestApp.logout()" class="btn-error" style="margin-top: 1rem;">Logout</button>
        </div>
    `);

        document.body.appendChild(modal);
    }

    addGlobalEventListeners() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            if (e.key === 'Escape') {
                this.modal.closeAll();
            }
        });

        this.nav.bindHashNavigation({
            '#profile': () => this.showUserProfile(),
            '#logout': () => this.logout()
        });
    }
}