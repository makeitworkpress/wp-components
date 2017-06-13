<?php
/**
 * Displays the author description and bio
 */
global $post;

// Atom values
$atom = wp_parse_args( $atom, array(
    'avatar'            => get_avatar( $post->post_author, 100 ),
    'description'       => get_the_author_meta('description'),
    'imageFloat'        => 'none',
    'name'              => get_the_author(),
    'url'               => esc_url( get_author_posts_url( $post->post_author ) ),
    'schema'            => 'http://schema.org/Person'
) );

?>
<div class="atom-author <?php echo $atom['style']; ?>" itemprop="author" itemscope="itemscope" itemtype="<?php echo $atom['schema']; ?>" <?php echo $atom['inlineStyle']; ?>>
    
    <?php if( $atom['avatar'] ) { ?> 
    
        <figure class="atom-author-avatar components-<?php echo $atom['imageFloat']; ?>-float">
            <a class="url fn vcard" href="<?php echo $atom['url']; ?>" rel="author">
                <?php echo $atom['avatar']; ?>
            </a>
            <?php if( ! $atom['description'] ) { ?> 
                <meta itemprop="name" content="<?php echo $atom['name']; ?>" /> 
            <?php } ?>
        </figure>
    
    <?php } ?>
    
    <?php if( $atom['description'] ) { ?> 
    
        <div class="atom-author-description">
            <h4 itemprop="name"><?php echo $atom['name']; ?></h4>
            <p itemprop="text"><?php echo $atom['description']; ?></p>
        </div>
    
    <?php } ?>
    
</div>