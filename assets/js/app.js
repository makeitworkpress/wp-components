/**
 * All modules are bundled into one application
 */
'use strict';

var header = require('./molecules/header');
var menu = require('./atoms/menu');
var postheader = require('./molecules/postheader');
var posts = require('./molecules/posts');
var rate = require('./atoms/rate');
var slider = require('./molecules/slider'); 
var tabs = require('./atoms/tabs');

var Components = {
    initialize: function() {
        header.initialize();
        menu.initialize();
        postheader.initialize();
        posts.initialize();
        rate.initialize();
        slider.initialize();
        tabs.initialize(); 
    }
}

// Boot our application
jQuery(document).ready( function() {
    Components.initialize();
});