<?php
/**
 * Represents an post excerpt
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'style'     => 'default entry-content'
) );

if( ! isset($atom['excerpt']) ) {
    global $post;
    
    // Set our more to zero and retrieve the text before the more tag
    if( strpos($post->post_content, '<!--more-->') >= 1 ) {
        global $more; $more = 0; 
        $atom['excerpt'] = get_the_content(); 
    } else {
        $atom['excerpt'] = get_the_excerpt(); 
    }
    
} ?>

<div class="atom-excerpt <?php echo $atom['style']; ?>" itemprop="description">
    <?php 
        echo $atom['excerpt'];
    ?>             	
</div><!-- .entry-content -->