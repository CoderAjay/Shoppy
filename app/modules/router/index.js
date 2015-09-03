var jQuery = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = jQuery;
var PageLoad = false;
var Products = require('../products');
var bootstrap = require('../bootstrap');
var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        'search': 'search',
        'products/:id': 'products'
    },
    home: function() {
        if (PageLoad) {
            PageLoad = false;
            bootstrap.initHome();
            return;
        }
        console.log('home');
        this.navigate('/search?q=black', {
            trigger: true,
            replace: false
        });
    },
    search: function(query) {
        if (PageLoad) {
            PageLoad = false;
            bootstrap.initSearch(query);
            return;
        }
        query = query.split('=')[1] || '';
        var product = Products.productsView('#body-main');
        product.process('/api/search/' + query);
    },
    products: function(id) {
        if (PageLoad) {
            PageLoad = false;
            bootstrap.initProduct(id);
            return;
        }
        var options = {};
        options.id = id;
        Products.pageView(options);
    }
});
module.exports = function(options) {
    return new Router(options);
};
