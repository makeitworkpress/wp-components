<?php
/**
 * Represents a scroll-down button
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'icon'      => '',
    'top'       => false
) );  

// Scrolls to top
if( $atom['top'] )
    $atom['style'] .= 'atom-scroll-top';

// If we have a custom icon, we add an style
if( $atom['icon'] ) 
    $atom['style'] .= ' atom-scroll-hasicon'; ?>     

<a class="atom-scroll <?php echo $atom['style']; ?>" href="#" <?php echo $atom['inlineStyle']; ?>>
    <?php if( $atom['icon'] ) { ?> 
        <i class="fa fa-<?php echo $atom['icon']; ?> fa-3x"></i>
    <?php } ?>
</a> 