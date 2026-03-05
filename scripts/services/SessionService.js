export class SessionService {
    getSession() {
        try {
            const raw = localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || 'null';
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                delete parsed.__proto__;
                delete parsed.constructor;
                delete parsed.prototype;
            }
            return parsed;
        } catch {
            return null;
        }
    }

    clearSession() {
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
    }
}