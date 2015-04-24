'use strict';
/*global require*/
var $ = window.jQuery = require('jquery');
var Backbone = require('backbone');;
Backbone.$ = $;
var bootstrap = require('bootstrap');
var Application = require('../modules/application.js');
var Cart = require('../modules/cart');
var Search = require('../modules/search');
var Router = require('../modules/router');
var Products = require('../modules/products');
Application.set('cart', function() {
    return Cart.createCart('#cart', {});
});
Application.set('searchForm', function() {
    return Search('form#search', {});
});
Application.set('router', function() {
    return Router();
});
Application.get('com')
    .on('search:query', function(query) {
        var products = Products('#tmpl-main');
        products.process('/api/search/' + query);
        Application.get('router').navigate('/search?q=' + query, {
            trigger: false,
            replace: true
        });
    })
    .on('nav:product', function(id) {
        Application.get('router').navigate('/products/' + id, {
            trigger: true,
            replace: true
        });
    });

Backbone.history.start({
    pushState: true
});


$('div#addToCart').click(function(e) {
    (e || event).stopPropagation();
    var product = $(this).attr('data-product');
    Application.get('cart').addItem(JSON.parse(product));
});
$("li#rProduct").mouseenter(function(event) {
    $(this).find('.jstooltip').fadeIn(200);
});
$("li#rProduct").mouseleave(function(event) {
    $(this).find('.jstooltip').fadeOut(200);
});
