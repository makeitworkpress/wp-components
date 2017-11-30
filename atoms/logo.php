<?php
/**
 * Returns a default logo
 * We also support some variants. The caveat is that we add some small requests for each logo
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'alt'                => __('Logo', 'components'),
    'default'            => ['src' => '', 'height' => '', 'width' => ''], // The logo src
    'defaultTransparent' => ['src' => '', 'height' => '', 'width' => ''], // The logo src for transparent headers
    'mobile'             => ['src' => '', 'height' => '', 'width' => ''], // The logo src for mobile display
    'mobileTransparent'  => ['src' => '', 'height' => '', 'width' => ''], // The logo src for mobile display for transparent headers
    'scheme'             => 'http://schema.org/Organization',
    'tablet'             => ['src' => '', 'height' => '', 'width' => ''], // The logo src for tablet display
    'tabletTransparent'  => ['src' => '', 'height' => '', 'width' => ''], // The logo src for tablet display for transparent headers
    'title'              => esc_attr( get_bloginfo('name') ),
    'url'                => esc_url( home_url('/') )
) ); 

if( ! $atom['default']['src'] )
    return; ?>

<a class="atom-logo <?php echo $atom['style']; ?>" href="<?php echo $atom['url']; ?>" rel="home" itemscope="itemscope" itemtype="<?php echo $atom['scheme']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <?php 
        foreach( ['mobile', 'mobileTransparent', 'tablet', 'tabletTransparent', 'default', 'defaultTransparent'] as $image ) {

            // We should have either of these
            if( ! $atom[$image]['src'] || ! $atom[$image]['width'] || ! $atom[$image]['height'] ) {
                continue;
            }
    ?>
        <img class="atom-logo-<?php echo $image; ?>" src="<?php echo $atom[$image]['src']; ?>" height="<?php echo $atom[$image]['height']; ?>" width="<?php echo $atom[$image]['width']; ?>" alt="<?php echo $atom['alt']; ?>" />
    <?php
        } 
    ?>
    <meta itemprop="name" content="<?php echo $atom['title']; ?>" />  
</a>