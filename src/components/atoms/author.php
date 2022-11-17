<?php
/**
 * Displays the author description and bio
 */
global $post;

if( is_numeric($post) ) {
    $post = get_post($post);
}

// Backward compatibility
$atom = MakeitWorkPress\WP_Components\Build::convert_camels($atom, ['imageFloat' => 'image_float', 'imageRounded' => 'image_rounded', 'jobTitle' => 'job_title']);

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, [
    'attributes'        => [
        'itemprop'  => 'author',
        'itemscope' => 'itemscope',
        'itemtype'  => 'http://schema.org/Person'
    ], 
    'avatar'            => get_avatar( $post->post_author, 100 ),
    'description'       => get_the_author_meta( 'description', $post->post_author ),
    'image_float'       => 'none',
    'image_rounded'     => true,
    'job_title'          => '',
    'name'              => get_the_author(),
    'prepend'           => '',  // Prepend the author name with a custom description
    'schema'            => true, // If schema microdata are used or not
    'url'               => esc_url( get_author_posts_url( $post->post_author ) )
 ] );

$atom['image_rounded']               = $atom['image_rounded'] ? 'components-rounded' : ''; 

if( ! $atom['schema'] ) {
    unset($atom['attributes']['itemprop']);    
    unset($atom['attributes']['itemscope']);    
    unset($atom['attributes']['itemtype']);    
}

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    
    <?php if( $atom['avatar'] ) { ?> 
    
        <figure class="atom-author-avatar components-<?php echo $atom['image_float']; ?>-float <?php echo $atom['image_rounded']; ?>">
            <a class="url fn vcard" href="<?php echo $atom['url']; ?>" rel="author">
                <?php echo $atom['avatar']; ?>
            </a>
            <meta itemprop="name" content="<?php echo $atom['name']; ?>" /> 
        </figure>
    
    <?php } ?>
    
    <?php if( $atom['description'] || $atom['name'] || $atom['job_title'] ) { ?>
    
        <div class="atom-author-description components-<?php echo $atom['image_float']; ?>-float">
            
            <?php if( $atom['name'] ) { ?> 
                <h4 <?php if($atom['schema']) { ?>itemprop="name"<?php } ?>><?php echo $atom['prepend'] . $atom['name']; ?></h4>
            <?php } ?>

            <?php if( $atom['job_title'] ) { ?>
                <p <?php if($atom['schema']) { ?>itemprop="jobTitle"<?php } ?>><?php echo $atom['job_title']; ?></p>
            <?php } ?>            
            
            <?php if( $atom['description'] ) { ?>
                <p><?php echo $atom['description']; ?></p>
            <?php } ?>
            
        </div>
    
    <?php } ?>
    
</div>