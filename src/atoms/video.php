<?php
/**
 * Represents a video object
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, array(
    'attributes'    => [
        'itemprop'  => 'video'
    ],    
    'placer'        => 'atom-video-placer', // Our container class for the video, uses the 56.25% padding rule to make the video responsive
    'schema'        => true,                // If microdata is rendered or not. Also removes schematic attributes
    'video'         => '',                  // Expects an embed code for a video object or a video html tag or a src
    'videoHeight'   => '' ,                 // A custom height for the video
    'videoWidth'    => ''                   // A custom width for the video
) );

// Return if we do not have a video
if( ! $atom['video'] ) {
    return;
}

// Format our video if it's just an url
if( strpos($atom['video'], 'http') === 0 ) {
    $height = $atom['videoHeight'] ? ' height="' . intval($atom['videoHeight']) . '"' : ''; 
    $width  = $atom['videoWidth'] ? ' width="' . intval($atom['videoWidth']) . '"' : ''; 
    $atom['video']  = do_shortcode('[video src="' . $atom['video'] . '"' . $height . $width . ']');
    $atom['placer'] = 'atom-video-wp';
} 

if( ! $atom['schema'] ) {
    unset($atom['attributes']['itemprop']);
}

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    <div class="<?php echo $atom['placer']; ?>" <?php if($atom['schema']) { ?>itemscope="itemscope" itemtype="http://schema.org/VideoObject"<?php } ?>>
        <?php echo $atom['video']; ?>
    </div>
</div>