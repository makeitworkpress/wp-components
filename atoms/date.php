<?php
/**
 * Displays the date for a post
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'date'      => get_the_date(),
    'datetime'  => get_the_date('c'),
    'schema'    => 'datePublished',
    'style'     => 'default',
) ); ?>

<time class="atom-date entry-time <?php echo $atom['style']; ?>" datetime="<?php echo $atom['datetime']; ?>" itemprop="<?php echo $atom['schema']; ?>">
    <?php echo $atom['date'] ?>
</time>