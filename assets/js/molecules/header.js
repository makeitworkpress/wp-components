/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.molecule-header').each( function(index) {
    
        var current = jQuery(window).scrollTop(),
            height = jQuery(this).height(),
            self = this,
            up = false;
        
        if( jQuery(this).hasClass('molecule-header-fixed') ) {
            
            jQuery(this).next('.main').css({
                'paddingTop' : height
            });    
        }

        // Allows our header to behave as a headroom
        jQuery(window).scroll( function() {
            
            var position = jQuery(this).scrollTop();
            
            // Dynamic header classes
            if( jQuery(self).hasClass('molecule-header-fixed') ) {
                
                if( position > 5 ) {
                    jQuery(self).addClass('molecule-header-scrolled');
                    jQuery(self).removeClass('molecule-header-top');
                } else {
                    jQuery(self).removeClass('molecule-header-scrolled');
                    jQuery(self).addClass('molecule-header-top');
                }
                
                
            }

            // Headroom navigation
            if( jQuery(self).hasClass('molecule-header-headroom') ) {

                if( position > current && ! up ) {
                    jQuery(self).stop().slideToggle();
                    up = ! up;
                } else if( position < current && up ) {
                    jQuery(self).stop().slideToggle();
                    up = ! up;
                }

                current = position;

            }

        });
        
        
        // The behaviour of a cart element is different within headers
        jQuery('.molecule-header .atom-cart-icon').click( function(event) {
            event.preventDefault();
            jQuery(this).next('.atom-cart-content').fadeToggle();
        });
        
    });       
        
};