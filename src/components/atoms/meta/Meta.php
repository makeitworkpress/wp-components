<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays raw post metadata
 */
class Meta extends Component
{
    public static $block = [
        "name" => "wpc/meta",
        "title" => "Meta",
        "description" => "Displays raw post metadata.",
        "category" => "wpc-atoms",
        "icon" => "info",
        "keywords" => ["meta", "custom field", "data"],
    ];

    public static $atts = [
        "after" => ["type" => "string", "default" => ""],
        "before" => ["type" => "string", "default" => ""],
        "key" => ["type" => "string", "default" => ""],
        "id" => ["type" => "integer", "default" => 0],
        "meta" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if (empty($atom["id"])) {
            $atom["id"] = get_the_ID();
        }

        if (!$atom["meta"] && $atom["key"]) {
            $atom["meta"] = get_post_meta($atom["id"], $atom["key"], true);
        }

        return $atom;
    }
}
