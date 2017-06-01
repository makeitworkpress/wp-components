<?php
/**
 * Represents a video object
 * @todo Support url only video's, such as video's uploaded by self.
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'video'     => '' // Expects an embed code for a video object or a video html tag or a src
) );

// Return if we do not have a video
if( ! $atom['video'] )
    return;

// Format our video if it's just an url
if( strpos($atom['video'], 'http') === 0 )
    $atom['video'] = do_shortcode('[video src="' . $atom['video'] . '"]'); ?>

<div class="atom-video <?php echo $atom['style']; ?>" itemprop="video">
    <div class="atom-video-placer" itemscope="itemscope" itemtype="http://schema.org/VideoObject">
        <?php echo $atom['video']; ?>
    </div>
</div>