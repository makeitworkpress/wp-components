/**
 * Defines the custom header scripts
 */
var utils = require('./../utils');

module.exports.initialize = function() {
    
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
        
        var rating = jQuery(this).find('.atom-rate-rate i.fa-star').length,
            id = jQuery(this).data("id"),
            module = (this).closest('.atom-rate');
        
        jQuery(module).append('<i class="fa fa-spin fa-cog"></i>');
        
        utils.ajax({
            data: {
                action: 'publicRate',
                blogRating: rating,
                id: id
            },
            success: function(response) {
                
                // Logging for debugging purposes
                if( components.debug )
                    console.log(response);
                
                // Replaces the element with the updated rating
                if(response.success === true && response.data.output !== '')
                    jQuery(module).replaceWith(response.data.output);    
                    
            },
            complete: function() {
                setTimeout( function() {
                    jQuery(module).find('.fa-cog').remove();
                }, 400)
            }
        });
    });      
        
}