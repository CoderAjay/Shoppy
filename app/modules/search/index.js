var jQuery = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = jQuery;
var Application = require('../application');
var Com = require('../com');
var ComPort = Application.set('com', function() {
    return Com;
});

var SearchForm = Backbone.View.extend({
    events: {
        'submit': 'submit'
    },
    submit: function(e) {
        e.preventDefault();
        var query = this.$el.find('[name=q]').val();
        if (query) {
            ComPort.trigger('search:query', query);
        }
    }
});

module.exports = function(element, options) {
    return new SearchForm({
        el: element
    });
};
