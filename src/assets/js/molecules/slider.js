/**
 * Defines the scripts slider
 */
module.exports.initialize = function() {

    var wpcSliders = {};
     
    // Set-up the slider
    jQuery('.molecule-slider').each(function (index) {

        // Retrieve our option values
        var id = jQuery(this).data('id'),
            maxHeight = 0,
            options = window['slider' + id],
            slider = jQuery(this).find('.slider'),
            slides = slider.find('.atom-slide'),
            lazy = slides.find('.lazy');
        
        if (typeof tns !== "undefined") {
            wpcSliders[id] = tns(options);
        }

        // If lazyload is enabled, the height should be set dynamically - after other JS is executed
        if( lazy.length > 0 && slides.length > 0 && slider.length > 0 ) {
            
            setTimeout( function() {

                if(options.autoHeight) {
                    maxHeight = slides[0].clientHeight;
                } else {
                     maxHeight = Math.max.apply(null, slides.map(function () {
                        return $(this).height();
                    }).get()); 
                }

                slider.closest('.tns-inner').height(maxHeight);

            }, 300);   

        }
        

    });       
        
};