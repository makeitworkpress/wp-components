module.exports.initialize = function() {
    
    jQuery('.atom-tabs').each( function(index) {
        
        var tabButton = jQuery(this).find('.atom-tabs-navigation a'),
            tabContent = jQuery(this).find('.atom-tabs-content section');
    
        jQuery(tabButton).click( function(event) {

            var target = jQuery(this).data("target"),
                activeContent = jQuery(this).closest('.atom-tabs').find('.atom-tabs-content section[data-id="' + target + '"]');
            
            // If the tab has a real link, we use that
            if( tabButton.attr('href') === '#' ) {
                
                event.preventDefault();

                // Remove current active classes
                jQuery(tabButton).removeClass("active");
                jQuery(tabContent).removeClass("active");

                // Add active class to our new things
                jQuery(this).addClass("active");      
                jQuery(activeContent).addClass("active");
                
            }

        });
        
    });
    
};