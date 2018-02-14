<?php
/**
 * Represents a button
 */

// Atom values
$atom = wp_parse_args( $atom, [
    // 'attributes'    => ['href', 'target']  // This atom accepts an href button and target as one of the attributes   
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

$atom['attributes']['class'] .= ' atom-button-' . $atom['iconVisible'];

// Default background
if( ! isset($atom['background']) ) {
    $atom['attributes']['class'] .= ' components-light-background';
}

// Adjusted class for the size
if( $atom['size'] ) {
    $atom['attributes']['class'] .= ' atom-button-' . $atom['size'];
}

// Custom link to a post
if( $atom['href'] == 'post' ) {
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