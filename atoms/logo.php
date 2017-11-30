<?php
/**
 * Returns a default logo
 * If developers only provide a src, the image element is rendered automatically. In that case, they need to provide a certain height and width
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'alt'               => __('Logo', 'components'),
    'image'             => ['src' => '', 'height' => '', 'width' => ''], // The logo src
    'mobileImage'       => ['src' => '', 'height' => '', 'width' => ''], // The logo src for mobile display
    'scheme'            => 'http://schema.org/Organization',
    'tabletImage'       => ['src' => '', 'height' => '', 'width' => ''], // The logo src for tablet display
    'title'             => esc_attr( get_bloginfo('name') ),
    'transparent'       => '', // The transparent logosrc
    'url'               => esc_url( home_url('/') )
) ); 

if( ! $atom['image'] )
    return; ?>

<a class="atom-logo <?php echo $atom['style']; ?>" href="<?php echo $atom['url']; ?>" rel="home" itemscope="itemscope" itemtype="<?php echo $atom['scheme']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>

    <?php 

        // Our mobile image
        if( $atom['mobileImage']['src'] ) {
            echo '<img class="atom-logo-mobile" src="' . $atom['mobileImage']['src'] . '" height="' .$atom['mobileImage']['height'] . '" width="' . $atom['mobileImage']['width'] . '" alt="' . $atom['alt'] . '" />';    
        }
        
         // Our mobile image
         if( $atom['tabletImage']['src'] ) {
            echo '<img class="atom-logo-tablet" src="' . $atom['tabletImage']['src'] . '" height="' .$atom['tabletImage']['height'] . '" width="' . $atom['tabletImage']['width'] . '" alt="' . $atom['alt'] . '" />';    
        }        

        // Default image
        if( $atom['image']['src'] ) {
            echo '<img class="atom-logo-default" src="' . $atom['image']['src'] . '" itemprop="image" height="' .$atom['image']['height'] . '" width="' . $atom['image']['width'] . '" alt="' . $atom['alt'] . '" />';    
        } 

        
    
    ?>
    <meta itemprop="name" content="<?php echo $atom['title']; ?>" />
    
</a>