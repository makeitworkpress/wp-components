<?php
/**
 * Displays a social links component
 */

// Atom values
$atom = wp_parse_args( $atom, [
    'colorBackground'   => true,
    'icons'  => [
        'email'         => 'envelope', 
        'telephone'     => 'phone', 
        'facebook'      => 'facebook', 
        'instagram'     => 'instagram', 
        'twitter'       => 'twitter', 
        'linkedin'      => 'linkedin',
        'youtube'       => 'youtube-play', 
        'pinterest'     => 'pinterest', 
        'dribbble'      => 'dribbble',
        'github'        => 'github',
        'behance'       => 'behance',
        'reddit'        => 'reddit-alien', 
        'stumbleupon'   => 'stumbleupon',
        'whatsapp'      => 'whatsapp'
    ],
    'hoverItem' => '', // Allows a hover.css class applied to each item. Requires hover to be set true in Boot().
    'urls'      => [],
    'titles'    => []
] ); 

if( $atom['colorBackground'] ) {
    $atom['attributes']['class'] .= ' components-background';
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    
    <?php foreach( $atom['urls'] as $network => $url ) { ?>

        <?php
            // Modify urls for mail and telephone
            if( $network == 'email' ) {
                $url = 'mailto:' . $url;
            }

            if( $network == 'telephone' ) {
                $url = 'tel:' . $url;    
            }
            
        ?>
    
        <a class="atom-network components-<?php echo esc_attr( $network ); ?><?php if($atom['hoverItem']) { ?> hvr-<?php echo $atom['hoverItem']; } ?>" href="<?php echo esc_url( $url ); ?>" target="_blank" rel="author external">
            <?php if( isset($atom['icons'][$network]) ) { ?>
                <i class="fa fa-<?php echo $atom['icons'][$network]; ?> hvr-icon"></i>
            <?php } ?>
            
            <?php if( isset($atom['titles'][$network]) ) { ?>
                <span><?php echo $atom['titles'][$network]; ?></span>
            <?php } ?>
        </a>
    
    <?php } ?>
    
</div>