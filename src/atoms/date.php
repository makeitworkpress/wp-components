<?php
/**
 * Displays the date for a post
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'attributes' => [
        'datetime' => get_the_date('c')   
    ],
    'date'      => get_the_date(),
    'icon'      => '',
    'schema'    => 'datePublished'
] ); 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<time class="atom-date <?php echo $atom['style']; ?>" datetime="<?php echo $atom['datetime']; ?>" itemprop="<?php echo $atom['schema']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <?php if( $atom['icon'] ) { ?>
        <i class="fa fa-<?php echo $atom['icon'] ?>"></i>
    <?php } ?>
    <?php echo $atom['date'] ?>
</time>