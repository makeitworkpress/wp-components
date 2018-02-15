<?php
/**
 * Displays a subtitle component
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'attributes'    => [
        'itemprop' => 'description'
    ],
    'description'   => '',
    'schema'        => 'description',
    'tag'           => 'p',
 ] );

if( ! $atom['description'] ) {
    return; 
}
    
$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<<?php echo $atom['tag']; ?> <?php echo $attributes; ?>>
    <?php echo $atom['description']; ?>
</<?php echo $atom['tag']; ?>>