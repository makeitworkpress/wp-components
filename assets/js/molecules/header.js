/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.molecule-header').each( function(index) {
    
        var height = jQuery(this).height(),
            newScroll = 0,
            self = this,
            up = false;
        
        if( jQuery(this).hasClass('molecule-header-fixed') ) {
            
            jQuery(this).next('main').css({
                'paddingTop' : height
            });    
        }

        // Allows our header to behave as a headroom
        jQuery(window).scroll( function() {
            
            var position = jQuery(window).scrollTop();
            
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