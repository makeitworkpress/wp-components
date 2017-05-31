<?php
/**
 * Represents a scroll-down button
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'icon'      => '',
    'style'     => 'default',
) );  

// If we have a custom icon, we add an style
if( $atom['icon'] ) 
    $atom['style'] .= ' atom-scroll-hasicon'; ?>     

<a class="atom-scroll <?php echo $atom['style']; ?>" href="#">
    <?php if( $atom['icon'] ) { ?> 
        <i class="fa fa-<?php echo $atom['icon']; ?>"></i>
    <?php } ?>
</a> 