<?php
/**
 * Displays a social links component
 */
global $post;

// Atom values
$atom = wp_parse_args( $atom, array(
    'background'        => true,
    'rounded'           => true,
    'icons'  => array(
        'email'         => 'envelope', 
        'facebook'      => 'facebook', 
        'instagram'     => 'instagram', 
        'twitter'       => 'twitter', 
        'linkedin'      => 'linkedin', 
        'google-plus'   => 'google-plus', 
        'pinterest'     => 'pinterest', 
        'reddit'        => 'reddit-alien', 
        'stumbleupon'   => 'stumbleupon',
    ),
    'urls'      => array(),
    'rounded'   => true,
    'style'     => 'default',   // Also accepts components-background
    'titles'    => array()
) ); 

if( $atom['rounded'] ) 
    $atom['style'] .= ' components-rounded';

if( $atom['background'] ) 
    $atom['style'] .= ' components-background'; ?>

<div class="atom-social <?php echo $atom['style']; ?>">
    
    <?php foreach( $atom['urls'] as $network => $url ) { ?>
    
        <a class="components-network components-<?php echo esc_attr( $network ); ?>" href="<?php echo esc_url( $url ); ?>" target="_blank" rel="author external">
            
            <?php if( isset($atom['icons'][$network]) ) { ?>
                <i class="fa fa-<?php echo $atom['icons'][$network]; ?>"></i>
            <?php } ?>
            
            <?php if( isset($atom['titles'][$network]) ) { ?>
                <span><?php echo $atom['titles'][$network]; ?></span>
            <?php } ?>
        </a>
    
    <?php } ?>
    
</div>