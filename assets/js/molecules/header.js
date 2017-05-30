/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.molecule-header').each( function(index) {
    
        var newScroll,
            position = jQuery(window).scrollTop(),
            self = this,
            up = false;

        // Allows our header to behave as a headroom
        if( jQuery(this).hasClass('components-headroom') ) {
            jQuery(window).scroll( function() {
                
                newScroll = jQuery(window).scrollTop();
                
                if( newscroll > position && ! up ) {
                    jQuery(self).stop().slideToggle(333);
                    up = !up;
                } else if( newscroll < mypos && up ) {
                    jQuery(self).stop().slideToggle(333);
                    up = !up;
                }
                
                position = newscroll;
                
            });
        }     
        
    });       
        
}