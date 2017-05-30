<?php
/**
 * Represents a post content or excerpt
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'content'   => '',                      // Allows developers to set their own string of content   
    'scheme'    => 'text',                  // Can also be set to description as a custom microscheme
    'style'     => 'default entry-content',
    'type'      => 'content',               // Accepts content, excerpt;
) ); 

if( ! $atom['content'] ) {
    
    if( $atom['type'] == 'excerpt' ) {
        global $post;

        // Set our more to zero and retrieve the text before the more tag
        if( strpos($post->post_content, '<!--more-->') >= 1 ) {
            global $more; $more = 0; 
            $atom['content'] = get_the_content(); 
        } else {
            $atom['content'] = get_the_excerpt(); 
        }
    
    } elseif( $atom['type'] == 'content' ) {
        $atom['content'] = get_the_content();
    }
    
} ?>

<div class="atom-content <?php echo $atom['style']; ?>" itemprop="<?php echo $atom['scheme']; ?>">
    <?php 
        echo $atom['content']; 
    ?>         	
</div><!-- .entry-content -->