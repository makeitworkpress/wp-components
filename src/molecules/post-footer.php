<?php
/**
 * Displays a generic footer for a post
 */

// Atom values
$molecule = wp_parse_args( $molecule, [
    'atoms'     => [], // Accepts a multidimensional array with the element name as key and the value for the component variables
    'container' => true     // Wrap this component in a container
] ); 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<footer <?php echo $attributes; ?>>
    
    <?php do_action( 'components_post_footer_before', $molecule ); ?>
    
    <?php if( $molecule['container'] ) { ?>
         <div class="components-container"> 
    <?php } ?>     
    
        <?php if( $molecule['atoms'] ) { ?>
            <div class="molecule-post-footer-atoms">

                <?php 

                    foreach( $molecule['atoms'] as $atom) { 

                        MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                    } 

                ?>

            </div>
        <?php } ?>          
             
    <?php if( $molecule['container'] ) { ?>
        </div> 
    <?php } ?>
    
    <?php do_action( 'components_post_footer_after', $molecule ); ?>

</footer>