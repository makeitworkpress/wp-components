<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a list of items
 */
class List extends Component
{
    public static $block = [
        "name" => "wpc/list",
        "title" => "List",
        "description" => "Displays a list of items with icons.",
        "category" => "wpc-atoms",
        "icon" => "list-view",
        "keywords" => ["list", "items", "features"],
    ];

    public static $atts = [
        "grid" => ["type" => "boolean", "default" => false],
        "grid_gap" => ["type" => "string", "default" => "default"],
        "hover_item" => ["type" => "string", "default" => ""],
        "items" => ["type" => "array", "default" => []],
        "style" => [
            "type" => "string",
            "default" => "default",
            "enum" => ["default", "card"],
        ],
        "title_tag" => ["type" => "string", "default" => "h4"],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $atom["attributes"]["class"] .= " components-list-" . $atom["style"];

        if ($atom["grid"]) {
            $atom["attributes"]["class"] .= " components-grid-wrapper components-grid-" . $atom["grid_gap"];
        }

        return $atom;
    }
}
