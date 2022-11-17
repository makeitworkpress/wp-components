<?php
/**
 * Displays the date for a post
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, [
    'attributes' => [
        'datetime' => get_the_date('c'),
        'itemprop' => 'datePublished'   
    ],
    'date'      => get_the_date(),
    'schema'    => true,                    // If microdata is rendered or not
    'icon'      => '',
] ); 

if( ! $atom['schema'] ) {
    unset($atom['attributes']['itemprop']);
}

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<time <?php echo $attributes; ?>>
    <?php if( $atom['icon'] ) { ?>
        <i class="<?php echo $atom['icon'] ?> hvr-icon"></i>
    <?php } ?>
    <?php echo $atom['date'] ?>
</time>