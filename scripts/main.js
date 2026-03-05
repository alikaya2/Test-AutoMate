import { App } from './app/App.js';
import { installBaseStyles } from './utils/dom.js';
import { perf } from './utils/perf.js';
import { formatDate, formatTime, formatFileSize } from './utils/format.js';
import { debounce, throttle } from './utils/fn.js';
import { validateEmail, validatePasswordStrength } from './utils/validation.js';
import {
    generateId,
    copyToClipboard as copyToClipboardImpl,
    downloadFile,
    getUrlParams,
    setUrlParam,
    removeUrlParam
} from './utils/misc.js';
import { storage, session } from './utils/storage.js';

installBaseStyles();

const app = new App();

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

function showNotification(message, type = 'info', duration = 3000) {
    app.notify.push(message, type, duration);
}

function createModal(title, content) {
    return app.modal.create(title, content);
}

function logout() {
    app.logout();
}

function toggleTheme() {
    return app.toggleTheme();
}

async function copyToClipboard(text) {
    return copyToClipboardImpl(text, showNotification);
}

window.TestApp = Object.freeze({
    showNotification,
    createModal,
    logout,
    toggleTheme,
    copyToClipboard,
    downloadFile,
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
});

window.TestAutomationWebsite = window.TestApp;