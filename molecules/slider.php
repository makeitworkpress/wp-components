<?php
/**
 * Displays a slider component
 */

// Atom values
$molecule = wp_parse_args( $molecule, array(
    'duration'      => 5000,
    'position'      => 'normal',    // Keep the title and caption from the first slide
    'slides'        => array(),     // Supports a array with after, before, button, description, image, title and video as keys.
    'size'          => 'full',      // The default size for images
    'style'         => 'default',   // Supports default and fullscreen (fullscreen sized slider)
    'transition'    => 'fade',
    'titleTag'      => 'h2',
) ); 

if( ! wp_script_is('components-slider') || apply_filters('components_slider_script', true) )
    wp_enqueue_script('components-slider'); ?>

<ul class="atom-slider <?php echo $molecule['style']; ?>" data-duration="<?php echo $molecule['duration']; ?>" data-transition="<?php echo $molecule['transition']; ?>">
    
    <?php 
        /**
         * If we can keep the first title, we use it seperate from the slider. Ugggly, but it works!
         */
        if( $molecule['keepTitle'] ) { 
    ?>
    
        <?php if( isset($molecule['slides'][0]['title']) || isset($molecule['slides'][0]['caption']) ) { ?>
            <div class="atom-slider-caption atom-slider-caption-kept position-<?php echo $molecule['position']; ?>">
        <?php } ?> 
    
            <?php if( isset($molecule['slides'][0]['title']) ) { ?>
                <<?php echo $molecule['titleTag']; ?> class="atom-slider-title">
                    <?php echo $molecule['slides'][0]['title']; ?>
                </<?php echo $molecule['titleTag']; ?>>
            <?php } ?>

            <?php if( isset($molecule['slides'][0]['description']) ) { ?>
                <p class="atom-slider-description">
                    <?php echo $molecule['slides'][0]['description']; ?>
                </p>
            <?php } ?>
    
            <?php if( isset($molecule['slides'][0]['button']) ) { ?>
                <a class="" href="<?php echo $molecule['slides'][0]['button']['url']; ?>">
                    <?php echo $molecule['slides'][0]['button']['text']; ?>
                </a>
            <?php } ?>    
    
        <?php if( isset($molecule['slides'][0]['title']) || isset($molecule['slides'][0]['caption']) ) { ?>
            </div>
        <?php } ?>     
    
    <?php 
        
        } 

    ?>
    
    <?php foreach( $molecule['slides'] as $slide ) { ?> 

        <div class="atom-slider-caption position-<?php echo $slide['position']; ?>">
    
            <?php if( isset($slide['title']) ) { ?>
                <<?php echo $molecule['titleTag']; ?> class="atom-slider-title">
                    <?php echo $slide['title']; ?>
                </<?php echo $molecule['titleTag']; ?>>
            <?php } ?>

            <?php if( isset($slide['description']) ) { ?>
                <p class="atom-slider-description">
                    <?php echo $slide['description']; ?>
                </p>
            <?php } ?>
    
            <?php if( isset($slide['button']) ) { 
                
                Components::atom( 'button', array($slide['button']) );
            
            } ?>

            <?php if( isset($slide['image']) ) { 
                
                Components::atom( 'image', array($slide['image']) );
            
            } ?>

            <?php if( isset($slide['video']) ) { 
                
                Components::atom( 'video', array($slide['video']) );
            
            } ?> 
    

        </div>

    <?php } ?>

</ul>