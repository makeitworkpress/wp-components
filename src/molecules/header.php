<?php
/**
 * Displays a generic WordPress header
 */

// Molecule values
$molecule = MakeitWorkPress\WP_Components\Build::multiParseArgs( $molecule, [
    'atoms'         => [],          // Accepts a multidimensional array with the each of the atoms
    'attributes'    => [
        'class'     => 'molecule-header-top',
        'ítemscope' => 'itemscope',
        'itemtype'  => 'http://schema.org/WPHeader'
    ],
    'container'     => true,        // Wrap this component in a container
    'fixed'         => true,        // If we have a fixed header
    'headroom'      => false,       // If we apply a headroom effect to the header
    'socketAtoms'   => [],          // An extra bottom part in the header
    'transparent'   => false,       // If the header is transparent
    'topAtoms'      => [],          // An extra top part in the header
    'video'         => ''           // Expects the url for a video for display a video background
] ); 

if( $molecule['fixed'] ) {
    $molecule['attributes']['class'] .= ' molecule-header-fixed';
}

if( $molecule['headroom'] ) {
    $molecule['attributes']['class'] .= ' molecule-header-headroom';
}

if( $molecule['transparent'] ) {
    $molecule['attributes']['class'] .= ' molecule-header-transparent'; 
}
    
$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<header <?php echo $attributes; ?>>
    
    <?php do_action( 'components_header_before', $molecule ); ?>

    <?php if($molecule['video']) { ?>
        <div class="components-video-background-container">
            <video class="components-video-background" autoplay="autoplay" muted="muted" loop="loop" playsinline="playsinline" src="<?php echo esc_url($molecule['video']); ?>"></video>
        </div>
    <?php } ?>    

    <?php 
        if($molecule['video']) {
            MakeitWorkPress\WP_Components\Build::atom( 
                'video', 
                [
                    'attributes'    => ['class' => 'components-background-video', 'itemprop' => ''], 
                    'schema'        => false,
                    'src'           => esc_url($molecule['video'])
                ] 
            );    
        } 
    ?>    
    
    <?php if( $molecule['topAtoms'] ) { ?>
        <div class="molecule-header-top-atoms">
            
            <?php if( $molecule['container'] ) { ?>
                 <div class="components-container"> 
            <?php } ?>                
            
                <?php 

                    foreach( $molecule['topAtoms'] as $atom ) { 

                        MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

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

                        MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

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

                        MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                    } 

                ?>
                     
            <?php if( $molecule['container'] ) { ?>
                </div> 
            <?php } ?> 
            
        </div>
    <?php } ?>
    
    <?php do_action( 'components_header_after', $molecule ); ?>
    
</header>