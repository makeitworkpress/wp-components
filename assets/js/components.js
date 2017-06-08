(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * All modules are bundled into one application
 */

'use strict';
var App = {
    atoms: {
        logo: require('./atoms/logo'),
        menu: require('./atoms/menu'),
        modal: require('./atoms/modal'),
        rate: require('./atoms/rate'),
        scroll: require('./atoms/scroll'),
        share: require('./atoms/share'),
        tabs: require('./atoms/tabs')
    },     
    molecules: {
        header: require('./molecules/header'),
        posts: require('./molecules/posts'),
        slider: require('./molecules/slider'),
    },  
    initialize: function() {

        // Initialize atoms
        for( var key in this.atoms ) {
            this.atoms[key].initialize();
        }
        
        // Initialize molecules
        for( var key in this.molecules ) {
            this.molecules[key].initialize();
        }
        
        // Execute our scroll-reveal
        window.sr = ScrollReveal();
        
        sr.reveal( '.components-bottom-appear', { origin: 'bottom'} );
        sr.reveal( '.components-left-appear', { origin: 'left'} );
        sr.reveal( '.components-right-appear', { origin: 'right'} );
        sr.reveal( '.components-top-appear', { origin: 'top'} );
        
    }
}

// Boot our application
jQuery(document).ready( function() {
    App.initialize();
});
},{"./atoms/logo":2,"./atoms/menu":3,"./atoms/modal":4,"./atoms/rate":5,"./atoms/scroll":6,"./atoms/share":7,"./atoms/tabs":8,"./molecules/header":9,"./molecules/posts":10,"./molecules/slider":11}],2:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() { 
    
    jQuery('.atom-logo').each( function(index) {
        
        var agent = navigator.userAgent.toLowerCase().match(/(iphone|android|windows phone|iemobile|wpdesktop)/),
            header = jQuery(this).closest('.molecule-header'),
            img = jQuery(this).find('img'),
            defaultSrc = agent ? jQuery(img).data('mobile') : jQuery(img).attr('src'),  
            transparentSrc = agent ? jQuery(img).data('mobiletransparent') : jQuery(img).data('transparent')       ,
            position = jQuery(window).scrollTop(),
            self = this;
        
        // Fade-in logo so we do not see the src change flickr
        jQuery(this).fadeIn();
            
        if( jQuery(header).hasClass('molecule-header-transparent') && transparentSrc ) {
            jQuery(img).attr('src', transparentSrc);    
        }
        
        // And if we're scrolling, the transparency is removed
        jQuery(window).scroll( function() {
            
            // Dynamic header classes
            if( jQuery(header).hasClass('molecule-header-fixed') && jQuery(header).hasClass('molecule-header-transparent') ) {

                if( position > 5 && defaultSrc ) {
                    jQuery(img).attr('src', defaultSrc);
                } else if( transparentSrc ) {
                    jQuery(img).attr('src', transparentSrc);                   
                }
              
            }

        });        
    
        
    });      
        
};
},{}],3:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.atom-menu').each( function(index) {
        
        var menu = this;
    
        jQuery(this).find(".atom-menu-hamburger").click( function(event) {
            event.preventDefault();
            jQuery(menu).find('.atom-menu-hamburger').toggleClass('active');
            jQuery(menu).find('.menu').slideToggle();
        });  
        
    });      
        
};
},{}],4:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.atom-modal').each( function(index) {
        
        var modal = this;
    
        jQuery(this).find(".atom-modal-close").click( function(event) {
            event.preventDefault();
            jQuery(modal).fadeOut();
        });  
        
    });      
        
};
},{}],5:[function(require,module,exports){
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
        
        var id = jQuery(this).data('id'),
            max = jQuery(this).data('max'),
            min = jQuery(this).data('min'),
            module = (this).closest('.atom-rate'),
            rating = jQuery(this).find('.atom-rate-rate i.fa-star').length;

        jQuery(module).append('<i class="fa fa-spin fa-circle-o-notch"></i>');
        
        utils.ajax({
            data: {
                action: 'publicRate',
                id: id,
                max: max,
                min: min,
                rating: rating
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
                    jQuery(module).find('.fa-circle-o-notch').remove();
                }, 400)
            }
        });
    });      
        
};
},{"./../utils":12}],6:[function(require,module,exports){
/**
 * Defines a scroll element
 * The scroll element always scrolls away from it's parent element
 */
module.exports.initialize = function() {
    
    jQuery('.atom-scroll').each( function(index) {
        
        var away = jQuery(this).parent(),
            awayHeight = jQuery(away).height(),
            self = this;
    
        // Scroll down using the arrow 
        jQuery(this).click( function(event) {
            
            event.preventDefault();
            
            jQuery('html, body').animate({
                scrollTop: jQuery(away).offset().top + awayHeight
            }, 555);
            
        }); 
        
        // Hide the scroller if we're past
        jQuery(window).scroll( function() {
            
            var buttonPosition = jQuery(self).offset().top,
                scrollPosition = jQuery(this).scrollTop();
            
            if( scrollPosition > buttonPosition ) {
                jQuery(self).fadeOut();    
            } else {
                jQuery(self).fadeIn();     
            }
            
        });
        
    });       
        
};
},{}],7:[function(require,module,exports){
/**
 * Defines a scroll element
 * The scroll element always scrolls away from it's parent element
 */
module.exports.initialize = function() {
    
    jQuery('.atom-share-fixed').each( function(index) {
        
        var self = this;
        
        if ( jQuery(document).height() > jQuery(window).height()) {
            // Hide the scroller if we're past
            jQuery(window).scroll( function() {

                var scrollPosition = jQuery(this).scrollTop();

                if( scrollPosition > 5 ) {
                    jQuery(self).fadeIn();    
                } else {
                    jQuery(self).fadeOut();     
                }

            });
        } else {
            jQuery(this).fadeIn();
        }
        
    });       
        
};
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.molecule-header').each( function(index) {
    
        var newScroll = 0,
            position = jQuery(window).scrollTop(),
            self = this,
            up = false;

        // Allows our header to behave as a headroom
        jQuery(window).scroll( function() {
            
            // Dynamic header classes
            if( jQuery(self).hasClass('molecule-header-fixed') ) {
                
                if( position > 5 ) {
                    jQuery(self).addClass('molecule-header-scrolled');
                } else {
                    jQuery(self).removeClass('molecule-header-scrolled');
                }               
            }

            // Headroom navigation
            if( jQuery(self).hasClass('molecule-header-headroom') ) {

                newScroll = jQuery(window).scrollTop();

                if( newScroll > position && ! up ) {
                    jQuery(self).stop().slideToggle(500);
                    up = ! up;
                } else if( newScroll < position && up ) {
                    jQuery(self).stop().slideToggle(500);
                    up = ! up;
                }

                position = newScroll;

            }

        });   
        
    });       
        
};
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
/**
 * Contains utility functions
 */
module.exports.ajax = function(options) {
    
    var options = options;
    
    options.data.nonce = components.nonce;
    options.type = 'POST';
    options.url = components.ajaxUrl;
    
    return jQuery.ajax(options);
    
}
},{}]},{},[1]);
