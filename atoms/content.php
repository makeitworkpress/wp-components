<?php
/**
 * Represents an post excerpt
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'style'     => 'default entry-content'
) ); ?>

<div class="atom-content <?php echo $atom['style']; ?>" itemprop="text">
    <?php 
        the_content(); 
    ?>         	
</div><!-- .entry-content -->