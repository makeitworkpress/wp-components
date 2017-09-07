<?php
/**
 * Displays a generic post grid or list
 * This element is kinda ugly, but just has to have a lot of options
 */

// Atom values
$molecule = wp_parse_args( $molecule, array(
    'ajax'          => true,                            // To paginate using ajax
    'args'          => array(),                         // Query arguments for retrieving posts
    'contentAtoms'   => array(                          // Accepts a set of atoms for within the content
        'content' => array( 'type' => 'excerpt') 
    ),          
    'id'            => 'molecule-posts',                // Used to match requests for ajax. Must be unique if multiple elements are on one page
    'filter'        => false,                           // Adds a custom filter for a certain taxonomy. Accepts a certain taxonomy name in an array.
    'footerAtoms'   => array(                           // Accepts a set of atoms
        'button' => array( 'link' => 'post', 'label' => __('View post', 'components'), 'size' => 'small', 'float' => 'right') 
    ),                                           
    'headerAtoms'   => array(                           // Accepts a set of atoms
        'title' => array( 'tag' => 'h2', 'link' => 'post', 'style' => 'entry-title' ) 
    ),          
    'image'         => array( 'link' => 'post', 'size' => 'medium', 'enlarge' => true ),
    'infinite'      => false,    
    'itemprop'      => '',
    'none'          => __('Bummer! No posts found.', 'components'),
    'pagination'    => array('type' => 'numbers'),      // Pagination settings.
    'postsGrid'     => '',                              // Accepts a custom grid class or pattern to display the thing into coloms
    'postsAppear'   => '',                              // Accepts a custom grid appear class for posts
    'postsAnimation' => '',                             // Accepts a custom animation class for posts
    'postsBackground' => '',                            // Accepts a custom background class for posts
    'postsBorder'   => '',                              // Accepts a custom border class for posts
    'postsColor'    => '',                              // Accepts a custom color class for bosts
    'postsHover'    => '',                              // Accepts a custom hover class for posts
    'postsInlineStyle' => '',                           // Accepts a custom inline style for posts
    'query'         => array(),                         // Accepts a custom query for posts. Pretty useful in existing WordPress templates. 
    'scheme'        => 'http://schema.org/BlogPosting', // Grand scheme
    'type'          => '',                              // Itemtype
    'view'          => 'list',                          // Type of display. Accepts list, grid or a custom class.
    'wrapper'       => ''                               // Wrapper class for our posts-wrapper
) );

// Query vars for pagination
if( get_query_var('paged') )
    $molecule['args']['paged'] = get_query_var('paged');

// Get our posts
if( ! $molecule['query'] )
    $molecule['query'] = new WP_Query( $molecule['args'] );

// Set the query for our pagination
if( $molecule['pagination'] )
    $molecule['pagination']['query'] = $molecule['query'];

// Output our arguments if we have a filter
if( $molecule['filter'] ) {
    add_action('wp_footer', function() use ($molecule) {
        echo '<script type="text/javascript"> var posts' . $molecule['id'] . '=' . json_encode($molecule) . ';</script>';
    });
}

// Ajax pagination
if( $molecule['ajax'] )
    $molecule['style'] .= ' molecule-posts-ajax'; 

// Display style
if( $molecule['view'] )
    $molecule['style'] .= ' molecule-posts-' . $molecule['view']; 

// Individal posts grid
if( $molecule['postsGrid'] )
    $molecule['wrapper'] .= ' components-grid-wrapper'; 

// Infinite scroll
if( $molecule['infinite'] ) 
    $molecule['style'] .= ' molecule-posts-infinite'; 

// Fallback if a users by accident removes the pagination and we have infinite or ajax pagination
if( $molecule['infinite'] ) {
    $molecule['pagination']['size'] = 99999; 
    $molecule['pagination']['type'] = 'numbers'; 
}

// Alternate schemes for blogposting
if( strpos($molecule['scheme'], 'BlogPosting') ) {
    $molecule['itemprop']   = 'itemprop="blogPost"'; 
    $molecule['type']       = 'itemscope="itemscope" itemtype="http://schema.org/Blog"'; 
} 

// Basic grid class for individual posts
$grid = '';

// Appearing for individual posts_clauses
if( $molecule['postsAppear'] )
    $grid .= 'components-' . $molecule['postsAppear'] . '-appear';

if( $molecule['postsAnimation'] )
    $grid .= 'components-' . $molecule['postsAnimation'] . '-animation';

if( $molecule['postsBackground'] )
    $grid .= 'components-' . $molecule['postsBackground'] . '-background';


if( $molecule['postsBorder'] )
    $grid .= 'components-' . $molecule['postsBorder'] . '-border';

if( $molecule['postsColor'] )
    $grid .= 'components-' . $molecule['postsColor'] . '-color';

if( $molecule['postsHover'] )
    $grid .= 'components-' . $molecule['postsHover'] . '-hover';

// And our data
$molecule['data'] .= ' data-id="' . $molecule['id'] . '"';

// Key for counting grid patterns
$key = 0; ?>

<div class="molecule-posts <?php echo $molecule['style']; ?>" <?php echo $molecule['type']; ?> <?php echo $molecule['inlineStyle']; ?> <?php echo $molecule['data']; ?>>
    
    <?php do_action( 'components_posts_before', $molecule ); ?>
    
    <?php 
        // Filter
        if( $molecule['filter'] ) { 
            WP_Components\Build::atom( 'terms', $molecule['filter'] );
        } 
    ?>
    
    <div class="molecule-posts-wrapper <?php echo $molecule['wrapper']; ?>">
        
        <?php if( $molecule['query']->have_posts() ) { ?>
        
            <?php while( $molecule['query']->have_posts() ) { ?>

                <?php

                    // Set-up our post data
                    $molecule['query']->the_post();
                    $id = get_the_ID();

                    // Allows for grid patterns
                    if( $molecule['postsGrid'] ) {
                        $grid .= is_array($molecule['postsGrid']) ? ' components-' . $molecule['postsGrid'][$key] . '-grid' : ' components-' . $molecule['postsGrid'] . '-grid';
                    } else {
                        $grid .= '';
                    }
    
                    // Inline styles   
                    if( $molecule['postsInlineStyle'] )
                        $molecule['postsInlineStyle'] = 'style="' . $molecule['postsInlineStyle'] . '"';

                    $key++;

                ?>

                <article <?php post_class('molecule-post ' . $grid); ?> <?php echo $molecule['itemprop']; ?> itemscope="itemscope" itemtype="<?php echo $molecule['scheme']; ?>" <?php echo $molecule['postsInlineStyle']; ?>>

                    <?php
                        // Actions at beginning of a post
                        do_action('components_posts_post_before', $id);

                        if( $molecule['image'] ) {
                            WP_Components\Build::atom( 'image', $molecule['image'] );  
                        } 
                    ?>

                    <?php
                        // Header of this post                                
                        if( $molecule['headerAtoms'] ) { 
                    ?>
                        <header class="entry-header">    
                            <?php
                                foreach( $molecule['headerAtoms'] as $name => $variables ) { 

                                    WP_Components\Build::atom( $name, $variables );

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
                                foreach( $molecule['contentAtoms'] as $name => $variables ) { 

                                    WP_Components\Build::atom( $name, $variables );

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
                                foreach( $molecule['footerAtoms'] as $name => $variables ) { 

                                    WP_Components\Build::atom( $name, $variables );

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
                if( ! is_array($molecule['postsGrid']) ) {
                    
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
            WP_Components\Build::atom( 'pagination', $molecule['pagination'] );
        } 
    ?>
    
    <?php 
        // Reset our postdata so our main queries keep working well
        wp_reset_query(); 
    
        do_action( 'components_posts_after', $molecule ); 
    ?>
    
</div>