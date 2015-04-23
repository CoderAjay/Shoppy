// moduler way to register other modules
var Application = {};
module.exports = (function() {
    var Application = {};
    return {
        Application: Application,
        get: function(key) {
            return Application[key];
        },
        set: function(key, cb) {
            if (!Application.hasOwnProperty(key)) {
                Application[key] = cb();
            } else {
                console.log('Already register module->' + key + ' force it to register if required');
            }
            return Application[key];
        },
        force: function(key, cb) {
            if (!Application.hasOwnProperty(key)) {
                Application[key] = cb();
                console.log('set module can be used here.');
            } else {
                Application[key] = cb();
            }
            return Application[key];
        }

    };
}());
