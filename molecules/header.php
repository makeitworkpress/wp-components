<?php
/**
 * Displays a generic WordPress header
 */

// Molecule values
$molecule = wp_parse_args( $molecule, array(
    'container' => true,    // Wrap this component in a container
    'elements'  => array(), // Accepts a multidimensional array with the element name as key and the value for the component variables
    'socket'    => false,   // An extra bottom part in the header
    'style'     => 'default',
    'top'       => false,   // An extra top part in the header
) ); ?>

<header class="molecule-header <?php echo $molecule['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/WPHeader" role="banner">
    
    <?php do_action( 'components_header_before', $molecule ); ?>
    
    <?php if( $molecule['top'] ) { ?>
        <div class="molecule-header-top">
            
            <?php if( $molecule['container'] ) { ?>
                 <div class="container"> 
            <?php } ?>                
            
                <?php echo $molecule['header']; ?>
                     
            <?php if( $molecule['container'] ) { ?>
                </div> 
            <?php } ?>
            
        </div>
    <?php } ?>
    
    <div class="molecule-header-elements">
        
        <?php if( $molecule['container'] ) { ?>
             <div class="container"> 
        <?php } ?>            
    
            <?php 

                foreach( $molecule['elements'] as $name => $variables ) { 

                    Components::atom( $name, $element );

                } 

            ?>
                 
        <?php if( $molecule['container'] ) { ?>
            </div> 
        <?php } ?>                  
        
    </div>
    
    <?php if( $molecule['socket'] ) { ?>
        <div class="molecule-header-socket">
            
            <?php if( $molecule['container'] ) { ?>
                 <div class="container"> 
            <?php } ?>    
            
                <?php echo $molecule['socket']; ?>
                     
            <?php if( $molecule['container'] ) { ?>
                </div> 
            <?php } ?> 
            
        </div>
    <?php } ?>
    
    <?php do_action( 'components_header_after', $molecule ); ?>
    
</header>