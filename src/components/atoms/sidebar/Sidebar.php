<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a WordPress sidebar
 */
class Sidebar extends Component
{
    public static $block = [
        "name" => "wpc/sidebar",
        "title" => "Sidebar",
        "description" => "Displays a WordPress sidebar with widgets.",
        "category" => "wpc-atoms",
        "icon" => "columns",
        "keywords" => ["sidebar", "widgets", "aside"],
    ];

    public static $atts = [
        "sidebars" => ["type" => "array", "default" => []],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $atom["attributes"]["itemscope"] = "itemscope";
        $atom["attributes"]["itemtype"] = "http://www.schema.org/WPSideBar";

        return $atom;
    }
}
