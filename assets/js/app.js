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

        // Initialize atoms
        for( var key in this.atoms ) {
            this.atoms[key].initialize();
        }
        
        // Initialize molecules
        for( var key in this.molecules ) {
            this.molecules[key].initialize();
        }
        
        // Execute our scroll-reveal
        window.sr = ScrollReveal();
        
        sr.reveal( '.components-bottom-appear', { origin: 'bottom'} );
        sr.reveal( '.components-left-appear', { origin: 'left'} );
        sr.reveal( '.components-right-appear', { origin: 'right'} );
        sr.reveal( '.components-top-appear', { origin: 'top'} );
        
    }
}

// Boot our application
jQuery(document).ready( function() {
    App.initialize();
});