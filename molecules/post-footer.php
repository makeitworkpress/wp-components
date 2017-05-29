<?php
/**
 * Displays a generic footer for a post
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'after'     => '', // Custom content at the end of the footer
    'atoms'     => array(), // Accepts a multidimensional array with the element name as key and the value for the component variables
    'before'    => '', // Custom content at the beginning of the footer  
    'container' => true,    // Wrap this component in a container
    'style'     => 'default entry-footer',
) ); ?>

<footer class="atom-post-footer <?php echo $atom['style']; ?>">
    
    <?php if( $atom['container'] ) { ?>
         <div class="container"> 
    <?php } ?>  
             
        <?php 
             if($atom['before'])
                echo $atom['before']; 
        ?>     
    
        <?php if( $atom['atoms'] ) { ?>
            <div class="atom-post-footer-elements">

                <?php 

                    foreach( $atom['atoms'] as $name => $variables ) { 

                        Components::atom( $name, $element );

                    } 

                ?>

            </div>
        <?php } ?>
             
        <?php 
             if($atom['after'])
                echo $atom['after']; 
        ?>            
             
    <?php if( $atom['container'] ) { ?>
        </div> 
    <?php } ?>

</footer>