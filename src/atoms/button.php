<?php
/**
 * Represents a button
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'attributes'    => [
        'href'   => 'post',
        'target' => '_self'
    ],
    'iconAfter'     => '',          // Icon before the button
    'iconBefore'    => '',          // Icon after the button
    'iconVisible'   => 'standard',  // When the icon becomes visible. Accepts standard or hover
    'label'         => '',          // The button label
    'size'          => ''           // Defines the size of the button. If set to none, displays a button without background, border and padding.
] ); 

// Buttons should have a label
if( ! $atom['label'] ) {
    return;
}

// Icon visibility
$atom['attributes']['class'] .= ' atom-button-' . $atom['iconVisible'];

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
    
    <?php if( $atom['iconBefore'] ) { ?> 
        <i class="fa fa-<?php echo $atom['iconBefore']; ?>"></i>
    <?php } ?>
    
    <span class="atom-button-label">
        <?php echo $atom['label']; ?>
    </span>
    
    <?php if( $atom['iconAfter'] ) { ?> 
        <i class="fa fa-<?php echo $atom['iconAfter']; ?>"></i>
    <?php } ?>
    
</a>