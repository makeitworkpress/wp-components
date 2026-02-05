<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a post type indicator
 */
class Type extends Component
{
    public static $block = [
        "name" => "wpc/type",
        "title" => "Type",
        "description" => "Displays the post type label.",
        "category" => "wpc-atoms",
        "icon" => "admin-post",
        "keywords" => ["type", "post type", "label"],
    ];

    public static $atts = [
        "name" => ["type" => "string", "default" => ""],
        "type" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if (empty($atom["type"])) {
            $atom["type"] = get_post_type();
        }

        if (empty($atom["name"]) && $atom["type"]) {
            $postObject = get_post_type_object($atom["type"]);
            if ($postObject) {
                $atom["name"] = $postObject->labels->singular_name;
            }
        }

        return $atom;
    }
}
