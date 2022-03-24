import Component from "../types/component";

/**
 * Creates a Google Map
 */
const CustomMap: Component = {
    elements: document.getElementsByClassName('atom-map') as HTMLCollectionOf<HTMLElement>,
    init(): void {

        if( ! this.elements || this.elements.length < 1) {
            return;
        }
        
        for(const mapElement of this.elements) {
            this.setupMap(mapElement);
        }
    },

    /**
     * Setup a map
     * @param map The element for the map container
     */
    setupMap(mapElement: HTMLElement): void {

        if(typeof window.google === 'undefined') {
            return;
        }

        const canvas = mapElement.querySelector('.components-maps-canvas') as HTMLElement;

        if( ! canvas ) {
            return;
        }

        const attributes = window[canvas.dataset.id];
        const center = new google.maps.LatLng(parseFloat(attributes.center.lat), parseFloat(attributes.center.lng))
        const mapInstance = new google.maps.Map(canvas, {
            center,
            scrollwheel: false,
            styles: typeof attributes.styles !== 'undefined' ? attributes.styles : '',
            zoom: parseInt(attributes.zoom)
        });

        // The map instance is accessible through the global scope
        window[canvas.dataset.id].map = mapInstance;

        if( attributes.markers ) {
            this.setupMapMarkers(mapInstance, attributes.markers, attributes.fit, center);
        }

    },

    /**
     * Setup markers in a map
     * 
     * @param map The map instance
     * @param markers The unformatted marker input
     * @param fit Whether the markers should fit inside the map canvas
     * @param center The map center
     */
    setupMapMarkers(map: any, markers: any, fit: any, center: any): void {
        const bounds = new google.maps.LatLngBounds();
        const markerInstances: any = [];

        markers.forEach( (marker: any, index: number) => {
            let geocoder = null;
            let markerLatLng = null;
            
            markerInstances[index] = new google.maps.Marker({
                draggable: false,
                icon: typeof marker.icon !== 'undefined' ? marker.icon : '',
                map
            });

            // Geocode our marker when it has an address
            if(typeof marker.address !== 'undefined' && marker.address) {
                geocoder = geocoder !== null ? geocoder : new google.maps.Geocoder();
                geocoder.geocode({'address': marker.address}, (results: any, status: string) => {
                    if(status === 'OK') {
                        markerLatLng = results[0].geometry.location;
                    } else if( status !== 'OK' && window.wpc.debug) {
                        console.log('Geocoding of a map marker was not successfull: ' + status);
                    }
                });
            } else if(marker.lat && marker.lng) {
                markerLatLng = new google.maps.LatLng(parseFloat(marker.lat), parseFloat(marker.lng));
            }

            if( markerLatLng !== null ) {
                markerInstances[index].setPosition( markerLatLng );
                bounds.extend(markerLatLng);
            } 

        });  
        
        if( markerInstances.length < 1 || ! fit ) {
            return;
        }

        bounds.extend(center);
        map.fitBounds(bounds);

        // Define the minimum zoom to 15, even after bounds have changed
        google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            if(map.getZoom() > 15) {
                map.setZoom(15);
            }
        });
    }
};

export default CustomMap;