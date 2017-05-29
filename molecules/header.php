<?php
/**
 * Displays a generic WordPress header
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'container' => true,    // Wrap this component in a container
    'elements'  => array(), // Accepts a multidimensional array with the element name as key and the value for the component variables
    'socket'    => false,   // An extra bottom part in the header
    'style'     => 'default',
    'top'       => false,   // An extra top part in the header
) ); ?>

<header class="atom-header <?php echo $atom['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/WPHeader" role="banner">
    
    <?php if( $atom['top'] ) { ?>
        <div class="atom-header-top">
            
            <?php if( $atom['container'] ) { ?>
                 <div class="container"> 
            <?php } ?>                
            
                <?php echo $atom['header']; ?>
                     
            <?php if( $atom['container'] ) { ?>
                </div> 
            <?php } ?>
            
        </div>
    <?php } ?>
    
    <div class="atom-header-elements">
        
        <?php if( $atom['container'] ) { ?>
             <div class="container"> 
        <?php } ?>            
    
            <?php 

                foreach( $atom['elements'] as $name => $variables ) { 

                    Components::atom( $name, $element );

                } 

            ?>
        
    </div>
    
    <?php if( $atom['socket'] ) { ?>
        <div class="atom-header-socket">
            
            <?php if( $atom['container'] ) { ?>
                 <div class="container"> 
            <?php } ?>    
            
                <?php echo $atom['socket']; ?>
                     
            <?php if( $atom['container'] ) { ?>
                </div> 
            <?php } ?> 
            
        </div>
    <?php } ?>
    
</header>