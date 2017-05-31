/**
 * Defines the scripts slider
 */
module.exports.initialize = function() {
     
    // Set-up the slider
    jQuery('.molecule-slider').each(function (index) {

        // Retrieve our option values
        var id = jQuery(this).data('id'),
            options = window['slider' + id];
        
        jQuery(this).flexslider(options);

    });

    // Flexslider has problems with loading first slide if height of image can not be defined beforehand  
    jQuery('img').on('load', function () {
        var imgHeight = jQuery('.flex-active-slide img').height();
        jQuery(".flex-viewport").css({"height" : imgHeight});
    });           
        
};