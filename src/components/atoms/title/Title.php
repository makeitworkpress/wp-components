<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a title component
 */
class Title extends Component
{
    public static $block = [
        "name" => "wpc/title",
        "title" => "Title",
        "description" => "A title/heading component with optional link.",
        "category" => "wpc-atoms",
        "icon" => "heading",
        "keywords" => ["title", "heading", "h1", "h2"],
    ];

    public static $atts = [
        "link" => ["type" => "string", "default" => ""],
        "schema" => ["type" => "boolean", "default" => true],
        "tag" => [
            "type" => "string",
            "default" => "h1",
            "enum" => ["h1", "h2", "h3", "h4", "h5", "h6"],
        ],
        "title" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        // Schema markup
        if ($atom["schema"]) {
            $atom["attributes"]["itemprop"] = "name";
        }

        // Get title from post if not set
        if (empty($atom["title"])) {
            $atom["title"] = get_the_title();
        }

        // Handle link
        if ($atom["link"] === "post") {
            $atom["link"] = esc_url(get_permalink());
        } elseif ($atom["link"]) {
            $atom["link"] = esc_url($atom["link"]);
        }

        return $atom;
    }
}
