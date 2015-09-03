'use strict';
var Application = require('../modules/application.js');
window.Application = {};
window.Application.bootstrap = function(data) {
    var settings = Application.set('settings', function() {
        document.getElementById('initialize_application').remove();
        delete window.Application;
        return JSON.parse(data) || {};
    });
    main(settings);
};

var $ = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var bootstrap = require('bootstrap');

function main(settings) {
    var Cart = require('../modules/cart');
    var Search = require('../modules/search');
    var router = require('../modules/router');

    /** no connection with server side rendering */
    Application.set('cart', function() {
        return Cart.createCart('#cart', {});
    });
    /** doesnt matter with server side rendering */
    Application.set('searchForm', function() {
        return Search.form('form#search', {});
    });

    Application.set('router', function() {
        return router();
    });
    Backbone.history.start({
        pushState: settings.site.pushState
    });

    Application.get('com')
        .on('search:query', function(query) {
            Application.get('router').navigate('/search?q=' + query, {
                trigger: true,
                replace: false
            });
        })
        .on('nav:product', function(id) {
            Application.get('router').navigate('/products/' + id, {
                trigger: true,
                replace: false
            });
        });


}
