<?php
/**
 * Displays a post type indicator
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'name'  => '',
    'type'  => get_post_type()
) );

// Return if we do not have a video
if( ! $atom['type'] )
    return;

// Format our label
if( ! $atom['name'] ) {
    $postObject     = get_post_type_object( $atom['type'] );
    $atom['name']   = $postObject->labels->singular_name;
} ?>

<div class="atom-type <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?>>
    <?php echo $atom['name']; ?>
</div>