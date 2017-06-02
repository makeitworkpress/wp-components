<?php
/**
 * Displays a pagination section
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'id'        => get_the_ID(),
    'meta'      => array(
        'category'   => array( 'after' => '', 'before' => '','icon' => 'folder', 'schema' => 'genre', 'seperator' => ', ' ),
        'post_tag'  => array( 'after' => '', 'before' => '','icon' => 'tags', 'schema' => 'keywords', 'seperator' => ', ' ),
    )
) ); 

// Retrieve our lists
foreach( $atom['meta'] as $taxonomy => $properties ) { 
    $atom['meta'][$taxonomy]['list'] = get_the_term_list( $atom['id'], $taxonomy, $properties['before'], $properties['seperator'], $properties['after'] );
} ?>

<div class="atom-meta entry-meta <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?>>
    <?php foreach( $atom['meta'] as $taxonomy => $properties ) { ?>
        <?php if( $properties['list'] ) { ?> 
            <div class="atom-meta-item entry-<?php echo $taxonomy; ?>" itemprop="<?php echo $properties['schema']; ?>">
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