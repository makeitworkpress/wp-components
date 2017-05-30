<?php
/**
 * Displays a slider component based upon jQuery Flexslider
 */

// Molecule values
$molecule = wp_parse_args( $molecule, array(
    'data'          => '',
    'options'       => array(
        'animation'         => 'fade',      // Type of animation
        'animationSpeed'    => 500,         // Speed of animation
        'itemMargin'        => '',          // Margin between items
        'itemWidth'         => '',          // Allows for a carousel
        'minItems'          => '',          // Allows for a carousel
        'maxItems'          => '',          // Allows for a carousel
        'nextText'          => '&rsaquo;',  // Next indicator 
        'prevText'          => '&lsaquo;',  // Prev indicator
        'slideshowSpeed'    => 5000 ,       // Speed of slideshow
        'smoothHeight'      => true         // Smoothes the height
    ),
    'position'      => 'normal',    // Position of captions
    'slides'        => array(),     // Supports a array with after, before, button, description, image, title and video as keys.
    'size'          => 'full',      // The default size for images
    'style'         => 'default'    // Supports default and fullscreen (fullscreen sized slider)
) ); 

// Set the data options
if( ! $molecule['data'] ) {
    foreach( $molecule['options'] as $key => $option ) {
        $molecule['data'] .= ' data-' . $key . '="' . $option . '"';
    }
}

if( ! wp_script_is('components-slider') || apply_filters('components_slider_script', true) )
    wp_enqueue_script('components-slider'); ?>

<div class="molecule-slider <?php echo $molecule['style']; ?>" <?php echo $molecule['data']; ?>>
    
    <ul class="slides">
        
        <?php foreach( $molecule['slides'] as $slide ) { ?>

            <li class="molecule-slide" itemscope="itemscope" itemtype="http://www.schema.org/CreativeWork">

                <div class="molecule-slider-caption components-position-<?php echo $slide['position']; ?>">

                    <?php 

                        // Slide Title
                        if( isset($slide['title']) ) {
                            Components::atom( 'title', array($slide['title']) );
                        } 

                        // Slide Description
                        if( isset($slide['description']) ) { 
                            Components::atom( 'description', array($slide['description']) );
                        }

                        // Slide button Description                                
                        if( isset($slide['button']) ) { 
                            Components::atom( 'button', array($slide['button']) );
                        } 

                    ?>

                </div>

                <?php 

                    // Slide video or image
                    if( isset($slide['image']) ) { 
                        Components::atom( 'image', array($slide['image']) );
                    } elseif( isset($slide['video']) ) { 
                        Components::atom( 'video', array($slide['video']) );

                    }

                ?>

            </li>

        <?php } ?>
        
    </ul>

</div>