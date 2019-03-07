<?php
/**
 * Displays a generic WordPress footer
 */

// Atom values
$molecule = MakeitWorkPress\WP_Components\Build::multiParseArgs( $molecule, [
    'attributes' => [
        'itemscope' => 'itemscope',
        'itemtype'  => 'http://schema.org/WPFooter'
    ],
    'atoms'     => [],   // Adds an array of elements to the footer socket
    'container' => true,    // Wrap this component in a container
    'gridGap'   => 'default',  
    'sidebars'  => []       // Accepts an array with the sidebar name as key and the grid for the value
] ); 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<footer <?php echo $attributes; ?>>
    
    <?php do_action( 'components_footer_before', $molecule ); ?>
    
    <?php if( $molecule['sidebars'] ) { ?>
        <div class="molecule-footer-sidebars <?php if( ! $molecule['container'] ) { ?> components-grid-wrapper components-grid-<?php echo $molecule['gridGap']; ?> <?php } ?>">

            <?php if( $molecule['container'] ) { ?>
                <div class="components-container components-grid-wrapper components-grid-<?php echo $molecule['gridGap']; ?>">
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

                        MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                    } 

                ?>
                    
            <?php if( $molecule['container'] ) { ?>
                </div>
            <?php } ?>
            
        </div>
    <?php } ?>
    
    <?php do_action( 'components_footer_after', $molecule ); ?>
    
</footer>