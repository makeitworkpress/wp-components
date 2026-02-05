<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays tabbed content
 */
class Tabs extends Component
{
    public static $block = [
        "name" => "wpc/tabs",
        "title" => "Tabs",
        "description" => "Displays tabbed content sections.",
        "category" => "wpc-atoms",
        "icon" => "table-row-after",
        "keywords" => ["tabs", "sections", "content"],
    ];

    public static $atts = [
        "hover_item" => ["type" => "string", "default" => ""],
        "position" => [
            "type" => "string",
            "default" => "top",
            "enum" => ["top", "bottom", "left", "right"],
        ],
        "tabs" => ["type" => "array", "default" => []],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $atom["attributes"]["class"] .= " atom-tabs-" . $atom["position"];

        return $atom;
    }
}
