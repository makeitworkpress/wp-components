(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * All modules are bundled into one application
 */
'use strict';
var utils = require('./utils');

var App = {
    atoms: {
        map: require('./atoms/map'),
        menu: require('./atoms/menu'),
        modal: require('./atoms/modal'),
        rate: require('./atoms/rate'),
        scroll: require('./atoms/scroll'),
        search: require('./atoms/search'),
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
        utils.scrollReveal();
        
        // Execute parallax backgrounds
        utils.parallax();     
        
    }
}

// Boot our application
jQuery(document).ready( function() {
    App.initialize();
});
},{"./atoms/map":2,"./atoms/menu":3,"./atoms/modal":4,"./atoms/rate":5,"./atoms/scroll":6,"./atoms/search":7,"./atoms/share":8,"./atoms/tabs":9,"./molecules/header":10,"./molecules/posts":11,"./molecules/slider":12,"./utils":13}],2:[function(require,module,exports){
/**
 * Creates a Google Map
 */
module.exports.initialize = function() {

    // Google Should be defined
    if( typeof(google) == 'undefined' ) {
        return;
    }

    jQuery('.atom-map').each( function(index) {
        var mapCanvas = jQuery('.components-maps-canvas', this).get(0),
            mapBounds = new google.maps.LatLngBounds(),
            mapVars = window[mapCanvas.dataset.id],
            mapOptions = {
                center: new google.maps.LatLng(parseFloat(mapVars.center.lat), parseFloat(mapVars.center.lng)),
                scrollwheel: false,
                styles: typeof(mapVars.styles) !== 'undefined' ? mapVars.styles : '',
                zoom: parseInt(mapVars.zoom)
            },   
            map = new google.maps.Map(mapCanvas, mapOptions),
            markers = [];
            
        // Exposes the map to the global scope so other scripts may act on it
        mapVars.map = map;

        if( ! mapVars.markers ) {
            return;
        }
            
        mapVars.markers.forEach( function(item, index) {

            var geocoder     = null;
                markerLatLng = null;
                markers[index] = new google.maps.Marker({
                    draggable: false,
                    icon: typeof(item.icon) !== 'undefined' ? item.icon : '',
                    map: map
                });

            // Geocodes the address
            if( typeof(item.address) !== 'undefined' && item.address ) {

                geocoder = geocoder !== null ? geocoder : new google.maps.Geocoder();

                geocoder.geocode( { 'address': item.address}, function(results, status) {
                    if (status == 'OK') {
                        markerLatLng = results[0].geometry.location;
                    } else {
                        console.log('Geocoding was not successful for the following reason: ' + status);
                    }
                });

            } else if( item.lat && item.lng ) {
                markerLatLng = new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng));
            }

            // Set the position and extends the bounds
            if( markerLatLng !== null ) {
                markers[index].setPosition( markerLatLng );
                mapBounds.extend(markerLatLng);
            }

        });

        // Fit the bounds
        if( markers.length > 0 && mapVars.fit ) {

            mapBounds.extend(mapOptions.center);
            map.fitBounds(mapBounds);  
            
            // Fix our zoom
            google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
                if(this.getZoom() > 15) {
                    this.setZoom(15);
                }
            });
 
        }

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
            
            jQuery(menu).toggleClass('atom-menu-expanded');
            jQuery(menu).find('.atom-menu-hamburger').toggleClass('active');
            jQuery(menu).find('.menu').toggleClass('active');
            
        }); 
        
        if( jQuery(this).hasClass('atom-menu-collapse') ) {
            jQuery(this).find('.menu-item-has-children > a').append('<i class="fa fa-angle-down"></i>');
            
            var expandable = jQuery(this).find('.fa-angle-down');
            
            jQuery('body').on('click', '.menu-item-has-children a > i', function(event) {
                
                event.preventDefault();
                
                jQuery(this).closest('.menu-item').find('> .sub-menu').slideToggle();
                jQuery(this).toggleClass('fa-angle-down');
                jQuery(this).toggleClass('fa-angle-up');
                
            });
            
        }
        
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
},{"./../utils":13}],6:[function(require,module,exports){
/**
 * Defines a scroll element
 * The scroll element always scrolls away from it's parent element
 */
module.exports.initialize = function() {
    
    jQuery('.atom-scroll').each( function(index) {
        
        var away = jQuery(this).parent(),
            buttonPosition = jQuery(this).offset().top,
            awayHeight = jQuery(away).height(),
            scroll = jQuery(away).offset().top + awayHeight,
            self = this;
    
        // Scroll down using the arrow 
        jQuery(this).click( function(event) {
            
            event.preventDefault();
            
            if( jQuery(this).hasClass('atom-scroll-top') ) {
                scroll = jQuery('body').offset().top;    
            }
            
            jQuery('html, body').animate({
                scrollTop: scroll
            }, 555);            
            
        }); 
        
        // Hide the scroller if we're past
        jQuery(window).scroll( function() {
            
            var scrollPosition = jQuery(this).scrollTop();
            
            if( jQuery(self).hasClass('atom-scroll-top') ) {
                if( (scrollPosition + jQuery(window).height() - 80) > jQuery(window).height() ) {
                    jQuery(self).fadeIn();    
                } else {
                    jQuery(self).fadeOut();     
                }                
                
            } else {          
            
                if( scrollPosition > buttonPosition ) {
                    jQuery(self).fadeOut();    
                } else {
                    jQuery(self).fadeIn();     
                }
            }
            
        });
        
    });       
        
};
},{}],7:[function(require,module,exports){
/**
 * Custom scripts for a search element
 * If enabled, the script will loads results through ajax
 * @todo Might make this more OOP and split up functionalities in different methods.
 */
var utils = require('./../utils');

module.exports.initialize = function() {
    
    jQuery('.atom-search').each( function(index) {
        
        var appear = jQuery(this).data('appear'),
            delay = jQuery(this).data('delay'),
            form = jQuery(this).find('.search-form'),
            length = jQuery(this).data('length'),
            loadIcon = '<i class="fa fa-spin fa-circle-o-notch"></i>',
            input = jQuery(this).find('.search-field'),
            more = jQuery(this).find('.atom-search-all'),
            moreLink = jQuery(more).attr('href'),
            none = jQuery(this).data('none'),
            number = jQuery(this).data('number'),
            results = jQuery(this).find('.atom-search-results'),
            self = this,
            timer = false,
            types = jQuery(this).data('types'),
            value = '';
        
        if( jQuery(this).hasClass('atom-search-ajax') ) {
        
            // Upon entering results, we'll look if we can search
            jQuery(input).keyup( function(event) {

                // Clear out the timer so we do not fire events immediately after each other once the delay is passed
                clearTimeout(timer);

                var currentEvent = event;

                // If we are surpassing our lengt and have a value, we go search
                if( event.currentTarget.value.length >= length && value != jQuery.trim(event.currentTarget.value) ) {

                    timer = setTimeout( function(event) {

                        value = currentEvent.currentTarget.value;
                        
                        // Substitute our more link
                        jQuery(more).attr('href', moreLink + encodeURI(value) );

                        utils.ajax({
                            data: {
                                action: 'public_search', 
                                appear: appear, 
                                none: none,
                                number: number,
                                search: value,
                                types: types
                            },
                            beforeSend: function() {
                                jQuery(form).append(loadIcon);    
                                jQuery(results).find('.atom-search-all').remove();    
                                jQuery(results).addClass('components-loading');    
                            },
                            success: function(response) {

                                if( wpc.debug )
                                    console.log(response); 

                                if( response.data ) {
                                    jQuery(results).fadeIn();
                                    jQuery(results).html(response.data);    
                                    jQuery(results).append(more);    
                                }

                                
                                // Sync scrollReveal with newly added items
                                if( typeof sr !== "undefined" ) {
                                    
                                    // Reinit if we have not initialzied
                                    if( sr.initialized === false )                                 
                                        utils.scrollReveal();
                                    
                                    sr.sync();                   
                                }

                            },
                            complete: function() {
                                jQuery(self).find('.fa-circle-o-notch').remove();
                                jQuery(results).removeClass('components-loading'); 
                            }
                        });

                    }, delay);

                // Else, we hide the thing
                } else {
                    jQuery(results).fadeOut();
                }    

            });
            
        }
        
        // If we have a smaller form, we can expand it
        jQuery(this).find('.atom-search-expand').click( function(event) {
            
            event.preventDefault();
            
            // Toggle display of expand
            jQuery(this).find('.fa').toggleClass('fa-search');
            jQuery(this).find('.fa').toggleClass('fa-times');
            
            jQuery(form).fadeToggle();
            jQuery(form).find('.search-field').focus();
            jQuery(results).fadeOut();
            jQuery(self).toggleClass('atom-search-expanded');
                                                       
        });
    });       
        
};
},{"./../utils":13}],8:[function(require,module,exports){
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
        
        // Show whats-app sharing on mobiles
        if( navigator.userAgent.toLowerCase().match(/(iphone|android|windows phone|iemobile|wpdesktop)/) ) {
            jQuery(this).find('.components-whatsapp').show();
        }        
        
    });       
        
};
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.molecule-header').each( function(index) {
    
        var current = jQuery(window).scrollTop(),
            height = jQuery(this).height(),
            self = this,
            up = false;
        
        if( jQuery(this).hasClass('molecule-header-fixed') ) {
            
            jQuery(this).next('.main').css({
                'paddingTop' : height
            });    
        }

        // Allows our header to behave as a headroom
        jQuery(window).scroll( function() {
            
            var position = jQuery(this).scrollTop();
            
            // Dynamic header classes
            if( jQuery(self).hasClass('molecule-header-fixed') ) {
                
                if( position > 5 ) {
                    jQuery(self).addClass('molecule-header-scrolled');
                    jQuery(self).removeClass('molecule-header-top');
                } else {
                    jQuery(self).removeClass('molecule-header-scrolled');
                    jQuery(self).addClass('molecule-header-top');
                }
                
                
            }

            // Headroom navigation
            if( jQuery(self).hasClass('molecule-header-headroom') ) {

                if( position > current && ! up ) {
                    jQuery(self).stop().slideToggle();
                    up = ! up;
                } else if( position < current && up ) {
                    jQuery(self).stop().slideToggle();
                    up = ! up;
                }

                current = position;

            }

        });
        
        
        // The behaviour of a cart element is different within headers
        jQuery('.molecule-header .atom-cart-icon').click( function(event) {
            event.preventDefault();
            jQuery(this).next('.atom-cart-content').fadeToggle();
        });
        
    });       
        
};
},{}],11:[function(require,module,exports){
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

                var element = jQuery(this).closest('.molecule-posts[data-id="' + id + '"]'),
                    target = jQuery(this).attr('href');

                /**
                 * Update our pagination and add the right classes
                 */
                jQuery(element).addClass('components-loading');

                // Load our data
                jQuery.get(target, function(data) {
                    var pagination = jQuery(data).find('.molecule-posts[data-id="' + id + '"] .atom-pagination'),
                        posts = jQuery(data).find('.molecule-posts[data-id="' + id + '"] .molecule-post'),
                        scrollHeight = jQuery('.molecule-header').hasClass('molecule-header-fixed') ? jQuery('.molecule-header').height() : 0;

                    jQuery(element).removeClass('components-loading');
                    jQuery(element).find('.molecule-posts-wrapper').html(posts);
                    jQuery(element).find('.atom-pagination').replaceWith(pagination);
                    
                    jQuery('html, body').animate({
                        scrollTop: jQuery(element).offset().top - (scrollHeight + 100)
                    }, 555);                 
                    
                    // Sync scrollReveal with newly added items
                    if( typeof sr !== "undefined" ) {
                        sr.sync();
                    }

                });             

            });
            
        }
        
        // Filtering (@todo)       
        
    });      
        
};
},{"./../utils":13}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
/**
 * Contains utility functions
 */

/* Simplified wrapper for ajax calls */
module.exports.ajax = function(options) {
    
    var options = options;
    
    options.data.nonce = wpc.nonce;
    options.type = 'POST';
    options.url = wpc.ajaxUrl;
    
    return jQuery.ajax(options);
    
};

/* Initialize scrollReveal */
module.exports.scrollReveal = function() {

    // Execute our scroll-reveal
    if( typeof ScrollReveal !== "undefined" ) {

        window.sr = ScrollReveal();

        sr.reveal( '.components-bottom-appear', { origin: 'bottom'}, 50 );
        sr.reveal( '.components-left-appear', { origin: 'left'}, 50 );
        sr.reveal( '.components-right-appear', { origin: 'right'}, 50 );
        sr.reveal( '.components-top-appear', { origin: 'top'}, 50 );
    }
    
};

/* Initialize parallax */
module.exports.parallax = function() {
    
    jQuery(window).scroll(function() {

        var scrollPosition  = jQuery(this).scrollTop();

        jQuery('.components-parallax').css({
            'backgroundPosition' : 'calc(50%) ' + 'calc(50% + ' + scrollPosition/5+"px" + ')'
        });

    });
    
};
},{}]},{},[1]);
