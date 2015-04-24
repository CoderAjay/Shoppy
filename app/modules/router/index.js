var jQuery = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = jQuery;
var PageLoad = true;
var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        'search/:q': 'search',
        'products/:id': 'products'
    },
    home: function() {
        if (PageLoad) {
            PageLoad = false;
            return;
        }
        console.log(' home');
    },
    search: function(query) {
        if (PageLoad) {
            PageLoad = false;
            return;
        }
        console.log(query);
    },
    products: function(id) {
        if (PageLoad) {
            PageLoad = false;
            return;
        }
        console.log(id);
    }
});
module.exports = function(options) {
    return new Router(options);
};
