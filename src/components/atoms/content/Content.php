<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays post content or excerpt
 */
class Content extends Component
{
    public static $block = [
        "name" => "wpc/content",
        "title" => "Content",
        "description" => "Displays post content or excerpt.",
        "category" => "wpc-atoms",
        "icon" => "text",
        "keywords" => ["content", "text", "excerpt", "post"],
    ];

    public static $atts = [
        "content" => ["type" => "string", "default" => ""],
        "schema" => ["type" => "boolean", "default" => true],
        "type" => [
            "type" => "string",
            "default" => "content",
            "enum" => ["content", "excerpt"],
        ],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if ($atom["schema"]) {
            $atom["attributes"]["itemprop"] = "text";
        }

        return $atom;
    }
}
