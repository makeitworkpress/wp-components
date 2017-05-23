<?php
/**
 * Displays a title component
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'schema'    => 'name',
    'style'     => 'default entry-title',
    'tag'       => 'h1',
    'title'     => get_the_title(),
) );

?>
<<?php echo $atom['tag']; ?> class="atom-title <?php echo $atom['style']; ?>" itemprop="<?php echo $atom['schema']; ?>">
    <?php echo $atom['title']; ?>
</<?php echo $atom['tag']; ?>>