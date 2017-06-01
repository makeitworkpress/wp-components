<?php
/**
 * Displays a generic post grid or list
 */

// Atom values
$molecule = wp_parse_args( $molecule, array(
    'ajax'          => true,                         // To paginate using ajax
    'args'          => array(),                         // Query arguments for retrieving posts
    'content'       => array( 'type' => 'excerpt' ),    
    'filter'        => false,                           // Adds a custom filter for a certain taxonomy. Accepts a certain taxonomy name in an array.
    'footerAtoms'   => array(                           // Accepts a set of atoms
        'title' => array( 'link' => 'post', 'title' => __('View post', 'components')) 
    ),                                           
    'grid'          => '',                              // Accepts a custom grid class or pattern to display the thing into coloms
    'headerAtoms'   => array(                           // Accepts a set of atoms
        'title' => array( 'tag' => 'h2', 'link' => 'post' ) 
    ),          
    'image'         => array( 'link' => 'post', 'size' => 'medium' ),
    'infinite'      => false,    
    'itemprop'      => '',
    'paginate'      => array( 'type' => 'default' ),    // Pagination settings. If you remove this but have infinite enabled, infinite will break
    'posts'         => array(),                         // Accepts a custom array of posts. Pretty useful in existing WordPress templates. 
    'scheme'        => 'http://schema.org/BlogPosting',
    'type'          => '',
    'unique'        => uniqid()                         // Used to match requests
) ); 

// Output our arguments if we have a filter
if( $molecule['filter'] ) {
    add_action('wp_footer', function() use ($molecule) {
        echo '<script type="text/javascript"> var posts' . $molecule['unique'] . '=' . json_encode($molecule) . ';</script>';
    });
}

// Ajax pagination
if( $molecule['ajax'] ) {
    $molecule['style'] .= ' do-ajax'; 
}

// Infinite scroll
if( $molecule['infinite'] ) 
    $molecule['style'] .= ' do-infinite'; 

// Fallback if a users by accident removes the pagination
if( $molecule['infinite'] ) 
    $molecule['paginate'] = array( 'type' => 'numbers' ); 

// Get our posts
if( ! $molecule['posts'] )
    $molecule['posts'] = get_posts( $molecule['args'] );

// Alternate schemes for blogposting
if( strpos($molecule['scheme'], 'BlogPosting') ) {
    $molecule['itemprop']   = 'itemprop="blogPost"'; 
    $molecule['type']       = 'itemscope="itemscope" itemtype="http://schema.org/Blog"'; 
} ?>

<div class="molecule-posts <?php echo $molecule['style']; ?>" <?php echo $molecule['type']; ?> data-unique="<?php echo $molecule['unique']; ?>">
    
    <?php do_action( 'components_posts_before', $molecule ); ?>
    
    <?php 
        // Filter
        if( $molecule['filter'] ) { 
            Components\Build::atom( 'tags', $molecule['filter'] );
        } 
    ?>
    
    <div class="molecule-posts-wrapper">
    
        <?php foreach( $molecule['posts'] as $key => $post ) { ?>

            <?php 
                
                // Allows for grid patterns
                $grid = is_array($molecule['grid']) ? $molecule['grid'][$key] : $molecule['grid'];
    
                // Set-up our post data
                setup_postdata( $post );
    
            ?>

            <article class="molecule-post <?php echo $grid; ?>" <?php echo $molecule['itemprop']; ?> itemscope="itemscope" itemtype="<?php echo $molecule['scheme']; ?>">

                <?php
                    // Actions at beginning of a post
                    do_action('components_posts_post_before', $post);

                    if( $molecule['image'] ) {
                        Components\Build::atom( 'image', $molecule['image'] );  
                    }                                                

                    // Header of this post                                
                    if( $molecule['headerAtoms'] ) { 
                ?>
                    <header class="entry-header">    
                        <?php
                            foreach( $molecule['headerAtoms'] as $name => $variables ) { 

                                Components\Build::atom( $name, $variables );

                            } 
                        ?>
                    </header>   

                <?php

                    }                                  

                    // Content within the post  
                    if( $molecule['content'] ) {
                        Components\Build::atom( 'content', $molecule['content'] ); 
                    }

                    // Footer of this post                                
                    if( $molecule['footerAtoms'] ) { 
                ?>
                    <footer class="entry-footer">    
                        <?php
                            foreach( $molecule['footerAtoms'] as $name => $variables ) { 

                                Components\Build::atom( $name, $variables );

                            } 
                        ?>
                    </footer>   

                <?php

                    } 

                    // Actions at end of a post
                    do_action('components_posts_post_after', $post);
                ?>

            </article>

        <?php                                        
            } 
        ?>
        
    </div>

    <?php 
        // Pagination
        if( $molecule['paginate'] ) { 
            Components\Build::atom( 'paginate', $molecule['paginate'] );
        } 
    ?>
    
    <?php 
        // Reset our postdata so our main queries keep working well
        wp_reset_postdata(); 
    
        do_action( 'components_posts_after', $molecule ); 
    ?>
    
</div>