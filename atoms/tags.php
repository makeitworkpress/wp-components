<?php
/**
 * Represents a list of clickable tags from a certain taxonomy
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'args'      => array('taxonomy' => 'post_tag'), // Arguments for retrieving the tags
    'display'   => 'button',                        // Way of display, accepts button or list
    'style'     => 'default'
) );

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