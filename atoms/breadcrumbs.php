<?php
/**
 * Represents any breadcrumb
 */
global $wp_query;

// Atom values
$atom = wp_parse_args( $atom, array(
    'archive'   => false,       // Shows an post archive link in the breadcrumbs if a post has one. Also accepts title/url array for custom values
    'crumbs'    => array(),
    'home'      => __('Home', 'components'), // Text to homepage
    'seperator' => '&rsaquo;',  // The seperator between breadcrumbs
    'taxonomy'  => false,       // Show taxonomy link within the breadcrumbs if a post has one
    'locations' => array(   // Locations for the breadcrumbs
        '404'       => __('404', 'components'),
        'archive'   => isset(get_queried_object()->labels->name) ? get_queried_object()->labels->name : '',
        'author'    => '',
        'category'  => single_cat_title( '', false),
        'day'       => get_the_date(),
        'month'     => get_the_date('F Y'),
        'page'      => get_the_title(),
        'search'    => sprintf( __('Search Results: %s', 'components'), urldecode(get_query_var('s')) ), 
        'single'    => get_the_title(),
        'tag'       => single_tag_title( '', false ),
        'tax'       => single_term_title( '', false ), 
        'year'      => get_the_date('Y')
    )
) ); 

// Return at the homepage
if( is_home() || is_front_page() ) 
    return; ?>

<nav class="atom-breadcrumbs <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?> role="navigation" itemscope="itemscope"  itemtype="http://schema.org/Breadcrumb">
    
    <ol itemscope="itemscope" itemtype="http://schema.org/BreadcrumbList">
        
        <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
            <a itemprop="item" href="<?php echo esc_url(get_home_url()); ?>">
                <span itemprop="name"><?php echo $atom['home']; ?></span>
            </a>
            <meta itemprop="position" content="1" />
        </li>        
        
    <?php 
        /**
         * Loop through our types and see what matches our condition, and subsequently build the breadcrumbs array.
         */
        foreach($atom['locations'] as $location => $title ) {

            // Condition for showing the archive                                           
            $condition = 'is_' . $location; 

            if( function_exists($condition) && $condition() ) {
                
                // Reset our breadcrumbs, key and url if multiple conditions are ttrue
                $breadcrumbs = array();
                $key         = 0;
                $url         = '';
                
                // Archives
                if( $location == '404' ) {
                    $url    = '#';
                }                  
                
                if( $location == 'archive' ) {
                    $url    = get_post_type_archive_link( get_queried_object()->name );
                }               
                
                // Author Archives
                if( $location == 'author' ) {
                    $author = get_userdata( get_query_var('author') );
                    $title  = $author->display_name;
                    $url    = get_author_posts_url( $author->ID );
                }
                
                // Data, Month or Yearly archives
                if( $location == 'day' || $location == 'month' || $location == 'year' ) {
                    $call   = 'get_' . $location . '_link';
                    $url    = $call();
                }                
                
                // Single or page
                if( $location == 'page' || $location == 'single' ) {
                    $url = get_permalink();  
    
                    global $post;
                     
                    // Archive link
                    if( $atom['archive'] && $location == 'single' ) {

                        $key = count($breadcrumbs);

                        if( isset($atom['archive']['title']) && isset($atom['archive']['url']) ) {
                            $breadcrumbs[$key]['title'] = $atom['archive']['title'];
                            $breadcrumbs[$key]['url']   = $atom['archive']['url'];                               
                        } else {
                            $breadcrumbs[$key]['title'] = get_post_type_object( $post->post_type )->labels->name;
                            $breadcrumbs[$key]['url']   = get_post_type_archive_link( $post->post_type ); 
                        }
                    }

                    // Ancestors can display if we do not display our taxonomies
                    $ancestors = get_ancestors($post->ID, $post->post_type);

                    if( ($ancestors && ! $atom['taxonomy']) || ($ancestors && $location == 'page') ) {
                        
                        $ancestors  = array_reverse($ancestors);
                        $key        = count($breadcrumbs);

                        foreach($ancestors as $ancestor) {
                            $breadcrumbs[$key]['title'] = get_the_title( $ancestor );
                            $breadcrumbs[$key]['url']   = get_permalink( $ancestor );
                            $key++;
                        }
                        
                    }                        

                    // If we list taxonomies
                    if( $atom['taxonomy'] && $location == 'single' ) {

                        $term = false;

                        if( $atom['taxonomy'] === true ) {

                            $taxonomies = get_post_taxonomies( $post );
                            $taxonomy   = $taxonomies ? $taxonomies[0] :  false;
                        } else {
                            $taxonomy = $atom['taxonomy'];
                        }

                        if( $taxonomy ) {
                            $terms = get_the_terms( $post, $taxonomy );
                            $term = $terms ? $terms[0] : false;
                        }

                        if( $term ) {

                            $key = count($breadcrumbs);

                            $breadcrumbs[$key]['title'] = $term->name;
                            $breadcrumbs[$key]['url']   = get_term_link( $term );                                

                            $ancestors = get_ancestors( $term->term_id, $taxonomy );

                            // Term ancestors
                            if( $ancestors ) {

                                foreach( $ancestors as $ancestor ) {
                                    $breadcrumbs[$key]['title'] = get_term( $ancestor )->name;
                                    $breadcrumbs[$key]['url']   = get_term_link( $ancestor );
                                    $key++;
                                }                                   

                            }
                        }

                    }                   
                    
                }                
                
                // Search
                if( $location == 'search' ) {
                    $url = get_search_link( get_query_var('s') );   
                }                
                
                // Terms
                if( $location == 'category' || $location == 'tag' || $location == 'tax' ) {
                    $url = get_term_link( get_queried_object() );
                    
                    $ancestors = get_ancestors( get_queried_object()->term_id, get_queried_object()->taxonomy );
                    
                    if( $ancestors ) {
                        
                        foreach( $ancestors as $key => $ancestor ) {
                            $breadcrumbs[$key]['title'] = get_term( $ancestor )->name;
                            $breadcrumbs[$key]['url']   = get_term_link( $ancestor );
                        }                         
                        
                    }
                }
                
                $key = count($breadcrumbs);
                
                // Basic url
                $breadcrumbs[$key]['title'] = $title;
                $breadcrumbs[$key]['url']   = $url;

            } 

        }
     
    // Allow breadcrumbs to be filtered    
    $breadcrumbs = apply_filters('components_breadcrumbs', $breadcrumbs);    

    // Build the breadcrumbs
    foreach( $breadcrumbs as $breadcrumb ) { ?>
        
        <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
            <span class="atom-breadcrumbs-seperator"><?php echo $atom['seperator']; ?></span>
            <a itemprop="item" href="<?php echo esc_url($breadcrumb['url']); ?>">
                <span itemprop="name"><?php echo $breadcrumb['title']; ?></span>
            </a>
            <meta itemprop="position" content="1" />
        </li>
        
    <?php } ?>
    </ol>
</nav>