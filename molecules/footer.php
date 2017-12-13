<?php
/**
 * Displays a generic WordPress footer
 */

// Atom values
$molecule = wp_parse_args( $molecule, array(
    'atoms'     => false,   // Adds an array of elements to the footer socket
    'container' => true,    // Wrap this component in a container
    'sidebars'  => array()  // Accepts an array with the sidebar name as key and the grid for the value
) ); ?>

<footer class="molecule-footer <?php echo $molecule['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/WPFooter" <?php echo $molecule['inlineStyle']; ?> <?php echo $molecule['data']; ?>>
    
    <?php do_action( 'components_footer_before', $molecule ); ?>
    
    <?php if( $molecule['sidebars'] ) { ?>
        <div class="molecule-footer-sidebars <?php if( ! $molecule['container'] ) { ?> components-grid-wrapper <?php } ?>">

            <?php if( $molecule['container'] ) { ?>
                <div class="components-container components-grid-wrapper"> 
            <?php } ?>        

            <?php 

                foreach( $molecule['sidebars'] as $sidebar => $grid ) { 

                    if( is_active_sidebar($sidebar) ) { ?> 

                        <aside class="molecule-footer-sidebar <?php echo $grid ?>">
                            <?php dynamic_sidebar( $sidebar ); ?>
                        </aside>

                    <?php }

                } 

            ?>

            <?php if( $molecule['container'] ) { ?>
                </div>
            <?php } ?>                 

        </div>
    <?php } ?>
    
    <?php if( $molecule['atoms'] ) { ?>
        <div class="molecule-footer-socket">
            
            <?php if( $molecule['container'] ) { ?>
                <div class="components-container"> 
            <?php } ?>              
            
                <?php 

                    foreach( $molecule['atoms'] as $atom ) { 

                        WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                    } 

                ?>
                    
            <?php if( $molecule['container'] ) { ?>
                </div>
            <?php } ?>
            
        </div>
    <?php } ?>
    
    <?php do_action( 'components_footer_after', $molecule ); ?>
    
</footer>