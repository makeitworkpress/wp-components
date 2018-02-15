<?php
/**
 * Displays a generic post grid or list
 * This element is kinda ugly, but just has to have a lot of options
 */

// Atom values
$molecule = MakeitWorkPress\WP_Components\Build::multiParseArgs( $molecule, [
    'ajax'              => true,                        // To paginate using ajax
    'attributes'        => [
        'data'              => ['id' => 'molecule-posts'],  // Used to match requests for ajax. Must be unique if multiple elements are on one page,
        'itemscope'         => 'itemscope',             
        'itemtype'          => 'http://schema.org/Blog'
    ],
    'blogSchemes'       => true,                        // Indicates if we put author and other schema.org data within a blog bost
    'contentAtoms'      => [                            // Accepts a set of atoms for within the content
        [ 
            'atom'          => 'content', 
            'properties'    => ['type' => 'excerpt'] 
        ]
    ],
    'filter'            => false,                       // Adds a custom filter for a certain taxonomy. Accepts a certain taxonomy name in an array.
    'footerAtoms'       => [                            // Accepts a set of atoms
        [
            'atom'          => 'button', 
            'properties'    => ['link' => 'post', 'label' => __('View post', 'components'), 'size' => 'small', 'float' => 'right'] 
        ]
    ],                                           
    'headerAtoms'       => [                            // Accepts a set of atoms
        [
            'atom'          => 'title', 
            'properties'    => ['tag' => 'h2', 'link' => 'post', 'style' => 'entry-title', 'schema' => 'name headline'] 
        ] 
    ],          
    'image'             => [ 'link' => 'post', 'size' => 'medium', 'enlarge' => true ],
    'infinite'          => false,    
    'logo'              => 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    'none'              => __('Bummer! No posts found.', 'components'),
    'organization'      => get_bloginfo('name'),
    'postAttributes'    => [
        'itemprop'          => 'itemprop="blogPost"',
        'itemscope'         => 'itemscope',
        'itemtype'          => 'http://schema.org/BlogPosting'
    ],
    'pagination'        => ['type' => 'numbers'],           // Pagination settings.
    'query'             => [],                              // Accepts a custom query for posts. Pretty useful in existing WordPress templates. 
    'queryArgs'         => [],                              // Query arguments for retrieving posts
    'view'              => 'list'                           // Type of display. Accepts list, grid or a custom class.
] );

// Query vars for pagination
if( get_query_var('paged') ) {
    $molecule['queryArgs']['paged']     = get_query_var('paged');
}

// Get our posts
if( ! $molecule['query'] ) {
    $molecule['query']                  = new WP_Query( $molecule['queryArgs'] );
}

// Set the query for our pagination
if( $molecule['pagination'] ) {
    $molecule['pagination']['query']    = $molecule['query'];
}

// Output our arguments if we have a filter
if( $molecule['filter'] ) {
    add_action('wp_footer', function() use ($molecule) {
        echo '<script type="text/javascript"> var posts' . $molecule['attributes']['data']['id'] . '=' . json_encode($molecule) . ';</script>';
    });
}

// Ajax pagination
if( $molecule['ajax'] ) {
    $molecule['attributes']['class']   .= ' molecule-posts-ajax'; 
}

// Display style
if( $molecule['view'] ) {
    $molecule['attributes']['class']   .= ' molecule-posts-' . $molecule['view']; 
}

// Individal posts grid
if( $molecule['postsGrid'] ) {
    $molecule['wrapper']               .= ' components-grid-wrapper'; 
}

// Infinite scroll
if( $molecule['infinite'] ) { 
    $molecule['attributes']['class']   .= ' molecule-posts-infinite'; 
} 

// Fallback if a users by accident removes the pagination and we have infinite or ajax pagination
if( $molecule['infinite'] ) {
    $molecule['pagination']['size']     = 99999; 
    $molecule['pagination']['type']     = 'numbers'; 
}

// Alternate schemes for blogposting
if( strpos($molecule['itemtype'], 'BlogPosting') ) {
    $molecule['itemprop']               = 'itemprop="blogPost"'; 
    $molecule['itemscheme']             = 'itemscope="itemscope" itemtype="http://schema.org/Blog"'; 
} 
// Key for counting grid patterns
$key = 0; 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<div <?php echo $attributes; ?>>
    
    <?php do_action( 'components_posts_before', $molecule ); ?>
    
    <?php 
        // Filter
        if( $molecule['filter'] ) { 
            MakeitWorkPress\WP_Components\Build::atom( 'terms', $molecule['filter'] );
        } 
    ?>
    
    <div class="molecule-posts-wrapper">
        
        <?php if( $molecule['query']->have_posts() ) { ?>
        
            <?php while( $molecule['query']->have_posts() ) { ?>

                <?php

                    // Set-up our post data
                    $molecule['query']->the_post();
                    $id                                         = get_the_ID();
                    $molecule['postAttributes']['class']        = get_post_class('molecule-post', $id);
                    
                    // Allows for grid patterns with an array
                    if( isset($molecule['postAttributes']['grid']) && is_array($molecule['postAttributes']['grid']) ) {
                        $molecule['postAttributes']['class']   .= ' components-' . $molecule['postsGrid'][$key] . '-grid';
                    }

                    $key++;

                    $attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['postAttributes']);

                ?>

                <article <?php echo $postAttributes; ?>>

                    <?php
                        /**
                         * This indicates our Structured data that is required according to Google Structured data testing
                         */
                        if( $molecule['blogSchemes'] ) {
                    ?>
                        
                        <span class="components-structured-data" itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Person">
                            <meta itemprop="name" content="<?php the_author(); ?>">
                        </span>

                        <span class="components-structured-data" itemprop="publisher" itemscope="itemscope" itemtype="http://schema.org/Organization">
                            <meta itemprop="logo" content="<?php echo $molecule['logo']; ?>">
                            <meta itemprop="name" content="<?php echo $molecule['organization']; ?>">
                        </span>                    

                        <meta itemprop="mainEntityOfPage" content="<?php the_permalink(); ?>" />
                        <meta itemprop="datePublished" content="<?php the_date('c') ?>" />
                        <meta itemprop="dateModified" content="<?php the_modified_date('c') ?>" />

                    <?php
                        }

                        // Actions at beginning of a post
                        do_action('components_posts_post_before', $id);

                        if( $molecule['image'] ) {
                            MakeitWorkPress\WP_Components\Build::atom( 'image', $molecule['image'] );  
                        } 
                    ?>

                    <?php
                        // Header of this post                                
                        if( $molecule['headerAtoms'] ) { 
                    ?>
                        <header class="entry-header">    
                            <?php
                                foreach( $molecule['headerAtoms'] as $atom ) { 

                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                                } 
                            ?>
                        </header>   

                    <?php

                        }                                  

                        // Header of this post                                
                        if( $molecule['contentAtoms'] ) { 
                    ?>
                        <div class="entry-content">    
                            <?php
                                foreach( $molecule['contentAtoms'] as $atom ) { 

                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                                } 
                            ?>
                        </div>   

                    <?php

                        } 

                        // Footer of this post                                
                        if( $molecule['footerAtoms'] ) { 
                    ?>
                        <footer class="entry-footer">    
                            <?php
                                foreach( $molecule['footerAtoms'] as $atom ) { 

                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                                } 
                            ?>
                        </footer>   

                    <?php } ?>

                    <?php
                        // Actions at end of a post
                        do_action('components_posts_post_after', $id);
                    ?>

                </article>

            <?php } ?>
        
            <?php
                /**
                 * Fills the remainder of the articles with empty spans, so our styling comes out nicely. 
                 * For now, only possible with non-patterns
                 */
                if( isset($molecule['postAttributes']['grid']) && ! is_array($molecule['postAttributes']['grid']) ) {
                    
                    switch( $molecule['postsGrid'] ) {
                        case 'half';
                            $columns = 2;
                            break;                        
                        case 'third';
                            $columns = 3;
                            break;                        
                        case 'fourth';
                            $columns = 4;
                            break;                        
                        case 'fifth';
                            $columns = 5;
                            break;
                        default:
                            $columns = 1;
                    }
                    
                    $remainder = $columns - ($molecule['query']->post_count % $columns);
                    
                    for( $i = 1; $i <= $remainder; $i++ ) {
                        echo '<span class="components-' . $molecule['postsGrid']  . '-grid"></span>';
                    }
                }
            ?>
        
        <?php } else { ?>
        
            <p class="atom-posts-none">
                <?php echo $molecule['none']; ?>
            </p>
        
        <?php } ?>
        
    </div>

    <?php 
        // Pagination
        if( $molecule['pagination'] ) { 
            MakeitWorkPress\WP_Components\Build::atom( 'pagination', $molecule['pagination'] );
        } 
    ?>
    
    <?php 
        // Reset our postdata so our main queries keep working well
        wp_reset_query(); 
    
        do_action( 'components_posts_after', $molecule ); 
    ?>
    
</div>