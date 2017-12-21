<?php
/**
 * Displays a generic WordPress sidebar
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'sidebars'  => array() // Accepts a multidimensional array with the sidebar names as values
) ); ?>

<aside class="molecule-sidebar <?php echo $atom['style']; ?>" itemscope="itemscope" itemtype="http://www.schema.org/WPSideBar" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    
    <?php 

        foreach( $atom['sidebars'] as $sidebar ) {

            if( is_active_sidebar($sidebar) ) { 
                dynamic_sidebar( $sidebar ); 
            }

        } 

    ?>
    
</aside>