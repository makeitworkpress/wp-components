<?php
/**
 * Displays a generic footer for a post
 */

// Atom values
$molecule = wp_parse_args( $molecule, [
    'atoms'     => [],      // Accepts a multidimensional array with the element name as key and the value for the component variables
    'container' => true,    // Wrap this component in a container
    'video'     => ''       // Expects the url for a video for display a video background
] ); 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<footer <?php echo $attributes; ?>>
    
    <?php do_action( 'components_post_footer_before', $molecule ); ?>

    <?php if($molecule['video']) { ?>
        <div class="components-video-background-container">
            <video class="components-video-background" autoplay="autoplay" muted="muted" loop="loop" playsinline="playsinline" src="<?php echo esc_url($molecule['video']); ?>"></video>
        </div>
    <?php } ?>    
    
    <?php if( $molecule['container'] ) { ?>
         <div class="components-container"> 
    <?php } ?>    

        <?php do_action( 'components_post_footer_container_begin', $molecule ); ?> 
    
        <?php if( $molecule['atoms'] ) { ?>
            <div class="molecule-post-footer-atoms">

                <?php 
                    foreach( $molecule['atoms'] as $atom) { 
                        MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );
                    }
                ?>

            </div>
        <?php } ?> 

        <?php do_action( 'components_post_footer_container_end', $molecule ); ?>
             
    <?php if( $molecule['container'] ) { ?>
        </div> 
    <?php } ?>
    
    <?php do_action( 'components_post_footer_after', $molecule ); ?>

</footer>