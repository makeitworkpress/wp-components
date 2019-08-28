<?php
/**
 * Displays a slider component based upon jQuery Flexslider
 */

// Molecule values
$molecule = MakeitWorkPress\WP_Components\Build::multiParseArgs( $molecule, [
    'attributes'    => [
        'data'      => [
            'id'    => substr( str_shuffle(str_repeat("abcdefghijklmnopqrstuvwxyz", 5)), 0, 8 ) // Used to link the slider to it's variables
        ]   
    ],
    'options'       => [
        'arrowKeys'         => true,
        'autoHeight'        => true,
        'controlsText'      => ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],	
        'navPosition'       => 'bottom',
        'mode'              => 'carousel',      // Type of animation
        'mouseDrag'         => true,
        'speed'             => 500,             // Speed of animation
    ], 
    'scroll'        => false,       // Adds a scrolldown button     
    'slides'        => [],          // Supports a array with video, image and atoms as keys and the attributes key with common html attributes and common supported properties   
    'thumbnailSize' => ''           // The default size for thumbnails. If set, this will also enable thumbnails. The images should be attachment ids and slides should have an image.             
 
] ); 


// Set our container id so each script is initialized properly
$molecule['options']['container'] = '#' . $molecule['attributes']['data']['id'] . 'Container';

// Set our additional slider options
if( $molecule['options'] ) {

    // Set our control navigation option
    if( $molecule['thumbnailSize'] ) {
        $molecule['options']['navAsThumbnails'] = true;
        $molecule['options']['navContainer']    = '#' . $molecule['attributes']['data']['id'] . 'NavContainer';
    }
    
    // Add our scripts variables
    add_action( 'wp_footer', function() use($molecule) {
        echo '<script type="text/javascript">var slider' . $molecule['attributes']['data']['id'] . ' = ' . json_encode($molecule['options']) . ';</script>';    
    } );
    
}

// Enqueue our slider script
if( ! wp_script_is('tinyslider') && apply_filters('components_slider_script', true) ) {
    wp_enqueue_script('tinyslider'); 
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<div <?php echo $attributes; ?>>
    
    <?php do_action( 'components_slider_before', $molecule ); ?>
    
    <ul class="slider" id="<?php echo $molecule['attributes']['data']['id'] . 'Container'; ?>">
        
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

    <?php
        // Thumbnail navigation
        if( $molecule['thumbnailSize'] ) {
    ?>
        <ul class="slider-thumbnails" id="<?php echo $molecule['attributes']['data']['id'] . 'NavContainer'; ?>">
            <?php foreach( $molecule['slides'] as $slide ) { ?>
                <?php if( isset($slide['image']['image']) && is_numeric($slide['image']['image']) ) { ?>
                    <li class="slider-thumbnail"><?php echo wp_get_attachment_image( $slide['image']['image'], $molecule['thumbnailSize'], false); ?></li>
                <?php } ?>
            <?php } ?>
        </ul>   
    <?php } ?>     
    
    <?php do_action( 'components_slider_after', $molecule ); ?>

</div>