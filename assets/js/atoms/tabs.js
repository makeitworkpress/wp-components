module.exports.initialize = function() {
    
    jQuery('.atom-menu').each( function(index) {
        
        var tabButton = jQuery(this).find('.atom-tabs-navigation a'),
            tabContent = jQuery(this).find('.atom-tabs-content section');
    
        jQuery(tabButton).click( function(event) {

            event.preventDefault();

            var target = jQuery(this).data("target"),
                activeContent = jQuery(this).closest('.atom-menu').find('.atom-tabs-content section[data-id="' + target + '"]');

            // Remove current active classes
            jQuery(tabButton).removeClass("active");
            jQuery(tabContent).removeClass("active");

            // Add active class to our new things
            jQuery(this).addClass("active");      
            jQuery(activeContent).addClass("active");

        });
        
    });
    
};