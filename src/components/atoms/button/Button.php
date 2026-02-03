<?php
namespace MakeItWorkPress\WPComponents\Components\Atoms;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Represents a button
 */
class Button extends Component
{
    public static $atts = [
        "icon_visible" => [],
        "icon_after" => false,
        "icon_before" => false,
        "background" => null,
        "size" => null,
        "link" => null,
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
