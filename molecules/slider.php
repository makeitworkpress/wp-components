<?php
/**
 * Displays a slider component
 */

// Molecule values
$molecule = wp_parse_args( $molecule, array(
    'duration'      => 5000,
    'position'      => 'normal',    // Position of captions
    'slides'        => array(),     // Supports a array with after, before, button, description, image, title and video as keys.
    'size'          => 'full',      // The default size for images
    'style'         => 'default',   // Supports default and fullscreen (fullscreen sized slider)
    'transition'    => 'fade',
) ); 

if( ! wp_script_is('components-slider') || apply_filters('components_slider_script', true) )
    wp_enqueue_script('components-slider'); ?>

<ul class="molecule-slider <?php echo $molecule['style']; ?>" data-duration="<?php echo $molecule['duration']; ?>" data-transition="<?php echo $molecule['transition']; ?>">
    
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