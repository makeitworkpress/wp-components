/**
 * Defines a scroll element
 * The scroll element always scrolls away from it's parent element
 */
module.exports.initialize = function() {
    
    jQuery('.atom-share-fixed').each( function(index) {
        
        var self = this;
        
        if ( jQuery(document).height() > jQuery(window).height()) {
            // Hide the scroller if we're past
            jQuery(window).scroll( function() {

                var scrollPosition = jQuery(this).scrollTop();

                if( scrollPosition > 5 ) {
                    jQuery(self).fadeIn();    
                } else {
                    jQuery(self).fadeOut();     
                }

            });
        } else {
            jQuery(this).fadeIn();
        }
        
    });       
        
};