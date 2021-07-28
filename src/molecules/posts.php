<?php
/**
 * Displays a generic post grid or list
 * This element is kinda ugly, but just has to have a lot of options
 */

// Backward compatibility
$molecule                       = MakeitWorkPress\WP_Components\Build::convert_camels($molecule, [
    'gridGap'           => 'grid_gap', 
    'postProperties'    => 'post_properties', 
    'queryArgs'         => 'query_args'
]);

if( isset($molecule['post_properties']) ) {
    $molecule['post_properties']    = MakeitWorkPress\WP_Components\Build::convert_camels($molecule['post_properties'], [
        'blogSchema'        => 'blog_schema', 
        'contentAtoms'      => 'content_atoms', 
        'footerAtoms'       => 'footer_atoms', 
        'headerAtoms'       => 'header_atoms'
    ]);
}

// Atom values
$molecule = MakeitWorkPress\WP_Components\Build::multi_parse_args( $molecule, [
    'ajax'              => true,                        // To paginate using ajax
    'attributes'        => [
        'data'              => ['id' => 'molecule-posts'],  // Used to match requests for ajax. Must be unique if multiple elements are on one page,
        'itemscope'         => 'itemscope',             
        'itemtype'          => 'http://schema.org/Blog'
    ],
    'filter'            => false,                       // Adds a custom filter for a certain taxonomy. Accepts a certain taxonomy name in an array.  
    'grid_gap'          => 'default',                                                
    'infinite'          => false,    
    'none'              => __('Bummer! No posts found.', WP_COMPONENTS_LANGUAGE),
    /**
     * Accepts properties for each post
     */
    'post_properties'    => [
        'attributes'    => [
            'itemprop'  => 'blogPost',
            'itemscope' => 'itemscope',
            'itemtype'  => 'http://schema.org/BlogPosting'            
        ],
        'blog_schema'   => true,                            // Indicates if we put author and other schema.org data within a blog bost
        'content_atoms' => [                                // Accepts a set of atoms for within the content
            'content' => [ 
                'atom'          => 'content', 
                'properties'    => ['type' => 'excerpt'] 
            ]
        ],        
        'footer_atoms'  => [                                // Accepts a set of atoms for use in the post footer
            'button' => [
                'atom'          => 'button', 
                'properties'    => ['float' => 'right', 'label' => __('View post', WP_COMPONENTS_LANGUAGE), 'link' => 'post', 'size' => 'small'] 
            ]
        ],          
        'header_atoms'  => [                               // Accepts a set of atoms for use in the post header
            'title' => [
                'atom'          => 'title', 
                'properties'    => ['attributes' => ['itemprop' => 'name headline', 'class' => 'entry-title'], 'tag' => 'h2', 'link' => 'post' ] 
            ] 
        ],  
        'image'         => ['attributes' => ['class' => 'entry-image'], 'link' => 'post', 'size' => 'medium', 'enlarge' => true],       
        'logo'          => 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        'organization'  => get_bloginfo('name'),
        'publisher'     => 'Organization'                   // Accepts organization or person
    ],                              
    'pagination'        => ['type' => 'numbers'],           // Pagination settings.
    'query'             => '',                              // Accepts a custom query for posts. Pretty useful in existing WordPress templates. 
    'query_args'        => [],                              // Query arguments for retrieving posts
    'schema'            => true,                            // If microdata is rendered or not. Also removes schematic attributes
    'view'              => 'list',                          // Type of display. Accepts list, grid or a custom class.
    'wrapper'           => ''                               // Wrapper class for posts
] );

/**
 * Formatting our query arguments
 */

// Query vars for pagination
if( get_query_var('paged') && ! isset($molecule['query_args']['paged']) ) {
    $molecule['query_args']['paged']    = get_query_var('paged');
}

// Get our posts
if( ! $molecule['query'] ) {
    $molecule['query']                  = new WP_Query( $molecule['query_args'] );
}

// Set the query for our pagination if it's not set already
if( $molecule['pagination'] && ! isset($molecule['pagination']['query']) ) {
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
if( isset($molecule['post_properties']['grid']) && $molecule['post_properties']['grid'] ) {
    $molecule['wrapper']               .= ' components-grid-wrapper components-grid-' . $molecule['grid_gap']; 
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

// Key for counting grid patterns
$key = 0; 

// Initial class for each post. Should be defined here to prevent classes stacking upon each other.
$post_class = isset($molecule['post_properties']['attributes']['class']) ? $molecule['post_properties']['attributes']['class'] : '';

// Remove schema's if not enabled
if( ! $molecule['schema'] ) {   
    
    unset($molecule['attributes']['itemscope']);    
    unset($molecule['attributes']['itemtype']);      
    unset($molecule['post_properties']['attributes']['itemprop']);    
    unset($molecule['post_properties']['attributes']['itemscope']);    
    unset($molecule['post_properties']['attributes']['itemtype']);    

    // Various elements
    if( isset($molecule['post_properties']['content_atoms']['content']) ) {
        $molecule['post_properties']['content_atoms']['content']['properties']['schema']  = false;  
    }

    if( isset($molecule['post_properties']['header_atoms']['title']) ) {
        $molecule['post_properties']['header_atoms']['title']['properties']['schema']     = false;  
    }
    
    if( isset($molecule['post_properties']['image']) && $molecule['post_properties']['image'] ) {
        $molecule['post_properties']['image']['schema']                                  = false;
    }

}

// Set our default attributes
$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<div <?php echo $attributes; ?>>
    
    <?php do_action( 'components_posts_before', $molecule ); ?>
    
    <?php 
        // Filter
        if( $molecule['filter'] ) { 
            MakeitWorkPress\WP_Components\Build::atom( 'terms', $molecule['filter'] );
        } 
    ?>
    
    <div class="molecule-posts-wrapper <?php echo $molecule['wrapper']; ?>">
        
        <?php if( $molecule['query']->posts ) { ?>
        
            <?php foreach( $molecule['query']->posts as $post ) { ?>

                <?php

                    // Define our post id, as $post can both be an object or a integer (matching the post id)
                    $postID = isset($post->ID) && is_numeric($post->ID) ? $post->ID : $post;

                    // Set-up our post data
                    $molecule['post_properties']['attributes']['class']      = $post_class;

                    $molecule['query']->the_post();
                    $molecule['post_properties']['attributes']['class']     .= implode(' ', get_post_class(' molecule-post', $postID) );
                    
                    // Allows for grid patterns with an array
                    if( isset($molecule['post_properties']['grid']) && is_array($molecule['post_properties']['grid']) ) {
                        $molecule['post_properties']['attributes']['class'] .= ' components-' . $molecule['post_properties']['grid'][$key] . '-grid';
                    }

                    $key++;

                    // Allows our posts to have default attributes as regular atoms and molecules can have.
                    $post_properties = MakeitWorkPress\WP_Components\Build::set_default_properties('post', $molecule['post_properties']);
                    $post_attributes = MakeitWorkPress\WP_Components\Build::attributes($post_properties['attributes']);

                ?>

                <article <?php echo $post_attributes; ?>>

                    <?php
                        /**
                         * Structured data that is required according to Google Structured data testing
                         */
                        if( $molecule['schema'] && $molecule['post_properties']['blog_schema'] ) {
                    ?>
                        
                        <span class="components-structured-data" itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Person">
                            <meta itemprop="name" content="<?php the_author(); ?>">
                        </span>

                        <span class="components-structured-data" itemprop="publisher" itemscope="itemscope" itemtype="http://schema.org/Organization">
                            <span itemprop="logo"itemscope="itemscope" itemtype="http://schema.org/ImageObject">
                                <?php if( strpos($molecule['post_properties']['logo'], '.svg') ) { ?>
                                    <meta itemprop="contentUrl" content="<?php echo $molecule['post_properties']['logo']; ?>" />
                                    <meta itemprop="url" content="<?php bloginfo('url'); ?>" />
                                <?php } else { ?>
                                    <meta itemprop="url" content="<?php echo $molecule['post_properties']['logo']; ?>" />
                                <?php } ?>
                            </span>
                            <meta itemprop="name" content="<?php echo $molecule['post_properties']['organization']; ?>" />
                        </span>                    

                        <meta itemprop="mainEntityOfPage" content="<?php the_permalink(); ?>" />
                        <meta itemprop="datePublished" content="<?php echo get_the_date('c') ?>" />
                        <meta itemprop="dateModified" content="<?php echo get_the_modified_date('c') ?>" />

                    <?php
                        }

                        // Actions at beginning of a post
                        do_action( 'components_posts_post_before', $postID, $molecule );

                        if( $molecule['post_properties']['image'] ) {
                            MakeitWorkPress\WP_Components\Build::atom( 'image', $molecule['post_properties']['image'] );  
                        } 
                    ?>

                    <?php
                        // Header of this post                                
                        if( $molecule['post_properties']['header_atoms'] ) { 
                    ?>
                        <header class="entry-header">    
                            <?php
                                foreach( $molecule['post_properties']['header_atoms'] as $atom ) { 

                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                                } 
                            ?>
                        </header>   

                    <?php

                        }                                  

                        // Content of this post                                
                        if( $molecule['post_properties']['content_atoms'] ) { 
                    ?>
                        <div class="entry-content">    
                            <?php
                                foreach( $molecule['post_properties']['content_atoms'] as $atom ) { 

                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                                } 
                            ?>
                        </div>   

                    <?php

                        } 

                        // Footer of this post                                
                        if( $molecule['post_properties']['footer_atoms'] ) { 
                    ?>
                        <footer class="entry-footer">    
                            <?php
                                foreach( $molecule['post_properties']['footer_atoms'] as $atom ) { 

                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                                } 
                            ?>
                        </footer>   

                    <?php } ?>

                    <?php
                        // Actions at end of a post
                        do_action( 'components_posts_post_after', $postID,  $molecule );
                    ?>

                </article>

            <?php } ?>
        
            <?php
                
                /**
                 * Fills the remainder of the articles with empty spans, so our styling comes out nicely. 
                 * For now, only possible with non-patterns
                 */
                if( isset($molecule['post_properties']['grid']) && ! is_array($molecule['post_properties']['grid']) ) {
                    
                    switch( $molecule['post_properties'] ) {
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
                        echo '<span class="components-' . $molecule['post_properties']['grid']  . '-grid"></span>';
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