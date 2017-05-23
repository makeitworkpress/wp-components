<?php
/**
 * Returns a default logo
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'altImage'  => '', // The alternate logo image
    'image'     => '', // The logo img element
    'scheme'    => 'http://schema.org/Organization',
    'style'     => 'default',
    'title'     => esc_attr( get_bloginfo('name') ),
    'url'       => esc_url( home_url('/') )
) ); 

if( ! $atom['image'] )
    return; ?>

<a class="atom-logo" href="<?php echo $atom['url']; ?>" title="<?php echo $atom['title']; ?>" rel="home" itemscope="itemscope" itemtype="<?php echo $atom['scheme']; ?>">

    <?php 
        
        if( $atom['altImage'] ) {
            echo $atom['altImage']; 
        }
    
    ?>
    <meta itemprop="name" content="<?php echo $atom['title']; ?>" />
    
</a>