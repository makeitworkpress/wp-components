<?php
/**
 * Displays a title component
 */

// Atom values
$atom =MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'attributes'    => [
        'itemprop' =>  'name',
    ],
    'link'          => '',          
    'tag'           => 'h1',
    'title'         => get_the_title()
] ); 

// Custom link to a post
if( $atom['link'] == 'post' ) {
    $atom['link'] = esc_url( get_permalink() ); 
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']);  ?>

<<?php echo $atom['tag']; ?> <?php echo $attributes; ?>>
    <?php if( $atom['link'] ) { ?>
        <a href="<?php echo $atom['link']; ?>" rel="bookmark" itemprop="url" title="<?php echo $atom['title']; ?>">
    <?php } ?>
        <?php echo $atom['title']; ?>
    <?php if( $atom['link'] ) { ?>
        </a>
    <?php } ?>
</<?php echo $atom['tag']; ?>>