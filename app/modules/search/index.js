var jQuery = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = jQuery;
var Application = require('../../modules/application.js');


var SearchForm = Backbone.View.extend({
    events: {
        'submit': 'submit'
    },
    submit: function(e) {
        e.preventDefault();
        console.log('ok');
    }
});

var SearchView = Backbone.View.extend({

});

module.exports = function(element, options) {
    return new SearchPage({
        el: element
    });
};
