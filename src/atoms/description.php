<?php
/**
 * Displays a subtitle component
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'description'   => '',
    'schema'        => 'description',
    'tag'           => 'p',
) );

if( ! $atom['description'] )
    return; ?>

<<?php echo $atom['tag']; ?> class="atom-description <?php echo $atom['style']; ?>" itemprop="<?php echo $atom['schema']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <?php echo $atom['description']; ?>
</<?php echo $atom['tag']; ?>>