<?php
/**
 * Displays a generic WordPress sidebar
 */

// Atom values
$molecule = wp_parse_args( $molecule, array(
    'sidebars'  => array() // Accepts a multidimensional array with the sidebar names as values
) ); ?>

<aside class="molecule-sidebar <?php echo $molecule['style']; ?>" itemscope="itemscope" itemtype="http://www.schema.org/WPSideBar" role="complementary" <?php echo $molecule['inlineStyle']; ?>>
    
    <?php do_action( 'components_sidebar_before', $molecule ); ?>
    
    <?php 

        foreach( $molecule['sidebars'] as $sidebar ) {

            if( is_active_sidebar($sidebar) ) { 
                dynamic_sidebar( $sidebar ); 
            }

        } 

    ?>
    
    <?php do_action( 'components_sidebar_after', $molecule ); ?>
    
</aside>