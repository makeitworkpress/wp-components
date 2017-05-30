<?php
/**
 * Displays a generic post grid or list
 */

// Atom values
$molecule = wp_parse_args( $molecule, array(
    'args'          => array(),                         // Query arguments for retrieving posts
    'content'       => array( 'type' => 'excerpt' ),    
    'filter'        => false,                           // Adds a custom filter for a certain taxonomy. Accepts a certain taxonomy name in an array.
    'footerAtoms'   => array(                           // Accepts a set of atoms
        'title' => array( 'link' => 'post', 'title' => __('View post', 'components')) 
    ),                                           
    'grid'          => '',                              // Accepts a custom grid class to display the thing into coloms
    'headerAtoms'   => array(                           // Accepts a set of atoms
        'title' => array( 'tag' => 'h2', 'link' => 'post' ) 
    ),          
    'image'         => array( 'link' => 'post', 'size' => 'medium' ),
    'infinite'      => false,    
    'itemprop'      => '',    
    'paginate'      => array( 'type' => 'default' ),    // Pagination settings. If you remove this but have infinite enabled, this will break
    'posts'         => array(),                         // Accepts a custom array of posts. Pretty useful in existing WordPress templates. 
    'scheme'        => 'http://schema.org/BlogPosting',
    'style'         => 'default',                       // If components-list or components-grid are added as a class, the display might vary
    'type'          => ''
) ); 

if( $molecule['infinite'] ) 
    $molecule['style'] .= ' do-infinite'; 

if( ! $molecule['posts'] )
    $molecule['posts'] = get_posts( $molecule['args'] );

if( strpos($molecule['scheme'], 'BlogPosting') ) {
    $molecule['itemprop']   = 'itemprop="blogPost"'; 
    $molecule['type']       = 'itemscope="itemscope" itemtype="http://schema.org/Blog"'; 
} ?>

<div class="molecule-posts <?php echo $molecule['style']; ?>" <?php echo $molecule['type']; ?>>
    
    <?php do_action( 'components_posts_before', $molecule ); ?>
    
    <?php 
        // Filter
        if( $molecule['filter'] ) { 
            Components::atom( 'tags', $molecule['filter'] );
        } 
    ?>    
    
    <?php foreach( $molecule['posts'] as $post ) { ?>
    
        <?php setup_postdata( $post ); ?>
    
        <article class="molecule-posts-post <?php echo $molecule['grid']; ?>" <?php echo $molecule['itemprop']; ?> itemscope="itemscope" itemtype="<?php echo $molecule['scheme']; ?>">
    
            <?php
                // Actions at beginning of a post
                do_action('components_posts_post_before', $post);
                                                                                
                if( $molecule['image'] ) {
                    Components::atom( 'image', $molecule['image'] );  
                }                                                
                 
                // Header of this post                                
                if( $molecule['headerAtoms'] ) { 
            ?>
                <header class="entry-header">    
                    <?php
                        foreach( $molecule['headerAtoms'] as $name => $variables ) { 

                            Components::atom( $name, $variables );

                        } 
                    ?>
                </header>   
            
            <?php
                
                }                                  
                
                // Content within the post  
                if( $molecule['content'] ) {
                    Components::atom( 'content', $molecule['content'] ); 
                }
                                                  
                // Footer of this post                                
                if( $molecule['footerAtoms'] ) { 
            ?>
                <footer class="entry-footer">    
                    <?php
                        foreach( $molecule['footerAtoms'] as $name => $variables ) { 

                            Components::atom( $name, $variables );

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

    <?php 
        // Pagination
        if( $molecule['paginate'] ) { 
            Components::atom( 'paginate', $molecule['paginate'] );
        } 
    ?>
    
    <?php 
        // Reset our postdata so our main queries keep working well
        wp_reset_postdata(); 
    
        do_action( 'components_posts_after', $molecule ); 
    ?>
    
</div>