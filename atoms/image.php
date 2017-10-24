<?php
/**
 * Displays the default featured image
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'enlarge'   => false,
    'image'     => '',      // Expects a custom image tag for the image, including the html.
    'lazyload'  => false,      // A custom link from the image
    'link'      => '',      // A custom link from the image
    'post'      => null,
    'rounded'   => false,
    'size'      => 'large'
) );

// Custom link to a post
if( $atom['link'] == 'post' )
    $atom['link']   = esc_url( get_permalink() );

if( $atom['enlarge'] )
    $atom['style'] .= ' atom-image-enlarge';

// If we have a lazyload, we add something to the class
$class              = $atom['lazyload'] ? ' components-lazyload' : '';

// Now, load our image based upon what we have
if( is_numeric($atom['image']) ) {
    $atom['image']  = wp_get_attachment_image( $atom['image'], $atom['size'], false, array('itemprop' => 'image', 'class' => $class) );
} elseif( is_string($atom['image']) ) {
    $atom['image']  = $atom['image'];
} elseif( empty($atom['image'] ) ) {
    $atom['image']  = get_the_post_thumbnail( $atom['post'], $atom['size'], array('itemprop' => 'image', 'class' => $class) );
}

// We have a lazyloading image, so we need to replace our attributes
if( $atom['lazyload'] ) {
    $atom['image']  = str_replace( 'src=', 'src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src=', $atom['image'] );   
    $atom['image']  = str_replace( 'srcset', 'data-srcset', $atom['image'] );   
}

// We should have an image
if( ! $atom['image'] )
    return;

if( $atom['rounded'] ) 
    $atom['style'] .= ' components-rounded'; ?>

<figure class="atom-image <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    
    <?php if( $atom['link'] ) { ?>
        <a href="<?php echo $atom['link']; ?>" rel="bookmark">
    <?php } ?>
    
        <?php echo $atom['image']; ?>
    
    <?php if( $atom['link'] ) { ?>
        </a>
    <?php } ?>
    
</figure>