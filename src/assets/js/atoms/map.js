const { minify } = require("uglify-js");

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
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false,
                zoom: parseInt(mapVars.zoom)
            },   
            map = new google.maps.Map(mapCanvas, mapOptions),
            markers = [],
            markerOptions = {
                draggable: false,
                map: map
            }; 
            
        // Exposes the map to the global scope so other scripts may act on it
        mapVars.map = map;

        if( ! mapVars.markers ) {
            return;
        }
            
        mapVars.markers.forEach( function(item, index) {

            var geocoder     = null;
                markerLatLng = null;
                markers[index] = new google.maps.Marker(markerOptions);

            // Geocodes the address
            if( typeof(item.address) !== 'undefined' && item.address ) {

                geocoder = geocoder !== null ? geocoder : new google.maps.Geocoder();

                geocoder.geocode( { 'address': item.address}, function(results, status) {
                    if (status == 'OK') {
                        markerLatLng = results[0].geometry.location
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
        mapBounds.extend(mapOptions.center);
        map.fitBounds(mapBounds);

    });

};