<?php
/**
 * Displays terms related to a post
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'id'        => get_the_ID(),
    'taxonomies'      => array(
        'category'   => array( 'after' => '', 'before' => '','icon' => 'folder', 'schema' => 'genre', 'seperator' => ', ' ),
        'post_tag'  => array( 'after' => '', 'before' => '','icon' => 'tags', 'schema' => 'keywords', 'seperator' => ', ' ),
    )
) ); 

// Retrieve our lists
foreach( $atom['taxonomies'] as $taxonomy => $properties ) { 
    $atom['taxonomies'][$taxonomy]['list'] = get_the_term_list( $atom['id'], $taxonomy, $properties['before'], $properties['seperator'], $properties['after'] );
} ?>

<div class="atom-termlist <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <?php foreach( $atom['taxonomies'] as $taxonomy => $properties ) { ?>
        <?php if( $properties['list'] ) { ?> 
            <div class="atom-termlist-item entry-<?php echo $taxonomy; ?>" itemprop="<?php echo $properties['schema']; ?>">
                <?php if( $properties['icon'] ) { ?>
                    <i class="fa fa-<?php echo $properties['icon']; ?>"></i>
                <?php } ?>
                <?php                                               
                    echo $properties['list']; 
                ?> 
            </div>  
        <?php } ?> 
    <?php } ?>
</div>