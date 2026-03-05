export class NotificationService {
    constructor(store) {
        this.store = store;
    }

    push(message, type = 'info', duration = 3000) {
        const ALLOWED_TYPES = ['info', 'success', 'error', 'warning'];
        const safeType = ALLOWED_TYPES.includes(type) ? type : 'info';

        const notification = document.createElement('div');
        notification.className = `alert alert-${safeType}`;
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

        if (this.store) {
            this.store.push({ message, type, timestamp: new Date() });
        }
    }
}