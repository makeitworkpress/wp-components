<?php
/**
 * Displays terms related to a post in a list
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'id'        => get_the_ID(),
    'taxonomies'      => [
        'category'      => [ 'after' => '', 'before' => '','icon' => 'folder', 'schema' => 'genre', 'seperator' => ', ' ],
        'post_tag'      => [ 'after' => '', 'before' => '','icon' => 'tags', 'schema' => 'keywords', 'seperator' => ', ' ]
    ]
] ); 

// Retrieve our lists
foreach( $atom['taxonomies'] as $taxonomy => $properties ) { 
    $atom['taxonomies'][$taxonomy]['list'] = get_the_term_list( $atom['id'], $taxonomy, $properties['before'], $properties['seperator'], $properties['after'] );
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
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