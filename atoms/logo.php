<?php
/**
 * Returns a default logo
 * If developers only provide a src, the image element is rendered automatically. In that case, they need to provide a certain height and width
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'altImage'  => '', // The alternate logo image element or src
    'height'    => '', 
    'image'     => '', // The logo img element or src
    'scheme'    => 'http://schema.org/Organization',
    'title'     => esc_attr( get_bloginfo('name') ),
    'url'       => esc_url( home_url('/') ),
    'width'     => '',
) ); 

if( ! $atom['image'] )
    return; ?>

<a class="atom-logo" href="<?php echo $atom['url']; ?>" title="<?php echo $atom['title']; ?>" rel="home" itemscope="itemscope" itemtype="<?php echo $atom['scheme']; ?>" <?php echo $atom['inlineStyle']; ?>>

    <?php 
        // Default image
        if( $atom['image'] )
            echo strpos($atom['image'], 'http') === 0 
                ? '<img src="' . $atom['image'] . '" itemprop="image" height="' . $atom['height'] . '" width="' . $atom['width'] . '" />' 
                : $atom['image'];     
        
        // Alternate image
        if( $atom['altImage'] )
            echo strpos($atom['altImage'], 'http') === 0 
                ? '<img src="' . $atom['altImage'] . '" itemprop="image" height="' . $atom['height'] . '" width="' . $atom['width'] . '" />' 
                : $atom['altImage'];   
    
    ?>
    <meta itemprop="name" content="<?php echo $atom['title']; ?>" />
    
</a>