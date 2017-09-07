<?php
/**
 * Retrieves post metadata from the key
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'after'     => '', // Custom string echoed before the meta information
    'before'    => '', // Custom string echoed after the meta information
    'key'       => '', // Key for retrieving meta information
    'id'        => get_the_ID(), // The post id
    'meta'      => '' //The meta information it self
) );

if( ! $atom['meta'] && $atom['key'] )
    $atom['meta'] = get_post_meta( $atom['id'], $atom['key'], true );

// Return if we do not have a video
if( ! $atom['meta'] )
    return; ?>

<div class="atom-meta <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <?php 
        // String before meta information
        if( $atom['before'] )
            echo $atom['before'];
        
        // Meta information itself    
        echo $atom['meta'];
         
        // Key afterwards    
        if( $atom['after'] )
            echo $atom['after']; 
    ?>
</div>