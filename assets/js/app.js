/**
 * All modules are bundled into one application
 */
'use strict';
var utils = require('./utils');

var App = {
    atoms: {
        logo: require('./atoms/logo'),
        menu: require('./atoms/menu'),
        modal: require('./atoms/modal'),
        rate: require('./atoms/rate'),
        scroll: require('./atoms/scroll'),
        search: require('./atoms/search'),
        share: require('./atoms/share'),
        tabs: require('./atoms/tabs')
    },     
    molecules: {
        header: require('./molecules/header'),
        posts: require('./molecules/posts'),
        slider: require('./molecules/slider'),
    },  
    initialize: function() {

        // Initialize atoms
        for( var key in this.atoms ) {
            this.atoms[key].initialize();
        }
        
        // Initialize molecules
        for( var key in this.molecules ) {
            this.molecules[key].initialize();
        }
        
        // Execute our scroll-reveal
        utils.scrollReveal();
        
        // Execute parallax backgrounds
        $(window).scroll(function() {
            
            var scrollPosition  = $(this).scrollTop();
            
            $('.components-parallax').css({
                'backgroundPosition' : '50% ' + (50 - (scrollPosition/3)) + "%"
            });
            
        });
        
    }
}

// Boot our application
jQuery(document).ready( function() {
    App.initialize();
});