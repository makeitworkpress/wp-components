/**
 * Custom scripts for a search element
 * If enabled, the script will loads results through ajax
 * @todo Might make this more OOP and split up functionalities in different methods.
 */
var utils = require('./../utils');

module.exports.initialize = function() {
    
    jQuery('.atom-search').each( function(index) {
        
        var delay = jQuery(this).data('delay'),
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
            value = '';
        
        if( jQuery(this).hasClass('atom-search-ajax') ) {
        
            // Upon entering results, we'll look if we can search
            jQuery(input).keyup( function(event) {

                // Clear out the timer so we do not fire events immediately after each other once the delay is passed
                clearTimeout(timer);

                var currentEvent = event;

                if( event.currentTarget.value.length >= length && value != jQuery.trim(event.currentTarget.value) ) {

                    timer = setTimeout( function(event) {

                        value = currentEvent.currentTarget.value;
                        
                        // Substitute our more link
                        jQuery(more).attr('href', moreLink + encodeURI(value) );

                        utils.ajax({
                            data: {
                                action: 'publicSearch', 
                                none: none,
                                number: number,
                                search: value
                            },
                            beforeSend: function() {
                                jQuery(form).append(loadIcon);    
                                jQuery(results).find('.atom-search-all').remove();    
                                jQuery(results).addClass('components-loading');    
                            },
                            success: function(response) {

                                if( components.debug )
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