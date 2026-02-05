<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a modal popup
 */
class Modal extends Component
{
    public static $block = [
        "name" => "wpc/modal",
        "title" => "Modal",
        "description" => "Displays a modal popup.",
        "category" => "wpc-atoms",
        "icon" => "welcome-widgets-menus",
        "keywords" => ["modal", "popup", "dialog"],
    ];

    public static $atts = [
        "content" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $atom["attributes"]["data"]["id"] = uniqid();

        return $atom;
    }
}
