/**
 * Defines a scroll element
 * The scroll element always scrolls away from it's parent element
 */
module.exports.initialize = function() {
    
    jQuery('.atom-scroll').each( function(index) {
        
        var away = jQuery(this).parent(),
            awayHeight = jQuery(away).height(),
            self = this;
    
        // Scroll down using the arrow 
        jQuery(this).click( function(event) {
            
            event.preventDefault();
            
            jQuery('html, body').animate({
                scrollTop: jQuery(away).offset().top + awayHeight
            }, 555);
            
        }); 
        
        // Hide the scroller if we're past
        jQuery(window).scroll( function() {
            
            var buttonPosition = jQuery(self).offset().top,
                scrollPosition = jQuery(this).scrollTop();
            
            if( scrollPosition > buttonPosition ) {
                jQuery(self).fadeOut();    
            } else {
                jQuery(self).fadeIn();     
            }
            
        });
        
    });       
        
};