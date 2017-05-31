(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * All modules are bundled into one application
 */
'use strict';

var header = require('./molecules/header');
var menu = require('./atoms/menu');
var modal = require('./atoms/modal');
var posts = require('./molecules/posts');
var rate = require('./atoms/rate');
var scroll = require('./atoms/scroll');
var slider = require('./molecules/slider'); 
var tabs = require('./atoms/tabs');

var Components = {
    initialize: function() {
        header.initialize();
        menu.initialize();
        modal.initialize();
        posts.initialize();
        rate.initialize();
        scroll.initialize();
        slider.initialize();
        tabs.initialize(); 
    }
}

// Boot our application
jQuery(document).ready( function() {
    Components.initialize();
});
},{"./atoms/menu":2,"./atoms/modal":3,"./atoms/rate":4,"./atoms/scroll":5,"./atoms/tabs":6,"./molecules/header":7,"./molecules/posts":8,"./molecules/slider":9}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
        
        var atom = jQuery(this).data('unique'),
            rating = jQuery(this).find('.atom-rate-rate i.fa-star').length,
            id = jQuery(this).data("id"),
            module = (this).closest('.atom-rate');
        
        jQuery(module).append('<i class="fa fa-spin fa-cog"></i>');
        
        utils.ajax({
            data: {
                action: 'publicRate',
                atom: 'rate' + atom,
                id: id,
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
                    jQuery(module).find('.fa-cog').remove();
                }, 400)
            }
        });
    });      
        
};
},{"./../utils":10}],5:[function(require,module,exports){
/**
 * Defines a scroll element
 * The scroll element always scrolls away from it's parent element
 */
module.exports.initialize = function() {
    
    jQuery('.atom-scroll').each( function(index) {
        
        var away = jQuery(this).parent(),
            awayHeight = jQuery(away).height();
    
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
                $(self).fadeOut();    
            } else {
                $(self).fadeIn();     
            }
            
        });
        
    });       
        
};
},{}],6:[function(require,module,exports){
module.exports.initialize = function() {
    
    jQuery('.atom-menu').each( function(index) {
        
        var tabButton = jQuery(this).find('.atom-tabs-navigation a'),
            tabContent = jQuery(this).find('.atom-tabs-content section');
    
        jQuery(tabButton).click( function(event) {

            event.preventDefault();

            var target = jQuery(this).data("target"),
                activeContent = jQuery(this).closest('.atom-menu').find('.atom-tabs-content section[data-id="' + target + '"]');

            // Remove current active classes
            jQuery(tabButton).removeClass("active");
            jQuery(tabContent).removeClass("active");

            // Add active class to our new things
            jQuery(this).addClass("active");      
            jQuery(activeContent).addClass("active");

        });
        
    });
    
};
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.molecule-posts').each( function(index) {
        
        var paginate = jQuery(this).find('.atom-pagination .page-numbers'),
            pagenumber = 1,
            postsHeight = jQuery(this).height,
            postsPosition = jQuery(this).offset().top,
            self = this,
            unique = jQuery(this).data('unique'),
            url = false;
        
        // Infinite scrolling
        if( jQuery(this).hasClass('do-infinite') ) {
            
            jQuery(window).scroll( function() {

                if( (jQuery(window).scrollTop() + jQuery(window).height()) > (postsPosition + postsHeight - 320) ) {

                    pageNumber++;

                    // Check our pagination and retrieve our urls
                    jQuery(paginate).each( function(index) {

                        if( jQuery(this).text() == pageNumber ) {
                            url = jQuery(this).attr('href');
                        }

                    });

                    // We've exceeded our urls
                    if( ! url ) {
                        return;
                    }

                    jQuery.get(url, function(data) {
                        var posts = jQuery(data).find('.molecule-posts[data-unique="' + unique + '"] .molecule-posts-post');

                        jQuery(self).find('.molecule-posts-wrapper').append(posts);

                    });                



                }

            });
            
        }
        
        
        // Normal Pagination
        if( jQuery(this).hasClass('do-ajax') ) {
        
            jQuery(this).on('click', '.atom-pagination a', function() {

                var current = jQuery(self).find('.atom-pagination current'),
                    currentPage = jQuery(current).text(),
                    page = jQuery(this).attr('href'),
                    pageCurrent = page.replace(/\/page\/[0-9]+/, '/page/' + currentPage );

                /**
                 * Update our pagination and add the right classes
                 */
                jQuery(current).replaceWith('<a class="page-numbers" href="' + pageCurrent + '">' + currentPage + '</a>');
                jQuery(this).addClass('current'); 

                // Load our data
                jQuery.get(page, function(data) {
                    var posts = jQuery(data).find('.molecule-posts[data-unique="' + unique + '"] .molecule-posts-post');

                    jQuery(self).find('.molecule-posts-wrapper').html(posts);

                });             

            });
            
        }
        
        // Filtering

        
        
    });      
        
};
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
