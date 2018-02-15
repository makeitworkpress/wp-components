<?php
/**
 * Displays a slider component based upon jQuery Flexslider
 */

// Molecule values
$molecule = MakeitWorkPress\WP_Components\Build::multiParseArgs( $molecule, [
    'attributes'    => [
        'data'      => [
            'id'    => uniqid() // Used to link the slider to it's variables
        ]   
    ],
    'options'       => [
        'animation'         => 'fade',      // Type of animation
        'animationSpeed'    => 500,         // Speed of animation
        'nextText'          => '<i class="fa fa-angle-right"></i>',  // Next indicator 
        'prevText'          => '<i class="fa fa-angle-left"></i>',  // Prev indicator
        'slideshowSpeed'    => 5000 ,       // Speed of slideshow
        'smoothHeight'      => false         // Smoothes the height
    ],
    'scheme'        => 'http://www.schema.org/CreativeWork',     
    'scroll'        => false,       // Adds a scrolldown button     
    'slides'        => [],          // Supports a array with class, position, background (url or color value), video, image and atoms as keys.   
    'thumbnailSize' => ''           // The default size for thumbnails. If set, this will also enable thumbnails. The images should be attachment ids and slides should have an image.             
 
] ); 

// Set our variables
if( $molecule['options'] ) {

    // Set our control navigation option
    if( $molecule['thumbnailSize'] ) {
        $molecule['options']['controlNav'] = 'thumbnails';
    }
    
    add_action( 'wp_footer', function() use($molecule) {
        echo '<script type="text/javascript">var slider' . $molecule['data']['attributes']['id'] . ' = ' . json_encode($molecule['options']) . ';</script>';    
    } );
    
}

// Enqueue our slider script
if( ! wp_script_is('components-slider') && apply_filters('components_slider_script', true) ) {
    wp_enqueue_script('components-slider'); 
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<div <?php echo $attributes; ?>>
    
    <?php do_action( 'components_slider_before', $molecule ); ?>
    
    <ul class="slides">
        
        <?php foreach( $molecule['slides'] as $slide ) { 
    
            // No class has been set 
            if( ! isset($slide['class']) )
                $slide['class'] = '';
        
            // Background in a slider
            if( isset($slide['background']) ) {
                if( isset($molecule['lazyload']) && $molecule['lazyload'] && strpos($slide['background'], 'http') === 0 ) {
                    $slide['background'] = 'data-src="' . $slide['background'] . '"';
                    $slide['class'] .= ' components-lazyload';
                } else {
                    $slide['background'] = strpos($slide['background'], 'http') === 0 ? 'style="background-image: url(' . $slide['background'] . ');"' : 'style="background-color: ' . $slide['background'] . ';"';
                }
            } else {
                $slide['background'] = '';   
            }

            // Thumbs
            $thumb = $molecule['thumbnailSize'] && isset($slide['image']['image']) && is_numeric($slide['image']['image']) ? 'data-thumb="' . wp_get_attachment_image_url( $slide['image']['image'], $molecule['thumbnailSize'] ) . '"' : '';

            // Position of elements
            $slide['position'] = isset($slide['position']) ? 'components-position-' . $slide['position'] : ''; ?>

            <li class="molecule-slide" itemscope="itemscope" itemtype="<?php echo $molecule['scheme']; ?>" <?php echo $thumb; ?>>
                
                <?php 
    
                    // Atoms
                    if( isset($slide['atoms']) ) { 
                
                ?> 

                    <div class="molecule-slide-wrapper <?php echo $slide['position']; ?> <?php echo $slide['class']; ?>" <?php echo $slide['background']; ?>>
                        <div class="molecule-slide-caption">

                            <?php

                                // Add our custom atoms for this caption                                
                                foreach( $slide['atoms'] as $atom ) {
                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );    
                                }
                            ?>

                        </div>
                    </div>

                <?php 

                    }

                    // Or... slide video or image
                    if( isset($slide['image']) ) { 
                        MakeitWorkPress\WP_Components\Build::atom( 'image', $slide['image'] );
                    } 
                    
                    if( isset($slide['video']) ) { 
                        MakeitWorkPress\WP_Components\Build::atom( 'video', $slide['video'] );
                    }

                ?>

            </li>

        <?php } ?>
        
    </ul>
    
    <?php 
    
        // Scroll-down button
        if( $molecule['scroll'] ) { 
            MakeitWorkPress\WP_Components\Build::atom( 'scroll', $molecule['scroll'] );
        }
    
    ?> 
    
    <?php do_action( 'components_slider_after', $molecule ); ?>

</div>