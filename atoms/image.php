<?php
/**
 * Displays the default featured image
 */

// We should have a post thumbnail
if( ! has_post_thumbnail() )
    return;

// Atom values
$atom = wp_parse_args( $atom, array(
    'schema'    => 'image',
    'size'      => 'large',
    'style'     => 'default'
) );

$atom['image'] = get_the_post_thumbnail( null, $atom['size'], array('itemprop' => $atom['schema']) );

?>
<figure class="atom-image entry-image <?php echo $atom['style']; ?>">
    <?php echo $atom['image']; ?>
</figure>>