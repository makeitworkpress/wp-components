/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.atom-menu').each( function(index) {
        
        var menu = this;
    
        jQuery(this).find(".atom-menu-hamburger").click( function(event) {
            event.preventDefault();
            
            jQuery(menu).toggleClass('atom-menu-expanded');
            jQuery(menu).find('.atom-menu-hamburger').toggleClass('active');
            jQuery(menu).find('.menu').toggleClass('active');
            
        }); 
        
        if( jQuery(this).hasClass('atom-menu-collapse') ) {
            jQuery(this).find('.menu-item-has-children > a').append('<i class="fa fa-angle-down"></i>');
            
            var expandable = jQuery(this).find('.fa-angle-down');
            
            jQuery('body').on('click', '.menu-item-has-children a > i', function(event) {
                
                event.preventDefault();
                
                jQuery(this).closest('.menu-item').find('> .sub-menu').slideToggle();
                jQuery(this).toggleClass('fa-angle-down');
                jQuery(this).toggleClass('fa-angle-up');
                
            });
            
        }
        
    });      
        
};