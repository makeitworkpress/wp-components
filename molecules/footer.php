<?php
/**
 * Displays a generic WordPress footer
 */

// Atom values
$molecule = wp_parse_args( $molecule, array(
    'container' => true,    // Wrap this component in a container
    'sidebars'  => array(), // Accepts a multidimensional array with the grid classes under the key grid and sidebar names under the key name
    'socket'    => false,
    'style'     => 'default',
) ); ?>

<footer class="molecule-footer <?php echo $molecule['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/WPFooter" role="contentinfo">
    
    <?php do_action( 'components_footer_before', $molecule ); ?>
    
    <?php if( $molecule['sidebars'] ) { ?>
        <div class="molecule-footer-sidebars">

            <?php if( $molecule['container'] ) { ?>
                <div class="container"> 
            <?php } ?>        

            <?php 

                foreach( $molecule['sidebars'] as $sidebar ) { 

                    if( is_active_sidebar($sidebar['name']) ) { ?> 

                        <aside class="molecule-footer-sidebar <?php echo $sidebar['grid']; ?>" role="complementary">
                            <?php dynamic_sidebar( $sidebar['name'] ); ?>
                        </aside>

                    <?php }

                } 

            ?>

            <?php if( $molecule['container'] ) { ?>
                </div>
            <?php } ?>                 

        </div>
    <?php } ?>
    
    <?php if( $molecule['socket'] ) { ?>
        <div class="molecule-footer-socket">
            
            <?php if( $molecule['container'] ) { ?>
                <div class="container"> 
            <?php } ?>              
            
                <?php echo $molecule['socket']; ?>
                    
            <?php if( $molecule['container'] ) { ?>
                </div>
            <?php } ?>
            
        </div>
    <?php } ?>
    
    <?php do_action( 'components_footer_after', $molecule ); ?>
    
</footer>