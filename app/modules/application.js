// moduler way to register other modules
module.exports = (function() {
    window.module = {};
    return {
        module: module,
        get: function(key) {
            return module[key];
        },
        set: function(key, cb) {
            if (!module.hasOwnProperty(key)) {
                module[key] = cb();
            } else {
                console.log('Already register module->' + key + ' force it to register if required');
            }
            return module[key];
        },
        force: function(key, cb) {
            if (!module.hasOwnProperty(key)) {
                module[key] = cb();
                console.log('set module can be used here.');
            } else {
                module[key] = cb();
            }
            return module[key];
        }

    };
}());
