<?php
/**
 * Displays a generic header for a post
 */

// Molecule values
$molecule = MakeitWorkPress\WP_Components\Build::multi_parse_args( $molecule, [
    'atoms'         => [
        'title' => [
            'atom'          => 'title', 
            'properties'    => [
                'tag'           => 'h1', 
                'attributes'    => ['class' => 'entry-title']
            ]
        ] 
    ],
    'container'     => true,    // Wrap this component in a container
    'scroll'        => false,   // A scroll down button.
    'video'         => ''       // Expects the url for a video for display a video background
] ); 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<header <?php echo $attributes; ?>>
    
    <?php do_action( 'components_post_header_before', $molecule ); ?>

    <?php if($molecule['video']) { ?>
        <div class="components-video-background-container">
            <video class="components-video-background" autoplay="autoplay" muted="muted" loop="loop" playsinline="playsinline" src="<?php echo esc_url($molecule['video']); ?>"></video>
        </div>
    <?php } ?>    
    
    <?php if( $molecule['container'] ) { ?>
         <div class="components-container"> 
    <?php } ?>

        <?php do_action( 'components_post_header_container_begin', $molecule ); ?> 
                          
        <?php if( $molecule['atoms'] ) { ?>
            <div class="molecule-post-header-atoms">

                <?php 

                    foreach( $molecule['atoms'] as $atom ) { 

                        MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                    } 

                ?>

            </div>
        <?php } ?> 

        <?php do_action( 'components_post_header_container_end', $molecule ); ?>
             
    <?php if( $molecule['container'] ) { ?>
        </div> 
    <?php } ?>
    
    <?php 
    
        // Scroll-down button
        if( $molecule['scroll'] ) { 
            MakeitWorkPress\WP_Components\Build::atom( 'scroll', $molecule['scroll'] );
        }
    
    ?> 
    
    <?php do_action( 'components_post_header_after', $molecule ); ?>
    
</header>