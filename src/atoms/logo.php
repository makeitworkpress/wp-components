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
    'default'               => ['src' => '', 'height' => '', 'width' => ''], // The logo src
    'defaultTransparent'    => ['src' => '', 'height' => '', 'width' => ''], // The logo src for transparent headers
    'mobile'                => ['src' => '', 'height' => '', 'width' => ''], // The logo src for mobile display
    'mobileTransparent'     => ['src' => '', 'height' => '', 'width' => ''], // The logo src for mobile display for transparent headers
    'scheme'                => 'http://schema.org/Organization',
    'tablet'                => ['src' => '', 'height' => '', 'width' => ''], // The logo src for tablet display
    'tabletTransparent'     => ['src' => '', 'height' => '', 'width' => ''], // The logo src for tablet display for transparent headers
    'title'                 => esc_attr( get_bloginfo('name') ),
    'url'                   => esc_url( home_url('/') )
] ); 

if( ! $atom['default']['src'] ) {
    return;
} 
    
$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<a <?php echo $attributes; ?>>
    <?php 
        foreach( ['mobile', 'mobileTransparent', 'tablet', 'tabletTransparent', 'default', 'defaultTransparent'] as $image ) {

            // We should have either of these
            if( ! $atom[$image]['src'] || ! $atom[$image]['width'] || ! $atom[$image]['height'] ) {
                continue;
            }

            // Itemprop for the logo image
            $itemprop = '';

            if($image == 'default' ) {
                $itemprop = $atom['attributes']['itemtype'] == 'http://schema.org/Organization' ? 'itemprop="logo"' : 'itemprop="image"';
            } 

    ?>
        <img class="atom-logo-<?php echo $image; ?>" src="<?php echo $atom[$image]['src']; ?>" height="<?php echo $atom[$image]['height']; ?>" width="<?php echo $atom[$image]['width']; ?>" alt="<?php echo $atom['alt']; ?>" <?php echo $itemprop; ?> />
    <?php
        } 
    ?>
    <meta itemprop="name" content="<?php echo $atom['title']; ?>" />  
</a>