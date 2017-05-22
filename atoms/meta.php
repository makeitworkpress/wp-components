<?php
/**
 * Displays a pagination section
 */

global $post;

// Atom values
$atom = wp_parse_args( $atom, array(
    'id'        => $post->ID;
    'meta'      => array(
        'category'   => array( 'after' => '', 'before' => '','icon' => 'folder', 'schema' => 'genre', 'seperator' => ', ' ),
        'post_tags'  => array( 'after' => '', 'before' => '','icon' => 'tags', 'schema' => 'keywords', 'seperator' => ', ' ),
    ),
    'style'     => 'default'
) ); 

// Retrieve our lists
foreach( $atom['meta'] as $taxonomy => $properties ) { 
    $atom['meta'][$taxonomy]['list'] = get_the_term_list( $atom['id'], $taxonomy, $properties['before'], $properties['seperator'], $properties['after'] );
}

?>

<div class="atom-meta entry-meta <?php echo $atom['style']; ?>">
    
    <?php foreach( $atom['meta'] as $taxonomy => $properties ) { ?>
    
        <div class="atom-meta-item entry-<?php echo $taxonomy; ?>" itemprop="<?php echo $properties['schema']; ?>">
            
            <?php if( $properties['icon'] ) { ?>
                <i class="fa fa-<?php echo $properties['icon']; ?>"></i>
            <?php } ?>
            
            <?php echo $properties['list']; ?> 
            
        </div>
    
    <?php } ?>
    
</div>