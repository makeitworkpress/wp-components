/**
 * Defines the custom posts scripts
 */
var utils = require('./../utils');

module.exports.initialize = function() {
    
    jQuery('.molecule-posts').each( function(index) {
        
        var id = jQuery(this).data('id'),
            isSet = false,
            paginate = jQuery(this).find('.atom-pagination .page-numbers'),
            position = jQuery(this).offset().top,
            pageNumber = 1,
            self = this;
        
        /**
         * Infinite scrolling
         * In the future, we might want to link this to a custom ajax action so that we only load the posts and not the whole page.
         */
        if( jQuery(this).hasClass('molecule-posts-infinite') ) {
            
            // Pagination is hidden by JS instead of css. Clients that don't support JS, do see pagination
            jQuery(this).find('.atom-pagination').hide();
            
            jQuery(window).scroll( function() {
                
                var url = false,
                    postsHeight = jQuery(self).height();

                if( (jQuery(window).scrollTop() + jQuery(window).height()) > (position + postsHeight) ) {
                    
                    if( ! isSet ) {
                        
                        pageNumber++;

                        // Check our pagination and retrieve our urls
                        jQuery(paginate).each( function(index) {

                            if( jQuery(this).text() == pageNumber ) {
                                url = jQuery(this).attr('href');
                                isSet = true;
                            }

                        });
                        
                    }

                    // We've exceeded our urls
                    if( ! url ) {
                        isSet = true;
                        return;
                    }

                    jQuery.get(url, function(data) {
                        var posts = jQuery(data).find('.molecule-posts[data-id="' + id + '"] .molecule-post');

                        jQuery(self).find('.molecule-posts-wrapper').append(posts);
                        
                        // Update our pagenumber and posts height
                        isSet = false;
                        
                        // Sync scrollReveal with newly added items
                        if( typeof sr !== "undefined" ) 
                            sr.sync();

                    });


                }

            });
            
        }
        
        /**
         * Normal Pagination
         * In the future, we might want to link this to a custom ajax action so that we only load the posts and not the whole page.
         */
        if( jQuery(this).hasClass('molecule-posts-ajax') ) {
            
            // These are not supported yet
            jQuery('body').on('click', '.molecule-posts .atom-pagination a', function(event) {
                
                event.preventDefault();

                var self = jQuery(this).closest('.molecule-posts'),
                    target = jQuery(this).attr('href');

                /**
                 * Update our pagination and add the right classes
                 */
                jQuery(self).addClass('components-loading');

                // Load our data
                jQuery.get(target, function(data) {
                    var pagination = jQuery(data).find('.molecule-posts[data-id="' + id + '"] .atom-pagination'),
                        posts = jQuery(data).find('.molecule-posts[data-id="' + id + '"] .molecule-post'),
                        scrollHeight = jQuery('.molecule-header').hasClass('molecule-header-fixed') ? jQuery('.molecule-header').height() : 0;

                    jQuery(self).removeClass('components-loading');
                    jQuery(self).find('.molecule-posts-wrapper').html(posts);
                    jQuery(self).find('.atom-pagination').replaceWith(pagination);
                    
                    jQuery('html, body').animate({
                        scrollTop: jQuery(self).offset().top - scrollHeight
                    }, 555);                    
                    
                    // Sync scrollReveal with newly added items
                    if( typeof sr !== "undefined" ) 
                        sr.sync();

                });             

            });
            
        }
        
        // Filtering

        
        
    });      
        
};