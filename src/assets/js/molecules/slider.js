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
        
        // Save our slider instance
        if (typeof tns !== "undefined") {
            wpcSliders[id] = tns(options);
        }

        /**
         * Fixes a bug with a wrong slider height with lazy loaded images.
         */
        if( lazy.length > 0 && slides.length > 0 ) {
            
            setTimeout( function() {

                maxHeight = Array.prototype.map.call(slides, function(n) {
                    if( n.clientHeight != n.clientWidth ) {
                        return n.clientHeight;
                    }
                }).filter( function(n) {
                    return n != null;
                }).reduce( function(a, b) {
                    return Math.max(a, b);
                });

                slider.closest('.tns-inner').css( {'maxHeight' : maxHeight + 'px' } );

            }, 300);

        }        

    });       
        
};