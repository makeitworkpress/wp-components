<?php
/**
 * Displays a generic header for a post
 */

// Molecule values
$molecule = wp_parse_args( $molecule, array(
    'after'         => '',      // Custom content at the end of the header
    'atoms'         => array ('title' => array('tag' => 'h1') ), // Accepts a multidimensional array with the element name as key and the value for the component variables
    'before'        => '',      // Custom content at the beginning of the header
    'beforeAtoms'   => array(), // Accepts a multidimensional array with the element name as key and the value for the component variables
    'container'     => true,    // Wrap this component in a container
    'scroll'        => false,   // A scroll down button.
    'style'         => 'default entry-header',
    'title'         => array()  // Custom arguments for the title
) ); ?>

<header class="molecule-post-header <?php echo $molecule['style']; ?>">
    
    <?php do_action( 'components_post_header_before', $molecule ); ?>
    
    <?php if( $molecule['container'] ) { ?>
         <div class="container"> 
    <?php } ?>
             
        <?php 
             if($molecule['before'])
                echo $molecule['before']; 
        ?>               
    
        <?php if( $molecule['atoms'] ) { ?>
            <div class="molecule-post-header-atoms">

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
    
    <?php if( $molecule['scroll'] ) { ?>
        <a class="components-scroll-down" href="#"></a> 
    <?php } ?>  
    
    <?php do_action( 'components_post_header_after', $molecule ); ?>
    
</header>