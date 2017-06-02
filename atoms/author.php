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
    'scheme'            => 'http://schema.org/Person',
    'showAvatar'        => true, 
    'showDescription'   => true
) );

?>
<div class="atom-author <?php echo $atom['style']; ?>" itemprop="author" itemscope="itemscope" itemtype="<?php echo $atom['scheme']; ?>" <?php echo $atom['inlineStyle']; ?>>
    
    <?php if( $atom['showAvatar'] ) { ?> 
    
        <figure class="atom-author-avatar float-<?php echo $atom['imageFloat']; ?>">
            <a class="url fn vcard" href="<?php echo $atom['url']; ?>" rel="author">
                <?php echo $atom['avatar']; ?>
            </a>
            <?php if( ! $atom['showDescription'] ) { ?> 
                <meta itemprop="name" content="<?php echo $atom['name']; ?>" /> 
            <?php } ?>
        </figure>
    
    <?php } ?>
    
    <?php if( $atom['showDescription'] ) { ?> 
    
        <div class="atom-author-description">
            <h4 itemprop="name"><?php echo $atom['name']; ?></h4>
            <p itemprop="text"><?php echo $atom['description']; ?></p>
        </div>
    
    <?php } ?>
    
</div>