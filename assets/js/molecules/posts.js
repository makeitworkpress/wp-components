/**
 * Defines the custom posts scripts
 */
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

                    });


                }

            });
            
        }
        
        /**
         * Normal Pagination
         * In the future, we might want to link this to a custom ajax action so that we only load the posts and not the whole page.
         */
        if( jQuery(this).hasClass('molecule-posts-ajax') ) {
        
            jQuery('body').on('click', '.atom-pagination a', function(event) {
                
                event.preventDefault();

                var self = jQuery(this).closest('.molecule-posts'),
                    current = jQuery(self).find('.atom-pagination .current'),
                    currentPage = jQuery(current).text(),
                    page = jQuery(this).attr('href'),
                    pageCurrent = page.replace(/\/page\/[0-9]+/, '/page/' + currentPage );

                /**
                 * Update our pagination and add the right classes
                 */
                jQuery(current).replaceWith('<a class="page-numbers" href="' + pageCurrent + '">' + currentPage + '</a>');
                jQuery(this).addClass('current');
                jQuery(self).addClass('components-loading');

                // Load our data
                jQuery.get(page, function(data) {
                    var posts = jQuery(data).find('.molecule-posts[data-id="' + id + '"] .molecule-post');

                    jQuery(self).removeClass('components-loading');
                    jQuery(self).find('.molecule-posts-wrapper').html(posts);

                });             

            });
            
        }
        
        // Filtering

        
        
    });      
        
};