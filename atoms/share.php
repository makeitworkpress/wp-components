<?php
/**
 * Displays a sharing component
 */
$postID = get_the_ID();

// Images
if( has_post_thumbnail($postID) ) {
    $id     = get_post_thumbnail_id( $postID );
    $image  = wp_get_attachment_image_url( $id, isset( $atom['size'] ) ? $atom['size'] : 'large' );
} else {
    $image  = '';
}

// Predefined atom properties
$image  = isset( $atom['image'] )   ? $atom['image']    : $image;
$source = isset( $atom['source'] )  ? $atom['source']   : get_bloginfo('name');
$title  = isset( $atom['title'] )   ? $atom['title']    : urlencode( get_the_title($postID) );
$url    = isset( $atom['url'] )     ? $atom['url']      : urlencode( get_permalink($postID) );
$via    = isset( $atom['via'] )     ? $atom['via']      : '';

// Atom properties
$atom   = wp_parse_args( $atom, array(
    'colorBackground'   => true,
    'enabled'           => array('facebook', 'twitter', 'linkedin', 'google-plus', 'pinterest', 'reddit', 'stumbleupon', 'pocket'),
    'fixed'             => false,
    'networks'          => array(
        'facebook'      => array('url' => 'http://www.facebook.com/sharer.php?s=100&p[url]=' . $url, 'icon' => 'facebook'), 
        'twitter'       => array('url' => 'http://twitter.com/share?url=' . $url . '&text=' . $title . '&via=' . $via, 'icon' => 'twitter'), 
        'linkedin'      => array(
            'url'   => 'http://www.linkedin.com/shareArticle?mini=true&url=' . $url . '&title=' . $title . '&source=' . $source, 
            'icon'  => 'linkedin'
        ), 
        'google-plus'   => array('url' => 'https://plus.google.com/share?url=' . $url, 'icon' => 'google-plus'), 
        'pinterest'     => array(
            'url'   => 'http://pinterest.com/pin/create/button/?url=' . $url . '&description=' . $title . '&media=' . $image, 
            'icon'  => 'pinterest'
        ), 
        'reddit'        => array('url' => 'http://www.reddit.com/submit?url=' . $url . '&title=' . $title, 'icon' => 'reddit-alien'), 
        'stumbleupon'   => array('url' => 'http://stumbleupon.com/submit?url=' . $url . '&title=' . $title, 'icon' => 'stumbleupon'),
        'pocket'        => array('url' => 'https://getpocket.com/edit.php?url=' . $url . '', 'icon' => 'get-pocket')
    )
) ); 

if( $atom['fixed'] ) 
    $atom['style'] .= ' atom-share-fixed';

if( $atom['colorBackground'] ) 
    $atom['style'] .= ' components-background'; ?>

<div class="atom-share <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?>>
    
    <?php foreach( $atom['enabled'] as $network ) { ?>
    
        <a class="atom-network components-<?php echo $network; ?>" href="<?php echo $atom['networks'][$network]['url']; ?>" target="_blank" rel="_nofollow">
            <?php if( isset($atom['networks'][$network]['icon']) ) { ?>
                <i class="fa fa-<?php echo $atom['networks'][$network]['icon']; ?>"></i>
            <?php } ?>
            <?php if( isset($atom['networks'][$network]['title']) ) { ?>
                <span><?php echo $atom['networks'][$network]['title']; ?></span>
            <?php } ?>
        </a>
    
    <?php } ?>
    
</div>