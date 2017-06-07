<?php
/**
 * Returns a default logo
 * If developers only provide a src, the image element is rendered automatically. In that case, they need to provide a certain height and width
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'data'              => '', // The data attributes for the logo
    'height'            => '', 
    'image'             => '', // The logo src
    'mobile'            => '', // The logo src for mobile display
    'mobileScrolled'    => '', // The logo src for scrolled mobile display
    'scheme'            => 'http://schema.org/Organization',
    'scrolled'          => '', // The scrolled logosrc
    'title'             => esc_attr( get_bloginfo('name') ),
    'url'               => esc_url( home_url('/') ),
    'width'             => ''
) ); 

if( ! $atom['image'] )
    return; 

// If the height or width are not defined, we retrieve them with PHP
if( ! $atom['height'] || ! $atom['width']) {
    list($width, $height) = getimagesize( $atom['image'] );
    $atom['height'] = $height;
    $atom['width'] = $width;
} 

// Declare our scrolled and mobile views
$data = array( 'mobile', 'mobileScrolled', 'scrolled' );

foreach($data as $type) {
    if( $atom[$type] ) {
        $atom['data'] .= ' data-' . $type . '="' . $atom[$type]  . '"';
    }
} ?>

<a class="atom-logo" href="<?php echo $atom['url']; ?>" rel="home" itemscope="itemscope" itemtype="<?php echo $atom['scheme']; ?>" <?php echo $atom['inlineStyle']; ?>>

    <?php 
        // Default image
        if( $atom['image'] ) {
            echo '<img src="' . $atom['image'] . '" itemprop="image" height="' . $atom['height'] . '" width="' . $atom['width'] . '" ' . $atom['data'] . ' />';    
        } 
    
    ?>
    <meta itemprop="name" content="<?php echo $atom['title']; ?>" />
    
</a>