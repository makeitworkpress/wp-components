/**
 * Defines a scroll element
 * The scroll element always scrolls away from it's parent element
 */
module.exports.initialize = function() {
    
    jQuery('.atom-scroll').each( function(index) {
        
        var away = jQuery(this).parent(),
            buttonPosition = jQuery(this).offset().top,
            awayHeight = jQuery(away).height(),
            scroll = jQuery(away).offset().top + awayHeight,
            self = this;
    
        // Scroll down using the arrow 
        jQuery(this).click( function(event) {
            
            event.preventDefault();
            
            if( jQuery(this).hasClass('atom-scroll-top') ) {
                scroll = jQuery('body').offset().top;    
            }
            
            jQuery('html, body').animate({
                scrollTop: scroll
            }, 555);            
            
        }); 
        
        // Hide the scroller if we're past
        jQuery(window).scroll( function() {
            
            var scrollPosition = jQuery(this).scrollTop();
            
            if( jQuery(this).hasClass('atom-scroll-top') ) {
                if( scrollPosition < jQuery(window).height() ) {
                    jQuery(self).fadeOut();    
                } else {
                    jQuery(self).fadeIn();     
                }                
                
            } else {          
            
                if( scrollPosition > buttonPosition ) {
                    jQuery(self).fadeOut();    
                } else {
                    jQuery(self).fadeIn();     
                }
            }
            
        });
        
    });       
        
};