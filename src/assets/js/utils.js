/**
 * Contains utility functions
 */

/* Simplified wrapper for ajax calls */
module.exports.ajax = function(options) {
    
    var options = options;
    
    options.data.nonce = components.nonce;
    options.type = 'POST';
    options.url = components.ajaxUrl;
    
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

/* Initializes lazyload */
module.exports.lazyLoad = function() {
    
    if( typeof LazyLoad !== "undefined" && typeof wpOptimizeLazyLoad === 'undefined' ) {
        window.lazyload = new LazyLoad({
            elements_selector: ".lazy",
            callback_set: function (element) { 
                if( typeof(element.attributes['data-bg']) !== 'undefined' ) {
                    element.style.backgroundImage = element.attributes['data-bg'].nodeValue;
                }
            }
        });

    }
    
};