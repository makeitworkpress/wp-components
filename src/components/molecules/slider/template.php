<?php
defined("ABSPATH") or die("Go eat veggies!");

$slider_id = esc_attr($molecule['attributes']['data']['id']);

// Set container option
$molecule['options']['container'] = '#' . $slider_id . 'Container';

// Thumbnail navigation option
if ($molecule['thumbnail_size']) {
    $molecule['options']['navAsThumbnails'] = true;
    $molecule['options']['navContainer'] = '#' . $slider_id . 'NavContainer';
}

// Output slider options as JS variable
add_action('wp_footer', function() use ($molecule, $slider_id) {
    echo '<script type="text/javascript">var slider' . esc_js($slider_id) . ' = ' . json_encode($molecule['options']) . ';</script>';
});

// Enqueue slider script
if (!wp_script_is('tinyslider') && apply_filters('components_slider_script', true)) {
    wp_enqueue_script('tinyslider');
}
?>

<div <?php echo $attributes; ?>>

    <?php do_action('components_slider_before', $molecule); ?>

    <ul class="slider" id="<?php echo $slider_id; ?>Container">

        <?php foreach ($molecule['slides'] as $slide) {
            // Default slide attributes
            $slide_atts = isset($slide['attributes']) ? $slide['attributes'] : [];
            $slide_atts = wp_parse_args($slide_atts, [
                'class' => '',
                'itemscope' => $molecule['schema'] ? 'itemscope' : false,
                'itemtype' => $molecule['schema'] ? 'http://www.schema.org/CreativeWork' : false,
            ]);
            $slide_atts['class'] .= ' molecule-slide-wrapper';
            $slide_attributes = MakeitWorkPress\WP_Components\Props::attributes($slide_atts);
        ?>

            <li class="slide">
                <div <?php echo $slide_attributes; ?>>

                    <?php if (isset($slide['atoms']) && $slide['atoms']) { ?>
                        <div class="molecule-slide-caption">
                            <?php
                                foreach ($slide['atoms'] as $atom) {
                                    MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties'] ?? []);
                                }
                            ?>
                        </div>
                    <?php } ?>

                    <?php
                        if (isset($slide['image'])) {
                            MakeitWorkPress\WP_Components\Build::atom('image', $slide['image']);
                        }

                        if (isset($slide['video'])) {
                            MakeitWorkPress\WP_Components\Build::atom('video', $slide['video']);
                        }
                    ?>

                </div>
            </li>

        <?php } ?>

    </ul>

    <?php
        if ($molecule['scroll']) {
            MakeitWorkPress\WP_Components\Build::atom('scroll', is_array($molecule['scroll']) ? $molecule['scroll'] : []);
        }
    ?>

    <?php if ($molecule['thumbnail_size']) { ?>
        <ul class="slider-thumbnails" id="<?php echo $slider_id; ?>NavContainer">
            <?php foreach ($molecule['slides'] as $slide) { ?>
                <?php if (isset($slide['image']['image']) && is_numeric($slide['image']['image'])) { ?>
                    <li class="slider-thumbnail"><?php echo wp_get_attachment_image($slide['image']['image'], $molecule['thumbnail_size'], false); ?></li>
                <?php } ?>
            <?php } ?>
        </ul>
    <?php } ?>

    <?php do_action('components_slider_after', $molecule); ?>

</div>
