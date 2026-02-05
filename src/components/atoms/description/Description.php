<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a description/subtitle
 */
class Description extends Component
{
    public static $block = [
        "name" => "wpc/description",
        "title" => "Description",
        "description" => "Displays a description or subtitle.",
        "category" => "wpc-atoms",
        "icon" => "editor-paragraph",
        "keywords" => ["description", "subtitle", "text"],
    ];

    public static $atts = [
        "description" => ["type" => "string", "default" => ""],
        "schema" => ["type" => "boolean", "default" => true],
        "tag" => [
            "type" => "string",
            "default" => "p",
            "enum" => ["p", "span", "div"],
        ],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if ($atom["schema"]) {
            $atom["attributes"]["itemprop"] = "description";
        }

        return $atom;
    }
}
