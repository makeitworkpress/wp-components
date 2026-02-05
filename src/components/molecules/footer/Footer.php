<?php
namespace MakeitWorkPress\WP_Components\Components\Molecules;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a generic WordPress footer
 */
class Footer extends Component
{
    public static $block = [
        "name" => "wpc/footer",
        "title" => "Footer",
        "description" => "Displays a WordPress footer with sidebars and atoms.",
        "category" => "wpc-molecules",
        "icon" => "minus",
        "keywords" => ["footer", "bottom", "sidebars"],
    ];

    public static $atts = [
        "atoms" => [
            "type" => "array",
            "default" => [],
            "items" => [
                "type" => "object",
                "properties" => [
                    "atom" => ["type" => "string"],
                    "properties" => ["type" => "object"],
                ],
            ],
        ],
        "container" => ["type" => "boolean", "default" => true],
        "grid_gap" => ["type" => "string", "default" => "default"],
        "sidebars" => [
            "type" => "object",
            "default" => [],
        ],
        "video" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $molecule): array
    {
        if (!isset($molecule["attributes"]["itemscope"])) {
            $molecule["attributes"]["itemscope"] = "itemscope";
        }
        if (!isset($molecule["attributes"]["itemtype"])) {
            $molecule["attributes"]["itemtype"] = "http://schema.org/WPFooter";
        }

        return $molecule;
    }
}
