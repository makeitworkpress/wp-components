<?php
/**
 * Returns a default logo
 * We also support some variants. The caveat is that we add some small requests for each logo
 */

// Backward compatibility
$atom = MakeitWorkPress\WP_Components\Build::convert_camels($atom, [
    'defaultTransparent'    => 'default_transparent', 
    'mobileTransparent'     => 'mobile_transparent', 
    'tabletTransparent'     => 'tablet_transparent'
]);

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, [
    'attributes'            => [
        'href'      =>  esc_url( home_url('/') ),
        'itemscope' => 'itemscope',
        'itemtype'  => 'http://schema.org/Organization',
    ],
    'alt'                   => __('Logo', WP_COMPONENTS_LANGUAGE),
    'default'               => ['src' => '', 'height' => '', 'width' => ''], // The logo src. Also accepts an image id
    'default_transparent'   => ['src' => '', 'height' => '', 'width' => ''], // The logo src for transparent headers
    'mobile'                => ['src' => '', 'height' => '', 'width' => ''], // The logo src for mobile display
    'mobile_transparent'     => ['src' => '', 'height' => '', 'width' => ''], // The logo src for mobile display for transparent headers
    'schema'                => true,        // If microdata is rendered or not
    'size'                  => 'medium',    // The default size of the fetched logo
    'tablet'                => ['src' => '', 'height' => '', 'width' => ''], // The logo src for tablet display
    'tablet_transparent'     => ['src' => '', 'height' => '', 'width' => ''], // The logo src for tablet display for transparent headers
    'title'                 => esc_attr( get_bloginfo('name') ),
    'url'                   => esc_url( get_bloginfo('url') )
] ); 

if( ! is_numeric($atom['default']) && ! isset($atom['default']['src']) ) {
    return;
} 

if( ! $atom['schema'] ) { 
    unset($atom['attributes']['itemscope']);    
    unset($atom['attributes']['itemtype']);    
}
    
$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<a <?php echo $attributes; ?>>
    <?php 
        foreach( ['mobile', 'mobile_transparent', 'tablet', 'tablet_transparent', 'default', 'default_transparent'] as $image ) {

            // Itemprop for the logo image
            $itemprop = '';

            if( $image == 'default' && $atom['schema'] ) {
                $itemprop = $atom['attributes']['itemtype'] == 'http://schema.org/Organization' ? 'logo' : 'image';
            }
            
            // Retrieve the image as an attachment
            if( is_numeric($atom[$image]) ) {
                
                $args = ['itemprop' => $itemprop, 'class' => 'atom-logo-' . $image, 'alt' => $atom['alt']];
                if( ! $atom['schema'] ) { 
                    unset($args['itemprop']);
                }
                echo wp_get_attachment_image( $atom[$image], $atom['size'], false, $args );

            } else if( isset($atom[$image]['src']) && $atom[$image]['src'] && isset($atom[$image]['width']) && $atom[$image]['width'] && isset($atom[$image]['height']) && $atom[$image]['height'] ) {
                
                $itemprop = $atom['schema'] ? 'itemprop="' . $itemprop . '"' : '';
                echo '<img class="atom-logo-' . $image . '" src="' . $atom[$image]['src'] . '" height="' . $atom[$image]['height'] . '" width="'. $atom[$image]['width'] . '" alt="' . $atom['alt']. '"' . $itemprop . '/>';    
            
            }           

        } 
    ?>
    <?php if( $atom['schema'] ) { ?>
        <meta itemprop="name" content="<?php echo $atom['title']; ?>" /> 
        <meta itemprop="url" content="<?php echo $atom['url']; ?>" /> 
    <?php } ?> 
</a>