<?php
/**
 * Represents a button
 */

// Backward compatibility
$atom = MakeitWorkPress\WP_Components\Build::convert_camels($atom, ['iconAfter' => 'icon_after', 'iconBefore' => 'icon_before', 'iconVisible' => 'icon_visible']);

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, [
    'attributes'    => [
        'href'   => 'post',
        'target' => '_self'
    ],
    'icon_after'    => '',          // Icon before the button
    'icon_before'   => '',          // Icon after the button
    'icon_visible'  => 'standard',  // When the icon becomes visible. Accepts standard or hover
    'label'         => '',          // The button label
    'size'          => ''           // Defines the size of the button. If set to none, displays a button without background, border and padding.
] ); 

// Buttons should have a label
if( ! $atom['label'] ) {
    return;
}

// Icon visibility, but only if an icon is defined
if( $atom['icon_visible'] && ($atom['icon_after'] || $atom['icon_before']) ) {
    $atom['attributes']['class'] .= ' atom-button-' . $atom['icon_visible'];
}

// Default background
if( ! isset($atom['background']) ) {
    $atom['attributes']['class'] .= ' components-light-background';
}

// Adjusted class for the size
if( $atom['size'] ) {
    $atom['attributes']['class'] .= ' atom-button-' . $atom['size'];
}

// If we are still using the link attribute
if( isset($atom['link']) ) {
    $atom['attributes']['href'] = $atom['link'];
}

// Custom link to a post
if( $atom['attributes']['href'] == 'post' ) {
    $atom['attributes']['href'] = esc_url( get_permalink() ); 
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<a <?php echo $attributes; ?>>
    
    <?php if( $atom['icon_before'] ) { ?> 
        <i class="fa fa-<?php echo $atom['icon_before']; ?> hvr-icon"></i>
    <?php } ?>
    
    <span class="atom-button-label">
        <?php echo $atom['label']; ?>
    </span>
    
    <?php if( $atom['icon_after'] ) { ?> 
        <i class="fa fa-<?php echo $atom['icon_after']; ?> hvr-icon"></i>
    <?php } ?>
    
</a>