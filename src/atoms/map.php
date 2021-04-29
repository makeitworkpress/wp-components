<?php
/**
 * Renders a Google Maps canvas
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'center'    => ['lat' => '52.090736', 'lng' => '5.121420'],      
    'fit'       => true,
    'id'        => 'wpcDefaultMap',    // Default ID to which map configurations are saved
    'markers'   => [],          // Use ['lat' => $lat, 'lng' => $lng, 'icon' => 'icon.png'] or ['address' => $address, 'icon' => 'icon.png']
    'styles'    => '[]', // Custom map styles
    'zoom'      => 12
] );

// Enqueue our slider script
if( ! wp_script_is('google-maps-js') && apply_filters('components_maps_script', true) ) {
    wp_enqueue_script('google-maps-js'); 
} 

// Localize
add_action('wp_footer', function() use($atom) {
    echo '<script type="text/javascript">
        var ' . $atom['id'] . '= { 
            center: ' . json_encode($atom['center']) . ',
            fit: ' . json_encode($atom['fit']) . ',
            markers: ' . json_encode($atom['markers']) . ', 
            styles: ' . $atom['styles']. ',
            zoom: ' . $atom['zoom'] . 
        '}
    </script>';   
});

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    <div class="components-maps-canvas" data-id="<?php echo esc_attr($atom['id']);?>"></div>
</div>