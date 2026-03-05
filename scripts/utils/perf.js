export const perf = {
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
