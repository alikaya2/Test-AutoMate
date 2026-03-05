let currentUser = null;
let notifications = [];
let theme = 'light';

class SessionService {
    getSession() {
        try {
            return JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || 'null');
        } catch {
            return null;
        }
    }

    clearSession() {
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
    }
}

class ThemeService {
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

class ModalService {
    create(title, content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

        const modalContent = document.createElement('div');
        modalContent.className = 'card';
        modalContent.style.cssText = `
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;

        modalContent.innerHTML = `
        <div class="card-header">
            <h3 class="card-title"></h3>
            <button data-modal-close style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>
        ${content}
    `;
        modalContent.querySelector('.card-title').textContent = title;

        modal.className = 'modal';
        modal.appendChild(modalContent);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

        const closeBtn = modal.querySelector('[data-modal-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.remove());
        }

        return modal;
    }

    closeAll() {
        document.querySelectorAll('.modal').forEach(modal => modal.remove());
    }
}

class NotificationService {
    push(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2000;
        min-width: 250px;
        animation: slideIn 0.3s ease-out;
    `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);

        notifications.push({
            message,
            type,
            timestamp: new Date()
        });
    }
}

class NavigationService {
    initActiveState() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav ul li a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && currentPath.includes(href)) {
                link.style.background = 'rgba(255, 255, 255, 0.3)';
                link.style.borderRadius = 'var(--border-radius)';
            }
        });
    }

    bindHashNavigation(handlers) {
        document.addEventListener('click', function(e) {
            const el = e.target;
            if (el && el.tagName === 'A') {
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

class App {
    constructor() {
        this.session = new SessionService();
        this.theme = new ThemeService();
        this.modal = new ModalService();
        this.notify = new NotificationService();
        this.nav = new NavigationService();
    }

    init() {
        this.loadSession();
        this.loadTheme();
        this.nav.initActiveState();
        this.addGlobalEventListeners();
        this.showWelcomeMessage();
    }

    loadSession() {
        const sessionData = this.session.getSession();
        if (sessionData) {
            currentUser = sessionData;
            this.updateUserInterface();
        }
    }

    loadTheme() {
        theme = this.theme.load();
        this.theme.apply(theme);
    }

    toggleTheme() {
        theme = this.theme.toggle();
        this.notify.push(`Theme changed to ${theme} mode`, 'info');
    }

    updateUserInterface() {
        if (!currentUser) return;
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
        currentUser = null;
        this.notify.push('Logged out successfully!', 'success');

        setTimeout(() => {
            window.location.href = this.resolveHomeHref();
        }, 1500);
    }

    showUserProfile() {
        if (!currentUser) {
            this.notify.push('Please login to view your profile', 'error');
            return;
        }

        function esc(str) {
            const d = document.createElement('div');
            d.appendChild(document.createTextNode(String(str)));
            return d.innerHTML;
        }

        const modal = this.modal.create('User Profile', `
        <div style="padding: 1rem;">
            <h4 style="margin: 0 0 1rem 0;">Welcome, ${esc(currentUser.name)}!</h4>
            <p><strong>Username:</strong> ${esc(currentUser.username)}</p>
            <p><strong>Role:</strong> ${esc(currentUser.role)}</p>
            <p><strong>Login Time:</strong> ${esc(new Date(currentUser.loginTime).toLocaleString())}</p>
            <p><strong>Session:</strong> ${currentUser.remember ? 'Remembered' : 'Current session'}</p>
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

    showWelcomeMessage() {
        showWelcomeMessage();
    }
}

const app = new App();

document.addEventListener('DOMContentLoaded', function() {
    app.init();
});

function initializeApp() {
    app.init();
}

function checkUserSession() {
    app.loadSession();
}

function updateUserInterface() {
    app.updateUserInterface();
}

function loadTheme() {
    app.loadTheme();
}

function applyTheme(themeName) {
    app.theme.apply(themeName);
}

function toggleTheme() {
    app.toggleTheme();
}

function initializeNavigation() {
    app.nav.initActiveState();
}

function addGlobalEventListeners() {
    app.addGlobalEventListeners();
}

function handleNavigation(hash) {
    if (hash === '#profile') {
        app.showUserProfile();
        return;
    }
    if (hash === '#logout') {
        app.logout();
        return;
    }
    console.log('Unknown navigation:', hash);
}

function showUserProfile() {
    app.showUserProfile();
}

function logout() {
    app.logout();
}

function createModal(title, content) {
    return app.modal.create(title, content);
}

function closeAllModals() {
    app.modal.closeAll();
}

function showNotification(message, type = 'info', duration = 3000) {
    app.notify.push(message, type, duration);
}

function showWelcomeMessage() {
    // Disabled - no welcome message on first visit
    // const hasVisited = localStorage.getItem('hasVisited');
    // 
    // if (!hasVisited) {
    //     setTimeout(() => {
    //         showNotification('Welcome to Test Automation Website! Explore our testing tools and features.', 'info', 5000);
    //         localStorage.setItem('hasVisited', 'true');
    //     }, 1000);
    // }
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied to clipboard!', 'success');
    }
}

function downloadFile(data, filename, type = 'text/plain') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getUrlParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

function setUrlParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url);
}

function removeUrlParam(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url);
}

const storage = {
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },
    
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    },
    
    remove: function(key) {
        localStorage.removeItem(key);
    },
    
    clear: function() {
        localStorage.clear();
    }
};

const session = {
    get: function(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },
    
    set: function(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Failed to save to sessionStorage:', e);
            return false;
        }
    },
    
    remove: function(key) {
        sessionStorage.removeItem(key);
    },
    
    clear: function() {
        sessionStorage.clear();
    }
};

const perf = {
    start: function(label) {
        if (window.performance && window.performance.mark) {
            window.performance.mark(`${label}-start`);
        }
    },
    
    end: function(label) {
        if (window.performance && window.performance.mark && window.performance.measure) {
            window.performance.mark(`${label}-end`);
            window.performance.measure(label, `${label}-start`, `${label}-end`);
            const measures = window.performance.getEntriesByName(label);
            if (measures.length > 0) {
                console.log(`${label}: ${measures[0].duration}ms`);
                return measures[0].duration;
            }
        }
        return null;
    }
};

window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .dark-theme {
        --background-color: #1a1a1a;
        --card-background: #2d2d2d;
        --text-primary: #ffffff;
        --text-secondary: #b0b0b0;
        --border-color: #404040;
        --primary-color: #4a9eff;
    }
`;

document.head.appendChild(style);

window.TestAutomationWebsite = {
    showNotification,
    createModal,
    logout,
    toggleTheme,
    copyToClipboard,
    downloadFile,
    storage,
    session,
    performance: perf,
    formatDate,
    formatTime,
    formatFileSize,
    validateEmail,
    validatePasswordStrength,
    generateId,
    debounce,
    throttle,
    getUrlParams,
    setUrlParam,
    removeUrlParam
};

window.TestApp = window.TestAutomationWebsite;