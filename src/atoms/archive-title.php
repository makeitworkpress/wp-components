<?php
/**
 * Represents a title in an archive
 */
global $wp_query;

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'custom'    => '',
    'types'     => [
        'author'    => __( 'Posts Author Archive: %s', WP_COMPONENTS_LANGUAGE ),
        'category'  => single_cat_title( '', false ),
        'day'       => sprintf( __( 'Daily Archives: %s', WP_COMPONENTS_LANGUAGE ), '<span>' . get_the_date() . '</span>' ),
        'default'   => isset(get_queried_object()->labels->name) ? get_queried_object()->labels->name : __( 'Blog Archives', WP_COMPONENTS_LANGUAGE ),
        'home'      => isset(get_queried_object()->post_title) ? get_queried_object()->post_title : __( 'Blog Archives', WP_COMPONENTS_LANGUAGE ),
        'month'     => sprintf( __( 'Monthly Archives: %s', WP_COMPONENTS_LANGUAGE ), '<span>' . get_the_date('F Y') . '</span>' ),
        'search'    => sprintf( 
            _n( '%1$s result for: %2$s', '%1$s results for: %2$s', $wp_query->found_posts, WP_COMPONENTS_LANGUAGE ),
            '<span>' . number_format_i18n( $wp_query->found_posts ) . '</span>',
            '<span>' . get_search_query() . '</span>'
        ),  
        'tag'       => sprintf( __( 'Posts tagged: %s', WP_COMPONENTS_LANGUAGE ) , '<span>' . single_tag_title( '', false ) . '</span>' ),
        'tax'       => single_term_title( '', false ),
        'year'      => sprintf( __( 'Yearly Archives: <span>%s</span>', WP_COMPONENTS_LANGUAGE ), get_the_date('Y') ),    
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
                    $title      = sprintf( __( 'Posts written by: %s', WP_COMPONENTS_LANGUAGE ),  '<span>' . $current->display_name . '</span>');
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