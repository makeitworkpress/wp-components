<?php
/**
 * Displays a title component
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'link'      => '',          
    'schema'    => 'name',
    'tag'       => 'h1',
    'title'     => get_the_title()
) ); 

// Custom link to a post
if( $atom['link'] == 'post' )
    $atom['link'] = esc_url( get_permalink() ); ?>

<<?php echo $atom['tag']; ?> class="atom-title <?php echo $atom['style']; ?>" itemprop="<?php echo $atom['schema']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <?php if( $atom['link'] ) { ?>
        <a href="<?php echo $atom['link']; ?>" rel="bookmark">
    <?php } ?>
        <?php echo $atom['title']; ?>
    <?php if( $atom['link'] ) { ?>
        </a>
    <?php } ?>
</<?php echo $atom['tag']; ?>>