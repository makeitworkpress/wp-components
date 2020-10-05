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
$title  = isset( $atom['title'] )   ? $atom['title']    : rawurlencode( get_the_title($postID) );
$url    = isset( $atom['url'] )     ? $atom['url']      : rawurlencode( get_permalink($postID) );
$via    = isset( $atom['via'] )     ? $atom['via']      : '';

// Atom properties - for this atom, wp_parse_args should be used
$atom   = wp_parse_args( $atom, [
    'colorBackground'   => true,
    'enabled'           => [ 'facebook', 'twitter', 'linkedin', 'pinterest', 'reddit', 'stumbleupon', 'pocket', 'whatsapp' ],
    'fixed'             => false,
    'hoverItem'         => '', // Allows a hover.css class applied to each item. Requires hover to be set true in Boot().  
    'networks'          => [
        'facebook'      => [ 'url' => 'http://www.facebook.com/sharer.php?u=' . $url, 'icon' => 'facebook' ], 
        'twitter'       => [ 'url' => 'http://twitter.com/share?url=' . $url . '&text=' . $title . '&via=' . $via, 'icon' => 'twitter' ], 
        'linkedin'      => [
            'url'   => 'http://www.linkedin.com/shareArticle?mini=true&url=' . $url . '&title=' . $title . '&source=' . $source, 
            'icon'  => 'linkedin'
        ],
        'pinterest'     => [
            'url'   => 'http://pinterest.com/pin/create/button/?url=' . $url . '&description=' . $title . '&media=' . $image, 
            'icon'  => 'pinterest'
        ], 
        'reddit'        => [ 'url' => 'http://www.reddit.com/submit?url=' . $url . '&title=' . $title, 'icon' => 'reddit-alien' ], 
        'stumbleupon'   => [ 'url' => 'http://stumbleupon.com/submit?url=' . $url . '&title=' . $title, 'icon' => 'stumbleupon' ],
        'pocket'        => [ 'url' => 'https://getpocket.com/edit.php?url=' . $url, 'icon' => 'get-pocket' ],
        'whatsapp'      => [ 'url' => 'whatsapp://send?text=' . $title . ' ' . $url, 'icon' => 'whatsapp' ]
    ],      
    'share'             => __('Share:', WP_COMPONENTS_LANGUAGE) // Adds a label with share
] ); 

if( $atom['fixed'] ) {
    $atom['attributes']['class'] .= ' atom-share-fixed';
}

if( $atom['colorBackground'] ) { 
    $atom['attributes']['class'] .= ' components-background'; 
}

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>

    <?php if( $atom['share'] ) { ?>
        <span class="atom-network atom-share-title">
            <?php echo $atom['share']; ?>
        </span>
    <?php } ?>
    
    <?php foreach( $atom['enabled'] as $network ) { ?>
    
        <a class="atom-network components-<?php echo $network; ?><?php if($atom['hoverItem']) { ?> hvr-<?php echo $atom['hoverItem']; } ?>" href="<?php echo $atom['networks'][$network]['url']; ?>" target="_blank" rel="nofollow">
            <?php if( isset($atom['networks'][$network]['icon']) ) { ?>
                <i class="fa fa-<?php echo $atom['networks'][$network]['icon']; ?> hvr-icon"></i>
            <?php } ?>
            <?php if( isset($atom['networks'][$network]['title']) ) { ?>
                <span><?php echo $atom['networks'][$network]['title']; ?></span>
            <?php } ?>
        </a>
    
    <?php } ?>
    
</div>