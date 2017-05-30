/**
 * Defines the scripts slider
 */
module.exports.initialize = function() {
     
    // Retrieve our option values
    jQuery('.molecule-slider').each(function (index) {

        var options = jQuery(this).data();

        jQuery(this).flexslider(options);

    });

    // Flexslider has problems with loading first slide if height of image can not be defined beforehand  
    jQuery('img').on('load', function () {
        var imgHeight = jQuery('.flex-active-slide img').height();
        jQuery(".flex-viewport").css({"height" : imgHeight});
    });           
        
}