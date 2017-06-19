<?php
/**
 * Displays a generic header for a post
 */

// Molecule values
$molecule = wp_parse_args( $molecule, array(
    'atoms'         => array ('title' => array('tag' => 'h1', 'style' => 'entry-title') ), // Accepts a multidimensional array with the element name as key and the value for the component variables
    'container'     => true,    // Wrap this component in a container
    'scroll'        => false    // A scroll down button.
) ); ?>

<header class="molecule-post-header <?php echo $molecule['style']; ?>" <?php echo $molecule['inlineStyle']; ?>>
    
    <?php do_action( 'components_post_header_before', $molecule ); ?>
    
    <?php if( $molecule['container'] ) { ?>
         <div class="components-container"> 
    <?php } ?>
                          
        <?php if( $molecule['atoms'] ) { ?>
            <div class="molecule-post-header-atoms">

                <?php 

                    foreach( $molecule['atoms'] as $name => $variables ) { 

                        WP_Components\Build::atom( $name, $variables );

                    } 

                ?>

            </div>
        <?php } ?>             
             
    <?php if( $molecule['container'] ) { ?>
        </div> 
    <?php } ?>
    
    <?php 
    
        // Scroll-down button
        if( $molecule['scroll'] ) { 
            WP_Components\Build::atom( 'scroll', $molecule['scroll'] );
        }
    
    ?> 
    
    <?php do_action( 'components_post_header_after', $molecule ); ?>
    
</header>