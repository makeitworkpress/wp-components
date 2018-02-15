<?php
/**
 * Represents a video object
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, array(
    'attributes'    => [
        'itemprop' => 'video'
    ],    
    'placer'    => 'atom-video-placer', // Our container class for the video, uses the 56.25% padding rule to make the video responsive
    'video'     => ''                   // Expects an embed code for a video object or a video html tag or a src
) );

// Return if we do not have a video
if( ! $atom['video'] ) {
    return;
}

// Format our video if it's just an url
if( strpos($atom['video'], 'http') === 0 ) {
    $atom['video']  = do_shortcode('[video src="' . $atom['video'] . '"]');
    $atom['placer'] = 'atom-video-wp';
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    <div class="<?php echo $atom['placer']; ?>" itemscope="itemscope" itemtype="http://schema.org/VideoObject">
        <?php echo $atom['video']; ?>
    </div>
</div>