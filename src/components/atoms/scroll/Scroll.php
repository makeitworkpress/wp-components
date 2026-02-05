<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a scroll button
 */
class Scroll extends Component
{
    public static $block = [
        "name" => "wpc/scroll",
        "title" => "Scroll",
        "description" => "Displays a scroll-down or scroll-to-top button.",
        "category" => "wpc-atoms",
        "icon" => "arrow-down",
        "keywords" => ["scroll", "top", "down", "arrow"],
    ];

    public static $atts = [
        "icon" => ["type" => "string", "default" => ""],
        "top" => ["type" => "boolean", "default" => false],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if ($atom["top"]) {
            $atom["attributes"]["class"] .= " atom-scroll-top";

            if (!$atom["icon"]) {
                $atom["icon"] = "fas fa-angle-up";
            }
        }

        if ($atom["icon"]) {
            $atom["attributes"]["class"] .= " atom-scroll-hasicon";
        }

        return $atom;
    }
}
