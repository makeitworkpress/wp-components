<?php
/**
 * Returns a default logo
 * We also support some variants. The caveat is that we add some small requests for each logo
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'attributes'            => [
        'href'      =>  esc_url( home_url('/') ),
        'itemscope' => 'itemscope',
        'itemtype'  => 'http://schema.org/Organization',
    ],
    'alt'                   => __('Logo', 'components'),
    'default'               => ['src' => '', 'height' => '', 'width' => ''], // The logo src. Also accepts an image id
    'defaultTransparent'    => ['src' => '', 'height' => '', 'width' => ''], // The logo src for transparent headers
    'mobile'                => ['src' => '', 'height' => '', 'width' => ''], // The logo src for mobile display
    'mobileTransparent'     => ['src' => '', 'height' => '', 'width' => ''], // The logo src for mobile display for transparent headers
    'tablet'                => ['src' => '', 'height' => '', 'width' => ''], // The logo src for tablet display
    'tabletTransparent'     => ['src' => '', 'height' => '', 'width' => ''], // The logo src for tablet display for transparent headers
    'title'                 => esc_attr( get_bloginfo('name') ),
] ); 

if( ! is_int($atom['default']) && ! $atom['default']['src'] ) {
    return;
} 
    
$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<a <?php echo $attributes; ?>>
    <?php 
        foreach( ['mobile', 'mobileTransparent', 'tablet', 'tabletTransparent', 'default', 'defaultTransparent'] as $image ) {

            // Itemprop for the logo image
            $itemprop = '';

            if( $image == 'default' ) {
                $itemprop = $atom['attributes']['itemtype'] == 'http://schema.org/Organization' ? 'logo' : 'image';
            }
            
            // Retrieve the image as an attachment
            if( is_int($atom[$image]) ) {
                echo wp_get_attachment_image( $atom[$image], 'medium', false, array('itemprop' => $itemprop, 'class' => 'atom-logo-' . $image, 'alt' => $atom['alt']) );
            } else if( isset($atom[$image]['src']) && $atom[$image]['src'] && isset($atom[$image]['width']) && $atom[$image]['width'] && isset($atom[$image]['height']) && $atom[$image]['height'] ) {
                echo '<img class="atom-logo-' . $image . '" src="' . $atom[$image]['src'] . '" height="' . $atom[$image]['height'] . '" width="'. $atom[$image]['width'] . '" alt="' . $atom['alt']. '" itemprop="' . $itemprop . '" />';    
            }           

        } 
    ?>
    <meta itemprop="name" content="<?php echo $atom['title']; ?>" />  
</a>