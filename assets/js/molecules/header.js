/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.molecule-header').each( function(index) {
    
        var newScroll = 0,
            position = jQuery(window).scrollTop(),
            self = this,
            up = false;

        // Allows our header to behave as a headroom
        jQuery(window).scroll( function() {
            
            // Dynamic header classes
            if( jQuery(self).hasClass('molecule-header-fixed') ) {
                
                if( position > 5 ) {
                    jQuery(self).addClass('molecule-header-scrolled');
                } else {
                    jQuery(self).removeClass('molecule-header-scrolled');
                }               
            }

            // Headroom navigation
            if( jQuery(self).hasClass('molecule-header-headroom') ) {

                newScroll = jQuery(window).scrollTop();

                if( newScroll > position && ! up ) {
                    jQuery(self).stop().slideToggle(500);
                    up = ! up;
                } else if( newScroll < position && up ) {
                    jQuery(self).stop().slideToggle(500);
                    up = ! up;
                }

                position = newScroll;

            }

        });   
        
    });       
        
};