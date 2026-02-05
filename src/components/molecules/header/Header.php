<?php
namespace MakeitWorkPress\WP_Components\Components\Molecules;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a generic WordPress header
 */
class Header extends Component
{
    public static $block = [
        "name" => "wpc/header",
        "title" => "Header",
        "description" => "Displays a WordPress header with navigation and atoms.",
        "category" => "wpc-molecules",
        "icon" => "minus",
        "keywords" => ["header", "top", "navigation"],
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
        "fixed" => ["type" => "boolean", "default" => true],
        "headroom" => ["type" => "boolean", "default" => false],
        "shrink" => ["type" => "boolean", "default" => false],
        "socket_atoms" => [
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
        "transparent" => ["type" => "boolean", "default" => false],
        "top_atoms" => [
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
        "video" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $molecule): array
    {
        $molecule["attributes"]["class"] .= " molecule-header-top";

        if (!isset($molecule["attributes"]["itemscope"])) {
            $molecule["attributes"]["itemscope"] = "itemscope";
        }
        if (!isset($molecule["attributes"]["itemtype"])) {
            $molecule["attributes"]["itemtype"] = "http://schema.org/WPHeader";
        }

        if ($molecule["fixed"]) {
            $molecule["attributes"]["class"] .= " molecule-header-fixed";
        }

        if ($molecule["headroom"]) {
            $molecule["attributes"]["class"] .= " molecule-header-headroom";
        }

        if ($molecule["shrink"]) {
            $molecule["attributes"]["class"] .= " molecule-header-shrink";
        }

        if ($molecule["transparent"]) {
            $molecule["attributes"]["class"] .= " molecule-header-transparent";
        }

        return $molecule;
    }
}
