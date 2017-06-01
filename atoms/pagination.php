<?php
/**
 * Displays a pagination section
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'next'      => '&rsaquo;',
    'prev'      => '&lsaquo;',
    'size'      => 2
    'type'      => 'default'
) ); 

// Pagination with numbers
if( $type == 'default' && ! isset($atom['pagination']) ) {
    
    $atom['pagination'] = get_the_posts_pagination( array('mid_size' => $atom['size'], 'next_text' => $atom['next'], 'prev_text' => $atom['prev']) );
    
}

if( $type == 'numbers' && ! isset($atom['pagination']) ) {
    
    global $wp_query;
    
    $atom['pagination'] = paginate_links( array(
        'base'      => str_replace( 999999999, '%#%', get_pagenum_link( 999999999 ) ),
        'current'   => max( 1, get_query_var('paged') ),
        'format'    => '/page/%#%',
        'next_text' => $atom['next'], 
        'prev_text' => $atom['prev'],      
        'total'     => $wp_query->max_num_pages,
        'show_all'  => true
    ));
    
}

// Pagination with next and previous posts links
if( $type == 'links' && ! isset($atom['pagination']) ) {

    $atom['pagination']  = get_previous_posts_link( $atom['prev'] ); 
    $atom['pagination'] .= get_next_posts_link( $atom['next'] );
    
}

// Pagination with next and previous posts links within a post
if( $type == 'post' && ! isset($atom['pagination']) ) {

    $atom['pagination']  = get_the_post_pagination(); 
    
} ?>

<nav class="atom-pagination <?php echo $atom['style']; ?>">
    
    <?php echo $atom['pagination']; ?>
    
</nav>