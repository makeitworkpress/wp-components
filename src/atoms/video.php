<?php
/**
 * Represents a video object
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'placer'    => 'atom-video-placer',
    'video'     => '' // Expects an embed code for a video object or a video html tag or a src
) );

// Return if we do not have a video
if( ! $atom['video'] )
    return;

// Format our video if it's just an url
if( strpos($atom['video'], 'http') === 0 ) {
    $atom['video'] = do_shortcode('[video src="' . $atom['video'] . '"]');
    $atom['placer'] = 'atom-video-wp';
} ?>

<div class="atom-video <?php echo $atom['style']; ?>" itemprop="video" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <div class="<?php echo $atom['placer']; ?>" itemscope="itemscope" itemtype="http://schema.org/VideoObject">
        <?php echo $atom['video']; ?>
    </div>
</div>