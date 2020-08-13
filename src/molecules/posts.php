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
    'filter'            => false,                       // Adds a custom filter for a certain taxonomy. Accepts a certain taxonomy name in an array.  
    'gridGap'           => 'default',                                                
    'infinite'          => false,    
    'none'              => __('Bummer! No posts found.', 'components'),
    /**
     * Accepts properties for each post
     */
    'postProperties'    => [
        'attributes'    => [
            'itemprop'  => 'blogPost',
            'itemscope' => 'itemscope',
            'itemtype'  => 'http://schema.org/BlogPosting'            
        ],
        'blogSchema'    => true,                            // Indicates if we put author and other schema.org data within a blog bost
        'contentAtoms'  => [                                // Accepts a set of atoms for within the content
            'content' => [ 
                'atom'          => 'content', 
                'properties'    => ['type' => 'excerpt'] 
            ]
        ],        
        'footerAtoms'   => [                                // Accepts a set of atoms for use in the post footer
            'button' => [
                'atom'          => 'button', 
                'properties'    => ['float' => 'right', 'label' => __('View post', 'components'), 'link' => 'post', 'size' => 'small'] 
            ]
        ],          
        'headerAtoms'   => [                                // Accepts a set of atoms for use in the post header
            'title' => [
                'atom'          => 'title', 
                'properties'    => ['attributes' => ['itemprop' => 'name headline', 'class' => 'entry-title'], 'tag' => 'h2', 'link' => 'post' ] 
            ] 
        ],  
        'image'         => ['link' => 'post', 'size' => 'medium', 'enlarge' => true],       
        'logo'          => 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        'organization'  => get_bloginfo('name'),
        'publisher'     => 'Organization'                   // Accepts organization or person
    ],                              
    'pagination'        => ['type' => 'numbers'],           // Pagination settings.
    'query'             => '',                              // Accepts a custom query for posts. Pretty useful in existing WordPress templates. 
    'queryArgs'         => [],                              // Query arguments for retrieving posts
    'schema'            => true,                // If microdata is rendered or not. Also removes schematic attributes
    'view'              => 'list',                          // Type of display. Accepts list, grid or a custom class.
    'wrapper'           => ''                               // Wrapper class for posts
] );

// Query vars for pagination
if( get_query_var('paged') && ! isset($molecule['queryArgs']['paged']) ) {
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
if( isset($molecule['postProperties']['grid']) && $molecule['postProperties']['grid'] ) {
    $molecule['wrapper']               .= ' components-grid-wrapper components-grid-' . $molecule['gridGap']; 
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
$postClass = isset($molecule['postProperties']['attributes']['class']) ? $molecule['postProperties']['attributes']['class'] : '';

// Remove schema's if not enabled
if( ! $molecule['schema'] ) {   
    
    unset($molecule['attributes']['itemscope']);    
    unset($molecule['attributes']['itemtype']);      
    unset($molecule['postProperties']['attributes']['itemprop']);    
    unset($molecule['postProperties']['attributes']['itemscope']);    
    unset($molecule['postProperties']['attributes']['itemtype']);    

    // Various elements
    if( isset($molecule['postProperties']['contentAtoms']['content']) ) {
        $molecule['postProperties']['contentAtoms']['content']['properties']['schema']  = false;  
    }

    if( isset($molecule['postProperties']['headerAtoms']['title']) ) {
        $molecule['postProperties']['headerAtoms']['title']['properties']['schema']     = false;  
    }
    
    if( isset($molecule['postProperties']['image']) && $molecule['postProperties']['image'] ) {
        $molecule['postProperties']['image']['schema']                                  = false;
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
        
        <?php if( $molecule['query']->have_posts() ) { ?>
        
            <?php while( $molecule['query']->have_posts() ) { ?>

                <?php

                    $id = get_the_ID();

                    // Set-up our post data
                    $molecule['postProperties']['attributes']['class']      = $postClass;

                    $molecule['query']->the_post();
                    $molecule['postProperties']['attributes']['class']     .= implode(' ', get_post_class(' molecule-post', $id) );
                    
                    // Allows for grid patterns with an array
                    if( isset($molecule['postProperties']['grid']) && is_array($molecule['postProperties']['grid']) ) {
                        $molecule['postProperties']['attributes']['class'] .= ' components-' . $molecule['postProperties']['grid'][$key] . '-grid';
                    }

                    $key++;

                    $postProperties = MakeitWorkPress\WP_Components\Build::setDefaultProperties('post', $molecule['postProperties']);
                    $postAttributes = MakeitWorkPress\WP_Components\Build::attributes($postProperties['attributes']);

                ?>

                <article <?php echo $postAttributes; ?>>

                    <?php
                        /**
                         * Structured data that is required according to Google Structured data testing
                         */
                        if( $molecule['schema'] && $molecule['postProperties']['blogSchema'] ) {
                    ?>
                        
                        <span class="components-structured-data" itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Person">
                            <meta itemprop="name" content="<?php the_author(); ?>">
                        </span>

                        <span class="components-structured-data" itemprop="publisher" itemscope="itemscope" itemtype="http://schema.org/Organization">
                            <span itemprop="logo"itemscope="itemscope" itemtype="http://schema.org/ImageObject">
                                <?php if( strpos($molecule['postProperties']['logo'], '.svg') ) { ?>
                                    <meta itemprop="contentUrl" content="<?php echo $molecule['postProperties']['logo']; ?>" />
                                    <meta itemprop="url" content="<?php bloginfo('url'); ?>" />
                                <?php } else { ?>
                                    <meta itemprop="url" content="<?php echo $molecule['postProperties']['logo']; ?>" />
                                <?php } ?>
                            </span>
                            <meta itemprop="name" content="<?php echo $molecule['postProperties']['organization']; ?>" />
                        </span>                    

                        <meta itemprop="mainEntityOfPage" content="<?php the_permalink(); ?>" />
                        <meta itemprop="datePublished" content="<?php echo get_the_date('c') ?>" />
                        <meta itemprop="dateModified" content="<?php echo get_the_modified_date('c') ?>" />

                    <?php
                        }

                        // Actions at beginning of a post
                        do_action( 'components_posts_post_before', $id, $molecule );

                        if( $molecule['postProperties']['image'] ) {
                            MakeitWorkPress\WP_Components\Build::atom( 'image', $molecule['postProperties']['image'] );  
                        } 
                    ?>

                    <?php
                        // Header of this post                                
                        if( $molecule['postProperties']['headerAtoms'] ) { 
                    ?>
                        <header class="entry-header">    
                            <?php
                                foreach( $molecule['postProperties']['headerAtoms'] as $atom ) { 

                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                                } 
                            ?>
                        </header>   

                    <?php

                        }                                  

                        // Header of this post                                
                        if( $molecule['postProperties']['contentAtoms'] ) { 
                    ?>
                        <div class="entry-content">    
                            <?php
                                foreach( $molecule['postProperties']['contentAtoms'] as $atom ) { 

                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                                } 
                            ?>
                        </div>   

                    <?php

                        } 

                        // Footer of this post                                
                        if( $molecule['postProperties']['footerAtoms'] ) { 
                    ?>
                        <footer class="entry-footer">    
                            <?php
                                foreach( $molecule['postProperties']['footerAtoms'] as $atom ) { 

                                    MakeitWorkPress\WP_Components\Build::atom( $atom['atom'], $atom['properties'] );

                                } 
                            ?>
                        </footer>   

                    <?php } ?>

                    <?php
                        // Actions at end of a post
                        do_action( 'components_posts_post_after', $id,  $molecule );
                    ?>

                </article>

            <?php } ?>
        
            <?php
                
                /**
                 * Fills the remainder of the articles with empty spans, so our styling comes out nicely. 
                 * For now, only possible with non-patterns
                 */
                if( isset($molecule['postProperties']['grid']) && ! is_array($molecule['postProperties']['grid']) ) {
                    
                    switch( $molecule['postProperties'] ) {
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
                        echo '<span class="components-' . $molecule['postProperties']['grid']  . '-grid"></span>';
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