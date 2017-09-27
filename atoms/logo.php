<?php
/**
 * Returns a default logo
 * If developers only provide a src, the image element is rendered automatically. In that case, they need to provide a certain height and width
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'alt'               => __('Logo', 'components'),
    'logoHeight'        => '', 
    'image'             => '', // The logo src
    'mobile'            => '', // The logo src for mobile display
    'mobileTransparent' => '', // The logo src for transparent mobile display
    'scheme'            => 'http://schema.org/Organization',
    'title'             => esc_attr( get_bloginfo('name') ),
    'transparent'       => '', // The transparent logosrc
    'url'               => esc_url( home_url('/') ),
    'logoWidth'         => ''
) ); 

if( ! $atom['image'] )
    return; 

// If the height or width are not defined, we retrieve them with PHP. Throws an error if OpenSSL is not enabled!
if( ! $atom['logoHeight'] || ! $atom['logoWidth']) {
    list($width, $height) = getimagesize( $atom['image'] );
    $atom['logoHeight'] = $height;
    $atom['logoWidth'] = $width;
} 

// Declare our scrolled and mobile views
$data = array( 'mobile', 'mobileTransparent', 'transparent' );

// Our data attributes
foreach($data as $type) {
    if( $atom[$type] ) {
        $atom['data'] .= ' data-' . $type . '="' . $atom[$type]  . '"';
    }
}

// Additional class to hide the logo if we have data. This prevents flickering when the logo loads.
if( $atom['data'] ) {
    $atom['style'] .= ' atom-logo-data';
} ?>

<a class="atom-logo <?php echo $atom['style']; ?>" href="<?php echo $atom['url']; ?>" rel="home" itemscope="itemscope" itemtype="<?php echo $atom['scheme']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>

    <?php 
        // Default image
        if( $atom['image'] ) {
            echo '<img src="' . $atom['image'] . '" itemprop="image" height="' . $atom['logoHeight'] . '" width="' . $atom['logoWidth'] . '" alt="' . $atom['alt'] . '" />';    
        } 
    
    ?>
    <meta itemprop="name" content="<?php echo $atom['title']; ?>" />
    
</a>