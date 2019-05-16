<?php
/**
 * Represents a title in an archive
 */
global $wp_query;

// Atom values
$atom = wp_parse_args( $atom, [
    'custom'    => '',
    'types'     => [
        'author'    => __( 'Posts Author Archive: %s', 'components' ),
        'category'  => single_cat_title( '', false ),
        'day'       => sprintf( __( 'Daily Archives: %s', 'components' ), '<span>' . get_the_date() . '</span>' ),
        'default'   => isset(get_queried_object()->labels->name) ? get_queried_object()->labels->name : __( 'Blog Archives', 'components' ),
        'home'      => isset(get_queried_object()->post_title) ? get_queried_object()->post_title : __( 'Blog Archives', 'components' ),
        'month'     => sprintf( __( 'Monthly Archives: %s', 'components' ), '<span>' . get_the_date('F Y') . '</span>' ),
        'search'    => sprintf( 
            _n( '%1$s result for: %2$s', '%1$s results for: %2$s', $wp_query->found_posts, 'components' ),
            '<span>' . number_format_i18n( $wp_query->found_posts ) . '</span>',
            '<span>' . get_search_query() . '</span>'
        ),  
        'tag'       => sprintf( __( 'Posts tagged: %s', 'mt' ) , '<span>' . single_tag_title( '', false ) . '</span>' ),
        'tax'       => single_term_title( '', false ),
        'year'      => sprintf( __( 'Yearly Archives: <span>%s</span>', 'mt' ), get_the_date('Y') ),    
    ]
] ); 


$archiveTitle   = '';
$attributes     = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<h1 <?php echo $attributes; ?>>
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
                    $title      = sprintf( __( 'Posts written by: %s', 'components' ),  '<span>' . $current->display_name . '</span>');
                }

                $archiveTitle = $title;

            } 

        } 

        if( ! $archiveTitle ) {
            $archiveTitle = $atom['types']['default'];
        }
    
        if( $atom['custom'] ) {
            $archiveTitle = $atom['custom'];
        }

        echo $archiveTitle;
    
    ?>
</h1>