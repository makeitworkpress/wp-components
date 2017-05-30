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