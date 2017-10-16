<?php
/**
 * Displays a generic WordPress header
 */

// Molecule values
$molecule = wp_parse_args( $molecule, array(
    'atoms'         => array(),     // Accepts a multidimensional array with the each of the atoms
    'container'     => true,        // Wrap this component in a container
    'fixed'         => true,        // If we have a fixed header
    'headroom'      => false,       // If we apply a headroom effect to the header
    'socketAtoms'   => array(),     // An extra bottom part in the header
    'transparent'   => false,       // If the header is transparent
    'topAtoms'      => array()      // An extra top part in the header
) ); 

if( $molecule['fixed'] ) 
    $molecule['style'] .= ' molecule-header-fixed';

if( $molecule['headroom'] ) 
    $molecule['style'] .= ' molecule-header-headroom';

if( $molecule['transparent'] ) 
    $molecule['style'] .= ' molecule-header-transparent'; ?>

<header class="molecule-header molecule-header-top <?php echo $molecule['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/WPHeader" <?php echo $molecule['inlineStyle']; ?> <?php echo $molecule['data']; ?>>
    
    <?php do_action( 'components_header_before', $molecule ); ?>
    
    <?php if( $molecule['topAtoms'] ) { ?>
        <div class="molecule-header-top-atoms">
            
            <?php if( $molecule['container'] ) { ?>
                 <div class="components-container"> 
            <?php } ?>                
            
                <?php 

                    foreach( $molecule['topAtoms'] as $atom ) { 

                        WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                    } 

                ?>
                     
            <?php if( $molecule['container'] ) { ?>
                </div> 
            <?php } ?>
            
        </div>
    <?php } ?>
    
    <?php if( $molecule['atoms'] ) { ?>
    
        <div class="molecule-header-atoms">

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
    
    <?php if( $molecule['socketAtoms'] ) { ?>
        <div class="molecule-header-socket-atoms">
            
            <?php if( $molecule['container'] ) { ?>
                 <div class="components-container"> 
            <?php } ?>    
            
                <?php 

                    foreach( $molecule['socketAtoms'] as $atom ) { 

                        WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                    } 

                ?>
                     
            <?php if( $molecule['container'] ) { ?>
                </div> 
            <?php } ?> 
            
        </div>
    <?php } ?>
    
    <?php do_action( 'components_header_after', $molecule ); ?>
    
</header>