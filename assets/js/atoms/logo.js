/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() { 
    
    jQuery('.atom-logo').each( function(index) {
        
        var agent = navigator.userAgent.toLowerCase().match(/(iphone|android|windows phone|iemobile|wpdesktop)/),
            header = jQuery(this).closest('.molecule-header'),
            img = jQuery(this).find('img'),
            defaultSrc = agent ? jQuery(this).data('mobile') : jQuery(this).find('img').attr('src'),  
            transparentSrc = agent ? jQuery(this).data('mobiletransparent') : jQuery(this).data('transparent'),
            self = this;
        
        // Fade-in logo so we do not see the src change flickr
        jQuery(this).fadeIn(); 

        // Mobile logo's might have a different size. We have to insert that and define our mobile logo.
        if( agent ) {

            jQuery(img).attr('src', defaultSrc);

            var imageLoad = new Image();
            imageLoad.src = defaultSrc;
            imageLoad.onload = function() {
                jQuery(img).attr('height', this.height);
                jQuery(img).attr('width', this.width);
            }

        }

        // And of course we need to apply our transparent image    
        if( jQuery(header).hasClass('molecule-header-transparent') && transparentSrc ) {
            jQuery(img).attr('src', transparentSrc);    
        }        
        
        // And if we're scrolling, the transparency is removed
        jQuery(window).scroll( function() {
            
            var position = jQuery(window).scrollTop();
            
            // Dynamic header classes
            if( jQuery(header).hasClass('molecule-header-fixed') && jQuery(header).hasClass('molecule-header-transparent') ) {

                if( position > 5 && defaultSrc ) {
                    jQuery(img).attr('src', defaultSrc);
                } else if( transparentSrc ) {
                    jQuery(img).attr('src', transparentSrc);                   
                }
              
            }

        });        
    
        
    });      
        
};