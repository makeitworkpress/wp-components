<?php
/**
 * Displays a social links component
 */
global $post;

// Atom values
$atom = wp_parse_args( $atom, array(
    'icons'  => array(
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
    'style'     => 'default',
    'titles'    => array()
) ); ?>

<div class="atom-social <?php echo $atom['style']; ?>">
    
    <?php foreach( $atom['urls'] as $network => $url ) { ?>
    
        <a class="atom-social-<?php echo esc_attr( $network ); ?>" href="<?php echo esc_url( $url ); ?>" target="_blank" rel="external">
            
            <?php isset( $atom['icons'][$network] ) { ?>
                <i class="fa fa-<?php echo $atom['icons'][$network]; ?>"></i>
            <?php } ?>
            
            <?php isset( $atom['titles'][$network] ) { ?>
                <span><?php echo $atom['titles'][$network]; ?></span>
            <?php } ?>
        </a>
    
    <?php } ?>
    
</div>