<?php
/**
 * Displays a generic post grid or list
 */

// Atom values
$molecule = wp_parse_args( $molecule, array(
    'args'      => array(),                                             // Query arguments for retrieving posts
    'button'    => array( 'title' => __('View post', 'components') ),   // Accepts custom values for button
    'content'   => array( 'type' => 'excerpt' ),                        // Accepts custom values for the content
    'filter'    => false,                                               // Adds a custom filter for a certain taxonomy. Accepts a certain taxonomy name in an array.
    'grid'      => '',                                                  // Accepts a custom grid class to display the thing into coloms
    'image'     => array( 'size' => 'medium' ),                         // If you want to show an image, keep this is an array
    'infinite'  => false,    
    'itemprop'  => '',    
    'paginate'  => array( 'type' => 'default' ),   
    'posts'     => array(),                                             // Accepts a custom array of posts  
    'scheme'    => 'http://schema.org/BlogPosting',
    'style'     => 'default',                                           // If components-list or components-grid are added, the display might vary
    'title'     => array( 'tag' => 'h2' ),
    'type'      => ''
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
    
    <?php 
        // Pagination
        if( $molecule['filter'] ) { 
            Components::atom( 'tags', $molecule['filter'] );
        } 
    ?>    
    
    <?php foreach( $molecule['posts'] as $post ) { ?>
    
        <?php setup_postdata( $post ); ?>
    
        <article class="molecule-posts-post <?php echo $molecule['grid']; ?>" <?php echo $molecule['itemprop']; ?> itemscope="itemscope" itemtype="<?php echo $molecule['scheme']; ?>">
    
            <?php
                // Actions at beginning of a post
                do_action('components_posts_before', $post);
                                                  
                $link = esc_url(get_the_permalink());
                                                  
                if( $molecule['image'] ) {
                    // Add the url to the image
                    $molecule['image'] = wp_parse_args( array('link' => $link), $molecule['image'] );
                    Components::atom( 'image', $molecule['image'] );  
                }                                                

                // Our header
                if( $molecule['title'] ) {
                    
                    // Add the url to the title
                    $molecule['title'] = wp_parse_args( array('link' => $link), $molecule['title'] );                    
                    Components::molecule( 'post-header', array('container' => false, 'title' => $molecule['title']) );
                }
                 
                // Content of list                                  
                if( $molecule['content'] )
                    Components::atom( 'content', $molecule['content'] ); 
                 
                // Our footer                                   
                if( $molecule['button'] ) {
                    
                    // Add the url to the button
                    $molecule['button'] = wp_parse_args( array('link' => $link), $molecule['button'] );
                    
                    Components::molecule( 'post-footer', array(
                        'container' => false, 
                        'elements' => array('button' => $molecule['button'])
                    ) ); 
                }

                // Actions at end of a post
                do_action('components_posts_after', $post);
            ?>
            
        </article>
    
    <?php } ?>

    <?php 
        // Pagination
        if( $molecule['paginate'] ) { 
            Components::atom( 'paginate', $molecule['paginate'] );
        } 
    ?>
    
</div>