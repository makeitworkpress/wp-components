<?php
/**
 * Represents a video object
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'attributes'    => [
        'itemprop'  => 'video'
    ],
    'date'          => '',                  // The schematic data for a video      
    'description'   => '',                  // The schematic description for the video    
    'name'          => '',                  // The schematic name for the video    
    'placer'        => 'atom-video-placer', // Our container class for the video, uses the 56.25% padding rule to make the video responsive
    'schema'        => true,                // If microdata is rendered or not. Also removes schematic attributes
    'thumbnail'     => '',                  // The schematic thumbnail url for the video 
    'video'         => '',                  // Expects an embed code for a video object or a video html tag or a src
    'videoHeight'   => '' ,                 // A custom height for the video
    'videoWidth'    => ''                   // A custom width for the video
] );

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
        <?php if( $atom['schema'] ) { ?>
            <?php if( $atom['date'] ) { ?>
                <meta  itemprop="uploadDate" content="<?php echo esc_attr($atom['date']); ?>" />    
            <?php } ?>  
            <?php if( $atom['description'] ) { ?>
                <meta itemprop="description" content="<?php echo esc_attr($atom['description']); ?>" />
            <?php } ?>
            <?php if( $atom['name'] ) { ?>
                <meta itemprop="name" content="<?php echo esc_attr($atom['name']); ?>" />
            <?php } ?>            
            <?php if( $atom['thumbnail'] ) { ?>
                <meta itemprop="thumbnailUrl" content="<?php echo esc_url($atom['thumbnail']); ?>" />    
            <?php } ?>                               
        <?php } ?>
    </div>
</div>