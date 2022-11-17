<?php
/**
 * Displays a pagination section
 */
global $wp_query;

// Atom values
$atom = wp_parse_args( $atom, [
    'format'        => '/page/%#%', 
    'next'          => '&rsaquo;',
    'pagination'    => '',
    'prev'          => '&lsaquo;',
    'size'          => 2,
    'type'          => 'numbers',       // Accepts arrows, numbers or post (for in post navigation)
    'query'         => $wp_query
] ); 

// Pagination with numbers
if( $atom['type'] == 'numbers' && ! $atom['pagination'] ) {
    
    $atom['pagination'] = paginate_links( array(
        'base'      => str_replace( 999999999, '%#%', get_pagenum_link( 999999999 ) ),
        'current'   => isset($atom['query']->query_vars['paged']) && $atom['query']->query_vars['paged'] ? $atom['query']->query_vars['paged'] : max( 1, get_query_var('paged') ),
        'format'    => $atom['format'],
        'mid_size'  => $atom['size'], 
        'next_text' => $atom['next'], 
        'prev_text' => $atom['prev'],      
        'total'     => $atom['query']->max_num_pages
    ));
    
}

// Set our type as a class
$atom['attributes']['class'] .= ' atom-pagination-' . $atom['type'];

// Pagination with next and previous posts links. Only works in archives where a query is already set.
if( $atom['type'] == 'arrows' && ! $atom['pagination'] ) {

    $atom['pagination']  = get_previous_posts_link( $atom['prev'] ); 
    $atom['pagination'] .= get_next_posts_link( $atom['next'] );
    
}

// Pagination with next and previous posts links within a post
if( $atom['type'] == 'post' && ! $atom['pagination'] ) {
    
    if( $atom['next'] == '&rsaquo;' )
        $atom['next'] = '%title <span>&rsaquo;</span> ';
    
    if( $atom['prev'] == '&lsaquo;' )
        $atom['prev'] = '<span>&lsaquo;</span> %title';

    $atom['pagination']  = get_previous_post_link( '%link', $atom['prev'] ); 
    $atom['pagination'] .= get_next_post_link( '%link', $atom['next'] );
    
} 

// If our atom is empty, we just return
if( ! $atom['pagination'] ) {
    return;
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<nav <?php echo $attributes; ?>>
    <?php echo $atom['pagination']; ?>  
</nav>