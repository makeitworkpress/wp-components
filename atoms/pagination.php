<?php
/**
 * Displays a pagination section
 */
global $wp_query;

// Atom values
$atom = wp_parse_args( $atom, array(
    'current'       => '',
    'next'          => '&rsaquo;',
    'pagination'    => '',
    'prev'          => '&lsaquo;',
    'size'          => 2,
    'type'          => 'numbers',       // Accepts arrows, numbers or post (for in post navigation)
    'query'         => $wp_query
) ); 

// Pagination with numbers
if( $atom['type'] == 'numbers' && ! $atom['pagination'] ) {
    
    $atom['pagination'] = paginate_links( array(
        'base'      => str_replace( 999999999, '%#%', get_pagenum_link( 999999999 ) ),
        'current'   => is_numeric($atom['current']) ? $atom['current'] : max( 1, get_query_var('paged') ),
        'format'    => '/page/%#%',
        'mid_size'  => $atom['size'], 
        'next_text' => $atom['next'], 
        'prev_text' => $atom['prev'],      
        'total'     => $atom['query']->max_num_pages,
        'show_all'  => true
    ));
    
}

$atom['style'] .= ' atom-pagination-' . $atom['type'];

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
    
} ?>

<nav class="atom-pagination <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    
    <?php echo $atom['pagination']; ?>
    
</nav>