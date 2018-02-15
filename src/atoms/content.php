<?php
/**
 * Represents a post content or excerpt
 * Must be in the loop to work properly
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'attributes' => [
        'itemprop' => 'text'
    ],  
    'content'   => '',                      // Allows developers to set their own string of content 
    'pages'     => wp_link_pages( ['echo' => false] ),
    'type'      => 'content'                // Accepts content, excerpt;
] ); 

if( ! $atom['content'] ) {
    
    if( $atom['type'] == 'excerpt' ) {
        global $post;

        // Set our more to zero and retrieve the text before the more tag
        if( strpos($post->post_content, '<!--more-->') >= 1 ) {
            global $more; $more = 0; 
            $atom['content'] = wpautop( get_the_content() ); 
        } else {
            $atom['content'] = wpautop( get_the_excerpt() ); 
        }
    
    } elseif( $atom['type'] == 'content' ) {
        $atom['content'] = apply_filters( 'the_content', get_the_content() );
    }
    
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>  
    
    <?php 
        echo $atom['content'];

        // Linked pages within the content
        if( $atom['type'] == 'content' ) {
            echo $atom['pages'];
        }
    ?>             
             
</div><!-- .entry-content -->