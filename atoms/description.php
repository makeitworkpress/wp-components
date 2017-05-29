<?php
/**
 * Displays a subtitle component
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'description'   => '',
    'schema'        => 'description',
    'style'         => 'default',
    'tag'           => 'p',
) );

?>
<<?php echo $atom['tag']; ?> class="atom-subtitle <?php echo $atom['style']; ?>" itemprop="<?php echo $atom['schema']; ?>">
    <?php echo $atom['title']; ?>
</<?php echo $atom['tag']; ?>>