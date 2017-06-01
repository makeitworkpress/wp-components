/**
 * All modules are bundled into one application
 */
'use strict';

var header = require('./molecules/header');
var menu = require('./atoms/menu');
var modal = require('./atoms/modal');
var posts = require('./molecules/posts');
var rate = require('./atoms/rate');
var scroll = require('./atoms/scroll');
var share = require('./atoms/share');
var slider = require('./molecules/slider'); 
var tabs = require('./atoms/tabs');

var Components = {
    initialize: function() {
        header.initialize();
        menu.initialize();
        modal.initialize();
        posts.initialize();
        rate.initialize();
        scroll.initialize();
        share.initialize();
        slider.initialize();
        tabs.initialize(); 
    }
}

// Boot our application
jQuery(document).ready( function() {
    Components.initialize();
});