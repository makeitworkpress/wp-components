/**
 * All modules are bundled into one application
 */

'use strict';
var App = {
    atoms: {
        logo: require('./atoms/logo'),
        menu: require('./atoms/menu'),
        modal: require('./atoms/modal'),
        rate: require('./atoms/rate'),
        scroll: require('./atoms/scroll'),
        share: require('./atoms/share'),
        tabs: require('./atoms/tabs')
    },     
    molecules: {
        header: require('./molecules/header'),
        posts: require('./molecules/posts'),
        slider: require('./molecules/slider'),
    },  
    initialize: function() {

        for( var key in this.atoms ) {
            this.atoms[key].initialize();
        }
        
        for( var key in this.molecules ) {
            this.molecules[key].initialize();
        }
        
    }
}

// Boot our application
jQuery(document).ready( function() {
    App.initialize();
});