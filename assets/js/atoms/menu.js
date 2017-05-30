/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.atom-menu').each( function(index) {
        
        var menu = this;
    
        jQuery(this).find(".hamburger-menu").click( function(event) {
            event.preventDefault();
            jQuery(menu).find('.hamburger-menu').toggleClass('active');
            jQuery(menu).find('.menu').slideToggle();
        });  
        
    });      
        
}