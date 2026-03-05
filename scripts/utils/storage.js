export const storage = {
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            const parsed = JSON.parse(item);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                delete parsed.__proto__;
                delete parsed.constructor;
                delete parsed.prototype;
            }
            return parsed;
        } catch {
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

export const session = {
    get: function(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            if (!item) return defaultValue;
            const parsed = JSON.parse(item);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                delete parsed.__proto__;
                delete parsed.constructor;
                delete parsed.prototype;
            }
            return parsed;
        } catch {
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