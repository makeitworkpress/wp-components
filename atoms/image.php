<?php
/**
 * Displays the default featured image
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'image'     => '', // Custom image tag for the image
    'size'      => 'large',
    'style'     => 'default entry-image'
) );

$atom['image'] = if( $atom['image'] ) ? $atom['image'] : get_the_post_thumbnail( null, $atom['size'], array('itemprop' => 'image') );

// We should have an image
if( ! $atom['image'] )
    return;

?>
<figure class="atom-image <?php echo $atom['style']; ?>">
    <?php echo $atom['image']; ?>
</figure>>