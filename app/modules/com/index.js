'use strict';
/* global require,window*/
var jQuery = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = jQuery;

var comPort = Backbone.Events;
module.exports = comPort;
