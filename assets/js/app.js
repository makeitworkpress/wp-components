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
        jQuery(window).scroll(function() {
            
            var scrollPosition  = jQuery(this).scrollTop();
            
            jQuery('.components-parallax').css({
                'backgroundPosition' : '50% ' + (50 + (scrollPosition/8)) + "%"
            });
            
        });
        
    }
}

// Boot our application
jQuery(document).ready( function() {
    App.initialize();
});