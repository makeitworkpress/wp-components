<?php
/**
 * Represents a button
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'style'     => 'default',
    'video'     => '', // Expects an embed code for a video object or a video html tag
) );

$atom['image'] = get_the_post_thumbnail( null, $atom['size'], array('itemprop' => $atom['schema']) );

// Return if we do not have a video
if( ! $atom['video'] )
    return;

// Format our video if it's just an url

?>

<div class="atom-video <?php echo $atom['style']; ?>" itemprop="video">
    <div class="atom-video-placer" itemscope="itemscope" itemtype="http://schema.org/VideoObject">
        <?php echo $atom['video']; ?>
    </div>
</div>