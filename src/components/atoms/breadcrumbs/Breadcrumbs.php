<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays breadcrumb navigation
 */
class Breadcrumbs extends Component
{
    public static $block = [
        "name" => "wpc/breadcrumbs",
        "title" => "Breadcrumbs",
        "description" => "Displays breadcrumb navigation.",
        "category" => "wpc-atoms",
        "icon" => "carrot",
        "keywords" => ["breadcrumbs", "navigation", "path"],
    ];

    public static $atts = [
        "archive" => ["type" => "boolean", "default" => false],
        "home" => ["type" => "string", "default" => "Home"],
        "seperator" => ["type" => "string", "default" => "&rsaquo;"],
        "taxonomy" => ["type" => "string", "default" => ""],
        "locations" => ["type" => "object", "default" => []],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $atom["attributes"]["itemscope"] = "itemscope";
        $atom["attributes"]["itemtype"] = "http://schema.org/Breadcrumb";

        return $atom;
    }
}
