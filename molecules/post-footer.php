<?php
/**
 * Displays a generic footer for a post
 */

// Atom values
$molecule = wp_parse_args( $molecule, array(
    'after'     => '', // Custom content at the end of the footer
    'atoms'     => array(), // Accepts a multidimensional array with the element name as key and the value for the component variables
    'before'    => '', // Custom content at the beginning of the footer  
    'container' => true,    // Wrap this component in a container
    'style'     => 'default entry-footer',
) ); ?>

<footer class="molecule-post-footer <?php echo $molecule['style']; ?>">
    
    <?php do_action( 'components_post_footer_before', $molecule ); ?>
    
    <?php if( $molecule['container'] ) { ?>
         <div class="container"> 
    <?php } ?>  
             
        <?php 
             if($molecule['before'])
                echo $molecule['before']; 
        ?>     
    
        <?php if( $molecule['atoms'] ) { ?>
            <div class="molecule-post-footer-atoms">

                <?php 

                    foreach( $molecule['atoms'] as $name => $variables ) { 

                        Components::atom( $name, $variables );

                    } 

                ?>

            </div>
        <?php } ?>
             
        <?php 
             if($molecule['after'])
                echo $molecule['after']; 
        ?>            
             
    <?php if( $molecule['container'] ) { ?>
        </div> 
    <?php } ?>
    
    <?php do_action( 'components_post_footer_after', $molecule ); ?>

</footer>