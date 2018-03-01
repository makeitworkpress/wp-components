<?php
/**
 * Displays terms related to a post in a list
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'id'                => get_the_ID(),
    'taxonomies'        => [] // Accepts the following format: 'category' => ['after' => '', 'before' => '','icon' => 'folder', 'schema' => 'genre', 'seperator' => ', ']
] );

// Show our taxonomies if the standard array is empty
if( empty($atom['taxonomies']) ) {

    global $post;

    $taxonomies = get_post_taxonomies( $post );

    if( $taxonomies ) {
        foreach( $taxonomies as $taxonomy ) {

            // Scheme
            if( $taxonomy == 'category ' ) {
                $scheme                     = 'genre';
            } elseif( $taxonomy == 'post_tag' ) {
                $scheme                     = 'keywords';   
            } else {
                $scheme                     = '';
            }

            // Icons
            $icon = $taxonomy == 'post_tag' ? 'tag' : 'dot-circle-o';

            $atom['taxonomies'][$taxonomy]  = ['after' => '', 'before' => '','icon' => $icon, 'schema' => $scheme, 'seperator' => ', '];

        }
    }

}

// Retrieve our lists
foreach( $atom['taxonomies'] as $taxonomy => $properties ) { 
    $atom['taxonomies'][$taxonomy]['list'] = get_the_term_list( $atom['id'], $taxonomy, $properties['before'], $properties['seperator'], $properties['after'] );
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    <?php foreach( $atom['taxonomies'] as $taxonomy => $properties ) { ?>
        <?php if( $properties['list'] ) { ?> 
            <div class="atom-termlist-item entry-<?php echo $taxonomy; ?>" <?php if($properties['schema']) { echo 'itemprop="' . $properties['schema'] . '"'; } ?>">
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