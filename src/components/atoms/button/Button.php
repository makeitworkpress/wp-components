<?php
namespace MakeItWorkPress\WPComponents\Components\Atoms;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Represents a button
 */
class Button extends Component
{
    public static $block = [
        "name" => "wpc/button",
        "title" => "Button",
        "description" => "A button component with optional icons and link.",
        "category" => "wpc-atoms",
        "icon" => "button",
        "keywords" => ["button", "link", "cta"],
    ];

    public static $atts = [
        "attributes" => [
            "type" => "object",
            "default" => [
                "href" => "post",
                "target" => "_self",
            ],
            "properties" => [
                "href" => ["type" => "string"],
                "target" => ["type" => "string"],
            ],
        ],
        "icon_visible" => ["type" => "object", "default" => ""],
        "icon_after" => ["type" => "string", "default" => ""],
        "icon_before" => ["type" => "string", "default" => ""],
        "label" => ["type" => "string", "default" => ""],
        "size" => [
            "type" => "string",
            "default" => "",
            "enum" => ["none", "small", "medium", "large"],
        ],
    ];

    /**
     * Prepares the attributes for the button
     * @param array $atom The full atom properties
     */
    protected function prepare_attributes(array $atom): array
    {
        // Icon visibility, but only if an icon is defined
        if (
            $atom["icon_visible"] &&
            ($atom["icon_after"] || $atom["icon_before"])
        ) {
            $atom["attributes"]["class"] .=
                " atom-button-" . $atom["icon_visible"];
        }

        // Default background
        if (!isset($atom["background"])) {
            $atom["attributes"]["class"] .= " components-light-background";
        }

        // Adjusted class for the size
        if ($atom["size"]) {
            $atom["attributes"]["class"] .= " atom-button-" . $atom["size"];
        }

        // If we are still using the link attribute
        if (isset($atom["link"])) {
            $atom["attributes"]["href"] = $atom["link"];
        }

        // Custom link to a post
        if ($atom["attributes"]["href"] == "post") {
            $atom["attributes"]["href"] = esc_url(get_permalink());
        }

        return $atom;
    }
}
