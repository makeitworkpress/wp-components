<?php
/**
 * Renders a Google Maps canvas
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'center'    => ['lat' => '52.090736', 'lng' => '5.121420'],      
    'id'        => 'wpcDefaultMap',    // Default ID to which map configurations are saved
    'markers'   => [],          // Use ['lat' => $lat, 'lng' => $lng] or ['address' => $address]
    'zoom'      => 12
] );

// Enqueue our slider script
if( ! wp_script_is('google-maps-js') && apply_filters('components_maps_script', true) ) {
    wp_enqueue_script('google-maps-js'); 
} 

// Localize
wp_localize_script('google-maps-js', $atom['id'], ['center' => $atom['center'], 'markers' => $atom['markers'], 'zoom' => $atom['zoom']]);

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    <canvas class="components-maps-canvas" data-id="<?php echo esc_attr($atom['id']);?>"></canvas> 
</div>