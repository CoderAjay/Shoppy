'use strict';
var Application = require('../modules/application.js');
window.Application = {};
window.Application.bootstrap = function(data) {
    Application.set('settings', function() {
        document.getElementById('initialize_application').remove();
        delete window.Application;
        var settings = JSON.parse(data) || {};
        settings.baseUrl = 'http://127.0.0.1:8000';
        return settings;
    });
};

var $ = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var bootstrap = require('bootstrap');

$(document).ready(function() {
    main();
});

function main(d) {
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
    Backbone.history.start();

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
