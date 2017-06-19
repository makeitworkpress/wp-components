<?php
/**
 * Displays a generic WordPress header
 */

// Molecule values
$molecule = wp_parse_args( $molecule, array(
    'atoms'         => array(), // Accepts a multidimensional array with the atom name as key and the value for the component variables
    'container'     => true,    // Wrap this component in a container
    'fixed'         => true,    // If we have a fixed header
    'headroom'      => false,    // If we apply a headroom effect to the header
    'socketAtoms'   => false,   // An extra bottom part in the header
    'transparent'   => false,   // If the header is transparent
    'topAtoms'      => false    // An extra top part in the header
) ); 

if( $molecule['fixed'] ) 
    $molecule['style'] .= ' molecule-header-fixed';

if( $molecule['headroom'] ) 
    $molecule['style'] .= ' molecule-header-headroom';

if( $molecule['transparent'] ) 
    $molecule['style'] .= ' molecule-header-transparent'; ?>

<header class="molecule-header molecule-header-top <?php echo $molecule['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/WPHeader" role="banner" <?php echo $molecule['inlineStyle']; ?>>
    
    <?php do_action( 'components_header_before', $molecule ); ?>
    
    <?php if( $molecule['topAtoms'] ) { ?>
        <div class="molecule-header-top-atoms">
            
            <?php if( $molecule['container'] ) { ?>
                 <div class="components-container"> 
            <?php } ?>                
            
                <?php 

                    foreach( $molecule['topAtoms'] as $name => $variables ) { 

                        WP_Components\Build::atom( $name, $variables );

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

                    foreach( $molecule['atoms'] as $name => $variables ) { 

                        WP_Components\Build::atom( $name, $variables );

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

                    foreach( $molecule['socketAtoms'] as $name => $variables ) { 

                        WP_Components\Build::atom( $name, $variables );

                    } 

                ?>
                     
            <?php if( $molecule['container'] ) { ?>
                </div> 
            <?php } ?> 
            
        </div>
    <?php } ?>
    
    <?php do_action( 'components_header_after', $molecule ); ?>
    
</header>