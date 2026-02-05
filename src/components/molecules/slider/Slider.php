<?php
namespace MakeitWorkPress\WP_Components\Components\Molecules;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a slider component based upon Tiny Slider
 */
class Slider extends Component
{
    public static $block = [
        "name" => "wpc/slider",
        "title" => "Slider",
        "description" => "Displays a slider/carousel with slides containing atoms.",
        "category" => "wpc-molecules",
        "icon" => "slides",
        "keywords" => ["slider", "carousel", "slideshow"],
    ];

    public static $atts = [
        "options" => [
            "type" => "object",
            "default" => [
                "arrowKeys" => true,
                "autoHeight" => true,
                "controlsText" => ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
                "navPosition" => "bottom",
                "mode" => "carousel",
                "mouseDrag" => true,
                "speed" => 500,
            ],
        ],
        "schema" => ["type" => "boolean", "default" => true],
        "scroll" => ["type" => "boolean", "default" => false],
        "slides" => [
            "type" => "array",
            "default" => [],
            "items" => [
                "type" => "object",
                "properties" => [
                    "atoms" => ["type" => "array"],
                    "attributes" => ["type" => "object"],
                    "image" => ["type" => "object"],
                    "video" => ["type" => "object"],
                ],
            ],
        ],
        "thumbnail_size" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $molecule): array
    {
        // Generate unique ID if not set
        if (!isset($molecule["attributes"]["data"])) {
            $molecule["attributes"]["data"] = [];
        }
        if (!isset($molecule["attributes"]["data"]["id"])) {
            $molecule["attributes"]["data"]["id"] = substr(str_shuffle(str_repeat("abcdefghijklmnopqrstuvwxyz", 5)), 0, 8);
        }

        return $molecule;
    }
}
