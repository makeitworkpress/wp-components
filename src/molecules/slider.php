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
    'scroll'        => false,       // Adds a scrolldown button     
    'slides'        => [],          // Supports a array with video, image and atoms as keys and the attribute key with class, position, background (url or color value).   
    'thumbnailSize' => ''           // The default size for thumbnails. If set, this will also enable thumbnails. The images should be attachment ids and slides should have an image.             
 
] ); 

// Set our variables
if( $molecule['options'] ) {

    // Set our control navigation option
    if( $molecule['thumbnailSize'] ) {
        $molecule['options']['controlNav'] = 'thumbnails';
    }
    
    add_action( 'wp_footer', function() use($molecule) {
        echo '<script type="text/javascript">var slider' . $molecule['attributes']['data']['id'] . ' = ' . json_encode($molecule['options']) . ';</script>';    
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

            // Attributes
            if( ! isset($slide['attributes']) ) {
                $slide['attributes'] = [];   
            }

            $slide['attributes'] = wp_parse_args( $slide['attributes'], [
                'class'     => '',
                'itemscope' => 'itemscope',
                'itemtype'  => 'http://www.schema.org/CreativeWork'
            ]);

            $slide['attributes']['class'] .= ' molecule-slide';

            // Thumbs
            if( $molecule['thumbnailSize'] && isset($slide['image']['image']) && is_numeric($slide['image']['image']) ) {
                $slide['attributes']['data']['thumb'] = wp_get_attachment_image_url( $slide['image']['image'], $molecule['thumbnailSize'] );
            }

            // Determine the attributes and default properties
            $slideProperties = MakeitWorkPress\WP_Components\Build::setDefaultProperties('slide', $slide);
            $slideAttributes = MakeitWorkPress\WP_Components\Build::attributes($slideProperties['attributes']); ?>

            <li <?php echo $slideAttributes; ?>>
                
                <?php 
    
                    // Atoms
                    if( isset($slide['atoms']) ) { 
                
                ?> 

                    <div class="molecule-slide-wrapper">
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