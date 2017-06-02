<?php
/**
 * Displays the default featured image
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'enlarge'   => false,
    'image'     => '',      // Expects a custom image tag for the image, including the html.
    'link'      => '',      // A custom link from the image
    'rounded'   => false,
    'size'      => 'large'
) );

// Custom link to a post
if( $atom['link'] == 'post' )
    $atom['link'] = esc_url( get_permalink() );

if( $atom['enlarge'] )
    $atom['style'] .= ' atom-image-enlarge';

$atom['image'] = $atom['image'] ? $atom['image'] : get_the_post_thumbnail( null, $atom['size'], array('itemprop' => 'image') );

// We should have an image
if( ! $atom['image'] )
    return;

if( $atom['rounded'] ) 
    $atom['style'] .= ' components-rounded'; ?>

<figure class="atom-image <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?>>
    
    <?php if( $atom['link'] ) { ?>
        <a href="<?php echo $atom['link']; ?>" rel="bookmark">
    <?php } ?>
    
        <?php echo $atom['image']; ?>
    
    <?php if( $atom['link'] ) { ?>
        </a>
    <?php } ?>
    
</figure>