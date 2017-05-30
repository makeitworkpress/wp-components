<?php
/**
 * Displays the default featured image
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'image'     => '',      // Expects a custom image tag for the image, including the html.
    'link'      => '',      // A custom link from the image
    'size'      => 'large',
    'style'     => 'default entry-image'
) );

// Custom link to a post
if( $atom['link'] == 'post' )
    $atom['link'] = esc_url( get_permalink() );

$atom['image'] = if( $atom['image'] ) ? $atom['image'] : get_the_post_thumbnail( null, $atom['size'], array('itemprop' => 'image') );

// We should have an image
if( ! $atom['image'] )
    return;

?>
<figure class="atom-image <?php echo $atom['style']; ?>">
    
    <?php if( $atom['link'] ) { ?>
        <a href="<?php echo $atom['link']; ?>" rel="bookmark">
    <?php } ?>
    
        <?php echo $atom['image']; ?>
    
    <?php if( $atom['link'] ) { ?>
        </a>
    <?php } ?>
    
</figure>>