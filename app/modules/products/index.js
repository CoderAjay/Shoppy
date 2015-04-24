var $ = jQuery = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = jQuery;
var Application = require('../application');

var dust = window.dust = require('dustjs-linkedin');
var dust_helper = require('dustjs-helpers');
var templates = require('../../templates/products');
var ComPort = Application.get('com');

var ProductCollection = Backbone.Collection.extend({
    initialize: function(uri) {
        this.url = uri;
    }
});


var ProductCollectionView = Backbone.View.extend({
    template: 'products.dust',
    events: {
        'click a.product': 'productClick'
    },
    initialize: function() {},
    process: function(uri) {
        var self = this;
        this.collection = new ProductCollection(uri);
        this.collection.fetch({
            success: function() {
                self.render();
            }
        })
    },
    render: function() {
        var self = this;
        dust.render(this.template, {
            products: this.collection.toJSON()
        }, function(err, out) {
            if (!err) {
                self.$el.html(out);
            }
        });
        return this;
    },
    productClick: function(e) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-productid');
        var found = this.collection.filter(function(item) {
            return item.id == productId;
        })[0];
        ComPort.trigger('nav:product', found.get('id'));
    }
});

module.exports = function(el) {
    return new ProductCollectionView({
        el: $(el)
    });
};
