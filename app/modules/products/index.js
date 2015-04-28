'use strict';
/* global require, jQuery*/
var $ = window.jQuery = require('jquery');
var Backbone = window.Backbone = require('backbone');
Backbone.$ = jQuery;
var Application = require('../application');

var dust = window.dust = require('dustjs-linkedin');
var dust_helper = require('dustjs-helpers');
var ptemplates = require('../../templates/products');
var extratemplates = require('../../templates/extra');

var ComPort = Application.get('com');

var Product = Backbone.Model.extend({
    urlRoot: '/api/products/',
    url: function() {
        return this.urlRoot + this.id;
    }
});

var ProductView = Backbone.View.extend({
    template: 'product',
    el: '.product-tmpl',
    events: {
        'click  div#addToCart': 'addToCart'
    },
    process: function(id) {
        var self = this;
        this.model = new Product({
            id: id
        });
        this.spinner();
        this.model.fetch({
            success: function() {
             self.render();
            }
        });
    },
    spinner: function() {
        var self = this;
        dust.render('load', {
            height: '200px',
            width: '80%'
        }, function(err, out) {
            self.$el.html(out);
        });
    },
    render: function() {
        var self = this;
        dust.render(this.template, {
            product: this.model.toJSON()
        }, function(err, out) {
            self.$el.html(out);
        });
    },
    addToCart: function(e) {
        (e || event).preventDefault();

        Application.get('cart').addItem(this.model.toJSON());


    }
});

var ProductCollection = Backbone.Collection.extend({
    setUrl: function(uri) {
        this.url = uri;
        return this;
    }
});

var ProductCollectionView = Backbone.View.extend({
    template: 'products',
    events: {
        'click a.product': 'productClick',
        'click div#addToCart': 'addToCart',
        'mouseenter li#rProduct': 'showToolTip',
        'mouseleave li#rProduct': 'hideToolTip'
    },
    process: function(uri, subtitle) {
        var self = this;
        this.subtitle = subtitle || 'Products';
        this.spinner();
        this.collection = new ProductCollection().setUrl(uri);
        this.collection.fetch({
            success: function() {
                self.render();
            }
        });
    },
    spinner: function() {
        var self = this;
        dust.render('load', {
            height: '200px',
            width: '80%'
        }, function(err, out) {
            self.$el.html(out);
        });
    },
    render: function() {
        var self = this;
        dust.render(this.template, {
            products: this.collection.toJSON(),
            subtitle: this.subtitle
        }, function(err, out) {
            if (!err) {
                self.$el.html(out);
            }
        });
        return this;
    },
    productClick: function(e) {
        (e || event).preventDefault();
        var productid = $(e.currentTarget).attr('data-productid');
        var product = this.collection.filter(function(model) {
            return model.id == productid;
        })[0];
        if (product) {
            ComPort.trigger('nav:product', product.get('id'));
        }

    },
    addToCart: function(e) {
        (e || event).preventDefault();
        (e || event).stopPropagation();
        var productid = $(e.currentTarget).siblings('a.product').attr('data-productid');
        var product = this.collection.filter(function(model) {
            return model.id == productid;
        })[0];
        if (product) {
            Application.get('cart').addItem(product.toJSON());

        }
    },
    showToolTip: function(e) {
        (e || event).preventDefault();
        $(e.currentTarget).find('.jstooltip').fadeIn(200);
    },
    hideToolTip: function(e) {
        (e || event).preventDefault();
        $(e.currentTarget).find('.jstooltip').fadeOut(200);
    }
});

var PageView = Backbone.View.extend({
    el: '#body-main',
    template: 'product_container',
    initialize: function(options) {
        this.productId = options.id;
        this.productOptions = options;
        this.render();
    },
    render: function() {
        var self = this;
        dust.render(this.template, {}, function(err, out) {
            self.$el.html(out);
            self.renderBlocks();
        });
    },
    renderBlocks: function() {
        var productBlock, productsBlock;
        productBlock = new ProductView();
        productBlock.process(this.productId);
        productsBlock = new ProductCollectionView({
            el: '.related-product-tmpl'
        });
        productsBlock.process('/api/products/related/' + this.productId, 'Related Products');
    }

});

module.exports = {
    pageView: function(options) {
        return new PageView(options);
    },
    productView: function(el, model) {
        return new ProductView({
            el: $(el),
            model: new Product(model)
        });
    },
    productsView: function(el, models) {
        return new ProductCollectionView({
            el: $(el),
            collection: new ProductCollection(models)
        });
    }
};
