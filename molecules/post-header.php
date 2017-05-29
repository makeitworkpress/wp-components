<?php
/**
 * Displays a generic header for a post
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'after'         => '',      // Custom content at the end of the header
    'afterAtoms'    => array(), // Accepts a multidimensional array with the element name as key and the value for the component variables
    'before'        => '',      // Custom content at the beginning of the header
    'beforeAtoms'   => array(), // Accepts a multidimensional array with the element name as key and the value for the component variables
    'container'     => true,    // Wrap this component in a container
    'scroll'        => false,   // A scroll down button
    'style'         => 'default entry-header',
    'title'         => array()  // Custom arguments for the title
) ); ?>

<header class="atom-post-header <?php echo $atom['style']; ?>">
    
    <?php if( $atom['container'] ) { ?>
         <div class="container"> 
    <?php } ?>
             
        <?php 
             if($atom['before'])
                echo $atom['before']; 
        ?>               
    
        <?php if( $atom['beforeAtoms'] ) { ?>
            <div class="atom-post-header-before">

                <?php 

                    foreach( $atom['beforeAtoms'] as $name => $variables ) { 

                        Components::atom( $name, $element );

                    } 

                ?>

            </div>
        <?php } ?>
             
        <?php
             // Display our title!
             Components::atom('title', $atom['title']);
        ?>

        <?php if( $atom['afterAtoms'] ) { ?>     
            <div class="atom-post-header-after">

                <?php 

                    foreach( $atom['afterAtoms'] as $name => $variables ) { 

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
    

    <?php if( $atom['scroll'] ) { ?>
        <a class="scroll-down" href="#"></a> 
    <?php } ?>    
    
</header>