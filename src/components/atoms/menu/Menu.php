<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a WordPress navigation menu
 */
class Menu extends Component
{
    public static $block = [
        "name" => "wpc/menu",
        "title" => "Menu",
        "description" => "Displays a WordPress navigation menu.",
        "category" => "wpc-atoms",
        "icon" => "menu",
        "keywords" => ["menu", "navigation", "nav"],
    ];

    public static $atts = [
        "args" => ["type" => "object", "default" => []],
        "collapse" => ["type" => "boolean", "default" => false],
        "dropdown" => ["type" => "boolean", "default" => true],
        "hamburger" => [
            "type" => "string",
            "default" => "mobile",
            "enum" => ["mobile", "tablet", "always", ""],
        ],
        "indicator" => ["type" => "boolean", "default" => true],
        "menu" => ["type" => "string", "default" => ""],
        "view" => [
            "type" => "string",
            "default" => "default",
            "enum" => ["default", "dark", "fixed", "left", "right"],
        ],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $atom["attributes"]["itemtype"] = "http://schema.org/SiteNavigationElement";
        $atom["attributes"]["itemscope"] = "itemscope";

        if ($atom["collapse"]) {
            $atom["attributes"]["class"] .= " atom-menu-collapse";
        }

        if (!$atom["dropdown"]) {
            $atom["attributes"]["class"] .= " atom-menu-plain";
        }

        if ($atom["hamburger"] && !in_array($atom["view"], ["fixed", "left", "right"])) {
            $atom["attributes"]["class"] .= " atom-menu-" . $atom["hamburger"] . "-hamburger";
        }

        if ($atom["indicator"]) {
            $atom["attributes"]["class"] .= " atom-menu-indicator";
        }

        if ($atom["view"]) {
            $atom["attributes"]["class"] .= " atom-menu-" . $atom["view"];
        }

        return $atom;
    }
}
