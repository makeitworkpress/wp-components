<?php
/**
 * Displays a post type indicator
 */

// Atom values
$atom = wp_parse_args( $atom, [
    'name'  => '',
    'type'  => get_post_type()
] );

// Return if we do not have a type
if( ! $atom['type'] )
    return;

// Format our label
if( ! $atom['name'] ) {
    $postObject     = get_post_type_object( $atom['type'] );
    $atom['name']   = $postObject->labels->singular_name;
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    <?php echo $atom['name']; ?>
</div>