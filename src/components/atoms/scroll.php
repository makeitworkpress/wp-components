<?php
/**
 * Represents a scroll-down button
 */

// Atom values
$atom = wp_parse_args( $atom, [
    'icon'      => '',
    'top'       => false
] );  

// Scrolls to top
if( $atom['top'] ) {
    $atom['attributes']['class'] .= ' atom-scroll-top';
}

if( $atom['top'] && ! $atom['icon'] ) {
    $atom['icon'] = 'angle-up';
}

// If we have a custom icon, we add an style
if( $atom['icon'] ) {
    $atom['attributes']['class'] .= ' atom-scroll-hasicon'; 
}
    
$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>     

<a <?php echo $attributes; ?>>
    <?php if( $atom['icon'] ) { ?> 
        <i class="fa fa-<?php echo $atom['icon']; ?> fa-3x hvr-icon"></i>
    <?php } ?>
</a> 