<?php
/**
 * Displays a sharing component
 */
global $post;

// Sharing url values
if( has_post_thumbnail($post->ID) ) {
    $id     = get_post_thumbnail_id($post->ID);
    $image  = wp_get_attachment_image_url($id, 'hd');
} else {
    $image  = '';
}

$image  = isset( $atom['image'] )   ? $atom['image']    : $image;
$size   = isset( $atom['size'] )    ? $atom['size']     : 'large';
$source = isset( $atom['source'] )  ? $atom['source']   : get_bloginfo('name');
$title  = isset( $atom['title'] )   ? $atom['title']    : urlencode( get_the_title($post->ID) )
$url    = isset( $atom['url'] )     ? $atom['url']      : urlencode( get_permalink($post->ID) );
$via    = isset( $atom['via'] )     ? $atom['via']      : '';

// Atom values
$atom   = wp_parse_args( $atom, array(
    'background'    => true,
    'fixed'         => false,
    'networks'      => array(
        'facebook'      => array('url' => 'http://www.facebook.com/sharer.php?s=100&p[url]=' . $url, 'icon' => 'facebook'), 
        'twitter'       => array('url' => 'http://twitter.com/share?url=' . $url . '&text=' . $title . '&via=' . $via, 'icon' => 'twitter'), 
        'linkedin'      => array(
            'url'   => 'http://www.linkedin.com/shareArticle?mini=true&url=' . $url . '&title=' . $title . '&source=' . $source, 
            'icon'  => 'linkedin'
        ), 
        'google-plus'   => array('url' => 'https://plus.google.com/share?url=' . $url, 'icon' => 'google-plus'), 
        'pinterest'     => array(
            'url' => 'http://pinterest.com/pin/create/button/?url=' . $url . '&description=' . $title . '&media=' . $image, 
            'icon' => 'pinterest'
        ), 
        'reddit'        => array('url' => 'http://www.reddit.com/submit?url=' . $url . '&title=' . $title, 'icon' => 'reddit-alien'), 
        'stumbleupon'   => array('url' => 'http://stumbleupon.com/submit?url=' . $url . '&title=' . $title, 'icon' => 'stumbleupon'),
        'pocket'        => array('url' => 'https://getpocket.com/edit.php?url=' . $url . '', 'icon' => 'get-pocket')
    ),
    'rounded'       => true,
    'style'         => 'default',
) ); 

if( $atom['rounded'] ) 
    $atom['style'] .= ' components-rounded';

if( $atom['fixed'] ) 
    $atom['style'] .= ' atom-share-fixed'

if( $atom['background'] ) 
    $atom['style'] .= ' components-background'; ?>

<div class="atom-share <?php echo $atom['style']; ?>">
    
    <?php foreach( $atom['networks'] as $network => $values ) { ?>
    
        <a class="components-network components-<?php echo $network; ?>" href="<?php echo $values['url']; ?>" target="_blank" rel="_nofollow">
            <?php if( isset($values['icon']) ) { ?>
                <i class="fa fa-<?php echo $values['icon']; ?>"></i>
            <?php } ?>
            <?php if( isset($values['title']) ) { ?>
                <span><?php echo $values['title']; ?></span>
            <?php } ?>
        </a>
    
    <?php } ?>
    
</div>