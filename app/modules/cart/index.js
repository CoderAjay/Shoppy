/**
 *  [Cart]
 * @author CoderAjay <https://github.com/CoderAjay/>
 * @mail  ajay@srijan.in
 * @dated  April 17,2015
 * @version 3.0.6
 * @license MIT
 */

/* A sinle item of cart [backbone] [schema]*/
/* A collection of items of cart [bacbone] [schema]*/
/* Collection when updated sync with server */
/* configuration can be passed */
/* expose interface to interact with cart*/
/*jslint node: true */
'use strict';
/* global require,window*/
var jQuery = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = jQuery;
var dust = window.dust = require('dustjs-linkedin');
var dust_helper = require('dustjs-helpers');
var templates = require('../../templates/cart');

(function(Backbone, dust, $) {


    var Item = Backbone.Model.extend({
        defaults: {
            Quantity: 1
        },
        url: function() {
            return '/api/cart/' + this.id;
        }
    });

    var ItemView = Backbone.View.extend({
        tagName: 'div',
        className: 'item-wrap',
        template: 'item-template.dust',
        events: {
            'click #cross': 'removeItem'
        },
        removeItem: function() {
            (this.$el).remove();
            this.model.destroy();
        },
        initialize: function() {
            this.model.on('change', this.render, this);
        },
        //TODO - only update changed value not whole DOM
        render: function() {
            var self = this;
            dust.render(this.template, this.model.toJSON(), function(err, out) {
                self.$el.html(out);
            });
            return this;
        }
    });

    var ItemCollection = Backbone.Collection.extend({
        model: Item,
        url: '/api/cart',
        initialize: function() {
            var self = this;
            this.fetch({
                success: function() {
                    self.trigger('reset');
                }
            });
        }
    });

    var ItemCollectionView = Backbone.View.extend({
        tagName: 'div',
        className: 'item-collection',
        initialize: function() {
            this.collection = new ItemCollection();
            this.render();
            this.collection.on('reset', this.render, this);
        },
        render: function() {
            //this.$el.html("");
            this.collection.each(function(item) {
                this.renderItem(item);
            }, this);
        },
        renderItem: function(item) {
            var itemView = new ItemView({
                model: item
            });
            this.$el.find('.cart-hover').append(itemView.render().el);
        },
        addItem: function(data) {
            var found = this.collection.filter(function(obj) {
                return obj.id === data.id;
            })[0];
            if (found) {
                found.set('Quantity', found.get('Quantity') + 1);
                found.save();
            } else {
                found = new Item(data);
                found.save(null, {
                    type: 'POST'
                });
                this.collection.add(found);
                this.renderItem(found);
            }
        }
    });

    var CartView = Backbone.View.extend({
        tagName: 'div',
        className: 'cart',
        template: 'cart-template.dust',
        events: {
            'click': 'toggleVisible'
        },
        initialize: function() {
            this.itemCollectionView = new ItemCollectionView({
                el: this.$el
            });
            this.render();
            this.itemCollectionView.collection.on('add delete remove destory reset change', this.countRerender, this);
        },
        countRerender: function() {
            var count = 0;
            var total = 0;
            this.itemCollectionView.collection.each(function(obj) {
                count = count + obj.get('Quantity');
                obj.set('Total', obj.get('Quantity') * obj.get('price'));
                total = total + obj.get('Total');

            });
            this.$el.find('span#count').html(count);
        },
        render: function() {
            var self = this;
            dust.render(this.template, {}, function(err, out) {
                self.$el.html(out);
            });
            return this;
        },
        addItem: function(data) {
            this.itemCollectionView.addItem(data);
        },
        toggleVisible: function() {
            this.$el.find('.cart-hover').toggle('slow');
            this.$el.find('.cart-hover').click(function(e) {
                e.stopPropagation();
            });
        }
    });


    module.exports = {
        createCart: function(element, options) {
            return new CartView({
                el: $(element)
            });
        }
    };

}(Backbone, dust, jQuery));
