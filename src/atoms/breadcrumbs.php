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
    'taxonomy'  => false,       // Show taxonomy link within the breadcrumbs if a post has one. If set to true, takes the first related taxonomy of a post. If set to string value, takes that taxonomy.
    'locations' => array(       // Locations for the breadcrumbs
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
if( is_home() || is_front_page() ) {
    return; 
} ?>

<nav class="atom-breadcrumbs <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?> itemscope="itemscope"  itemtype="http://schema.org/Breadcrumb" <?php echo $atom['data']; ?>>
    
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
                    
                    if( is_archive('product') && class_exists('WooCommerce') ) {
                        $url    = get_the_title( wc_get_page_id( 'shop' ) );
                        $title  = get_the_title( wc_get_page_id( 'shop' ) );
                    }
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
                        } elseif( $post->post_type == 'product' && class_exists('WooCommerce') ) {
                            $breadcrumbs[$key]['title'] = get_the_title( wc_get_page_id( 'shop' ) );
                            $breadcrumbs[$key]['url']   = get_permalink( wc_get_page_id( 'shop' ) );                              
                        } else {
                            $breadcrumbs[$key]['title'] = get_post_type_object( $post->post_type )->labels->name;
                            $breadcrumbs[$key]['url']   = get_post_type_archive_link( $post->post_type ); 
                        }
                    }

                    // Page/Post Ancestors can display if we do not display our taxonomies
                    $ancestors = get_ancestors($post->ID, $post->post_type);

                    if( $ancestors && ! $atom['taxonomy'] ) {
                        
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
                        
                        // Products are an exception, we always look for the product category
                        if( $post->post_type == 'product' && class_exists('WooCommerce') ) {
                            
                            $terms      = get_the_terms( $post, 'product_cat' );
                            $term       = is_array($terms) ? $terms[0] : false;
                            $taxonomy   = 'product_cat';
                            
                        } else {

                            if( $atom['taxonomy'] === true ) {

                                $taxonomies = get_post_taxonomies( $post );
                                $taxonomy   = is_array($taxonomies) ? $taxonomies[0] :  false;
                            } else {
                                $taxonomy = $atom['taxonomy'];
                            }

                            if( $taxonomy ) {
                                $terms = get_the_terms( $post, $taxonomy );
                                $term = is_array($terms) ? $terms[0] : false;
                            }
                        }

                        // If we have a term, add it, including our children
                        if( $term ) {

                            $key = count($breadcrumbs);

                            // Term ancestors
                            $ancestors = get_ancestors( $term->term_id, $taxonomy );

                            if( $ancestors ) {

                                foreach( $ancestors as $ancestor ) {
                                    $breadcrumbs[$key]['title'] = get_term( $ancestor )->name;
                                    $breadcrumbs[$key]['url']   = get_term_link( $ancestor );
                                    $key++;

                                }                                   

                            }
                            
                            $breadcrumbs[$key]['title'] = $term->name;
                            $breadcrumbs[$key]['url']   = get_term_link( $term );                             
                            
                            // Term Children
                            $children = get_term_children( $term->term_id, $taxonomy );
                            
                            if( $children ) {
                                
                                $key = count($breadcrumbs);
                                
                                foreach( $children as $child ) {
                                    $breadcrumbs[$key]['title'] = get_term( $child )->name;
                                    $breadcrumbs[$key]['url']   = get_term_link( $child );
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
                    
                    /**
                     * We can prefix the post type for products or custom values
                     */
                    if( is_archive('product') && class_exists('WooCommerce') ) {
                        $key = count($breadcrumbs);
                        
                        $breadcrumbs[$key]['title'] = get_the_title( wc_get_page_id( 'shop' ) );
                        $breadcrumbs[$key]['url']   = get_permalink( wc_get_page_id( 'shop' ) );
                        
                    } elseif( isset($atom['archive']['title']) && isset($atom['archive']['url']) ) {
                        $key = count($breadcrumbs);

                        $breadcrumbs[$key]['title'] = $atom['archive']['title'];
                        $breadcrumbs[$key]['url']   = $atom['archive']['url'];                               
                    } 
                    
                    // Ancestors
                    $ancestors = get_ancestors( get_queried_object()->term_id, get_queried_object()->taxonomy );
                    
                    if( is_array($ancestors) && $ancestors ) {
                                       
                        $key        = count($breadcrumbs);
                        $ancestors  = array_reverse($ancestors);
                        
                        foreach( $ancestors as $ancestor ) {
                            $breadcrumbs[$key]['title'] = get_term( $ancestor )->name;
                            $breadcrumbs[$key]['url']   = get_term_link( $ancestor );
                            $key++;
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