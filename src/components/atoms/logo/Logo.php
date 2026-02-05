<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a site logo
 */
class Logo extends Component
{
    public static $block = [
        "name" => "wpc/logo",
        "title" => "Logo",
        "description" => "Displays the site logo or title.",
        "category" => "wpc-atoms",
        "icon" => "format-image",
        "keywords" => ["logo", "brand", "site"],
    ];

    public static $atts = [
        "alt" => ["type" => "string", "default" => "Logo"],
        "default" => ["type" => "integer", "default" => 0],
        "default_transparent" => ["type" => "object", "default" => []],
        "mobile" => ["type" => "object", "default" => []],
        "mobile_transparent" => ["type" => "object", "default" => []],
        "mode" => [
            "type" => "string",
            "default" => "logo",
            "enum" => ["logo", "title"],
        ],
        "schema" => ["type" => "boolean", "default" => true],
        "size" => ["type" => "string", "default" => "medium"],
        "tablet" => ["type" => "object", "default" => []],
        "tablet_transparent" => ["type" => "object", "default" => []],
        "title" => ["type" => "string", "default" => ""],
        "url" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        // Set defaults
        if (empty($atom["default"])) {
            $atom["default"] = get_theme_mod("custom_logo");
        }
        if (empty($atom["title"])) {
            $atom["title"] = esc_attr(get_bloginfo("name"));
        }
        if (empty($atom["url"])) {
            $atom["url"] = esc_url(get_bloginfo("url"));
        }

        $atom["attributes"]["href"] = esc_url(home_url("/"));

        if ($atom["schema"]) {
            $atom["attributes"]["itemscope"] = "itemscope";
            $atom["attributes"]["itemtype"] = "http://schema.org/Organization";
        }

        return $atom;
    }
}
