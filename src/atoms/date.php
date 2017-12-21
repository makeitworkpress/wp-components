<?php
/**
 * Displays the date for a post
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'date'      => get_the_date(),
    'datetime'  => get_the_date('c'),
    'icon'      => '',
    'schema'    => 'datePublished'
) ); ?>

<time class="atom-date <?php echo $atom['style']; ?>" datetime="<?php echo $atom['datetime']; ?>" itemprop="<?php echo $atom['schema']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <?php if( $atom['icon'] ) { ?>
        <i class="fa fa-<?php echo $atom['icon'] ?>"></i>
    <?php } ?>
    <?php echo $atom['date'] ?>
</time>