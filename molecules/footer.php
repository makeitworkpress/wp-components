<?php
/**
 * Displays a generic WordPress footer
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'container' => true,    // Wrap this component in a container
    'sidebars'  => array(), // Accepts a multidimensional array with the grid classes under the key grid and sidebar names under the key name
    'socket'    => false,
    'style'     => 'default',
) ); ?>

<footer class="atom-footer <?php echo $atom['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/WPFooter" role="contentinfo">
    
    <?php if( $atom['sidebars'] ) { ?>
        <div class="atom-footer-sidebars">

            <?php if( $atom['container'] ) { ?>
                <div class="container"> 
            <?php } ?>        

            <?php 

                foreach( $atom['sidebars'] as $sidebar ) { 

                    if( is_active_sidebar($sidebar['name']) ) { ?> 

                        <aside class="atom-footer-sidebar <?php echo $sidebar['grid']; ?>" role="complementary">
                            <?php dynamic_sidebar( $sidebar['name'] ); ?>
                        </aside>

                    <?php }

                } 

            ?>

            <?php if( $atom['container'] ) { ?>
                </div>
            <?php } ?>                 

        </div>
    <?php } ?>
    
    <?php if( $atom['socket'] ) { ?>
        <div class="atom-footer-socket">
            
            <?php if( $atom['container'] ) { ?>
                <div class="container"> 
            <?php } ?>              
            
                <?php echo $atom['socket']; ?>
                    
            <?php if( $atom['container'] ) { ?>
                </div>
            <?php } ?>
            
        </div>
    <?php } ?>
    
</footer>