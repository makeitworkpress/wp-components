/**
 * Defines the custom header scripts
 */
var utils = require('./../utils');

module.exports.initialize = function() {

    // Check if we are rating
    var isRating = false;
    
    // Rating at blog posts
    jQuery('body').on('mouseenter', '.atom-rate-rate i', function() {
        
        // Items at and left of the mouse
        jQuery(this).addClass('fa-star');
        jQuery(this).prevAll().addClass('fa-star');
        jQuery(this).removeClass('fa-star-o');
        jQuery(this).prevAll().removeClass('fa-star-o'); 
        
        // Items right of the mouse
        jQuery(this).nextAll().removeClass('fa-star');
        jQuery(this).nextAll().addClass('fa-star-o');
        
    });
    
    // Leaving
    jQuery('body').on('mouseleave', '.atom-rate-rate', function() {
        
        // Items at and left of the mouse
        jQuery(this).find('i').addClass('fa-star-o');
        jQuery(this).find('i').removeClass('fa-star');
        
    }); 
    
    // Clicking
    jQuery('body').on('click', '.atom-rate a', function (event) {
        
        event.preventDefault();

        // Prevent action if we're still rating
        if( isRating ) {
            return;
        }
        
        var id = jQuery(this).data('id'),
            max = jQuery(this).data('max'),
            min = jQuery(this).data('min'),
            module = (this).closest('.atom-rate'),
            rating = jQuery(this).find('.atom-rate-rate i.fa-star').length;

        // Append a spinner
        jQuery(module).append('<i class="fa fa-spin fa-circle-o-notch"></i>');

        // We're rating
        isRating = true;
        
        // Perform the ajax action
        utils.ajax({
            data: {
                action: 'public_rate',
                id: id,
                max: max,
                min: min,
                rating: rating
            },
            success: function(response) {
                
                // Logging for debugging purposes
                if( wpc.debug )
                    console.log(response);
                
                // Replaces the element with the updated rating
                if(response.success === true && response.data.output !== '')
                    jQuery(module).replaceWith(response.data.output);    
                    
            },
            complete: function() {
                setTimeout( function() {
                    // Remove the circle
                    jQuery(module).find('.fa-circle-o-notch').remove();

                    // We finished rating
                    isRating = false;
                    
                }, 500);
            }
        });

    });      
        
};