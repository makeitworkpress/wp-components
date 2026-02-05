<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a video
 */
class Video extends Component
{
    public static $block = [
        "name" => "wpc/video",
        "title" => "Video",
        "description" => "Displays an embedded video.",
        "category" => "wpc-atoms",
        "icon" => "video-alt3",
        "keywords" => ["video", "embed", "youtube", "vimeo"],
    ];

    public static $atts = [
        "date" => ["type" => "string", "default" => ""],
        "description" => ["type" => "string", "default" => ""],
        "name" => ["type" => "string", "default" => ""],
        "placer" => ["type" => "string", "default" => "atom-video-placer"],
        "schema" => ["type" => "boolean", "default" => true],
        "thumbnail" => ["type" => "string", "default" => ""],
        "video" => ["type" => "string", "default" => ""],
        "video_height" => ["type" => "string", "default" => ""],
        "video_width" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        // Format video if it's just a URL
        if (strpos($atom["video"], "http") === 0) {
            $height = $atom["video_height"] ? ' height="' . intval($atom["video_height"]) . '"' : "";
            $width = $atom["video_width"] ? ' width="' . intval($atom["video_width"]) . '"' : "";
            $atom["video"] = do_shortcode('[video src="' . $atom["video"] . '"' . $height . $width . ']');
            $atom["placer"] = "atom-video-wp";
        }

        if ($atom["schema"]) {
            $atom["attributes"]["itemprop"] = "video";
        }

        return $atom;
    }
}
