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
<<?php echo $atom['tag']; ?> class="atom-description <?php echo $atom['style']; ?>" itemprop="<?php echo $atom['schema']; ?>">
    <?php echo $atom['description']; ?>
</<?php echo $atom['tag']; ?>>