'use strict';
/*global require*/
var $ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');
var Application = require('../modules/application.js')

var Com = require('../modules/com');
var Cart = require('../modules/cart');
var Search = require('../modules/search');

Application.set('cart', function() {
    return Cart.createCart('#cart', {});
});
Application.set('search', function() {
    return Search('form#search', {});
});
Application.set('com', function() {
    return Com;
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
