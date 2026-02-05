<?php
/**
 * Map component template
 */
if (!wp_script_is('google-maps-js') && apply_filters('components_maps_script', true)) {
    wp_enqueue_script('google-maps-js');
}

add_action('wp_footer', function () use ($atom) {
    echo '<script type="text/javascript">
        var ' . $atom["id"] . '= {
            center: ' . json_encode($atom["center"]) . ',
            fit: ' . json_encode($atom["fit"]) . ',
            markers: ' . json_encode($atom["markers"]) . ',
            styles: ' . $atom["styles"] . ',
            zoom: ' . $atom["zoom"] . '
        }
    </script>';
});
?>

<div <?php echo $attributes; ?>>
    <div class="components-maps-canvas" data-id="<?php echo esc_attr($atom["id"]); ?>"></div>
</div>
