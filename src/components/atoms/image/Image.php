<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a featured image
 */
class Image extends Component
{
    public static $block = [
        "name" => "wpc/image",
        "title" => "Image",
        "description" => "Displays a featured image.",
        "category" => "wpc-atoms",
        "icon" => "format-image",
        "keywords" => ["image", "picture", "thumbnail", "featured"],
    ];

    public static $atts = [
        "enlarge" => ["type" => "boolean", "default" => false],
        "image" => ["type" => "string", "default" => ""],
        "link" => ["type" => "string", "default" => ""],
        "post" => ["type" => "integer", "default" => 0],
        "schema" => ["type" => "boolean", "default" => true],
        "size" => ["type" => "string", "default" => "large"],
    ];

    protected function prepare_attributes(array $atom): array
    {
        // Link to post
        if ($atom["link"] == "post") {
            $atom["link"] = is_numeric($atom["post"]) || is_object($atom["post"])
                ? esc_url(get_permalink($atom["post"]))
                : esc_url(get_permalink());
        }

        if ($atom["enlarge"]) {
            $atom["attributes"]["class"] .= " atom-image-enlarge";
        }

        return $atom;
    }
}
