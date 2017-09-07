<?php
/**
 * Represents a title in an archive
 */
global $wp_query;

$archiveTitle  = '';
$author = '';

// Atom values
$atom = wp_parse_args( $atom, array(
    'custom'    => '',
    'types'     => array(
        'author'    => sprintf( __( 'Posts written by: %s', 'components' ),  '<span>' . $author . '</span>' ),
        'category'  => single_cat_title( '', false ),
        'day'       => sprintf( __( 'Daily Archives: %s', 'components' ), '<span>' . get_the_date() . '</span>' ),
        'default'   => __( 'Blog Archives', 'components' ),
        'month'     => sprintf( __( 'Monthly Archives: %s', 'components' ), '<span>' . get_the_date('F Y') . '</span>' ),
        'search'    => sprintf( 
            _n( '%1$s result for: %2$s', '%1$s results for: %2$s', $wp_query->found_posts, 'components' ),
            '<span>' . number_format_i18n( $wp_query->found_posts ) . '</span>',
            '<span>' . get_search_query() . '</span>'
        ),  
        'tag'       => sprintf( __( 'Posts tagged: %s', 'mt' ) , '<span>' . single_tag_title( '', false ) . '</span>' ),
        'tax'       => single_term_title( '', false ),
        'year'      => sprintf( __( 'Yearly Archives: <span>%s</span>', 'mt' ), get_the_date('Y') ),    
    )
) ); ?>

<h1 class="atom-archive-title <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <?php 
        /**
         * Loop through our types and see what title matches
         */
        foreach($atom['types'] as $type => $title ) {

            // Condition for showing the archive                                           
            $condition = 'is_' . $type; 

            if( function_exists($condition) && $condition() ) {

                if( $type == 'author' ) {
                    $current    = get_query_var('author_name') ? get_user_by('slug', get_query_var('author_name') ) : get_userdata( get_query_var('author') );
                    $author     = $current->display_name;
                }

                $archiveTitle = $title;

            } 

        } 

        if( ! $archiveTitle )
            $archiveTitle = $atom['types']['default'];
    
        if( $atom['custom'] )
            $archiveTitle = $atom['custom'];

        echo $archiveTitle;
    
    ?>
</h1>