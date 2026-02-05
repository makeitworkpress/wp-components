<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a search form
 */
class Search extends Component
{
    public static $block = [
        "name" => "wpc/search",
        "title" => "Search",
        "description" => "Displays a search form with optional AJAX.",
        "category" => "wpc-atoms",
        "icon" => "search",
        "keywords" => ["search", "form", "find"],
    ];

    public static $atts = [
        "ajax" => ["type" => "boolean", "default" => false],
        "all" => ["type" => "string", "default" => "View all search results"],
        "collapse" => ["type" => "boolean", "default" => false],
        "form" => ["type" => "string", "default" => ""],
        "link" => ["type" => "string", "default" => ""],
        "types" => ["type" => "array", "default" => []],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if (empty($atom["form"])) {
            $atom["form"] = get_search_form(false);
        }
        if (empty($atom["link"])) {
            $atom["link"] = esc_url(get_search_link(""));
        }

        if ($atom["collapse"]) {
            $atom["attributes"]["class"] .= " atom-search-collapse";
        }

        if ($atom["ajax"]) {
            $atom["attributes"]["class"] .= " atom-search-ajax";
            $atom["attributes"]["data"]["appear"] = "bottom";
            $atom["attributes"]["data"]["delay"] = 500;
            $atom["attributes"]["data"]["length"] = 3;
            $atom["attributes"]["data"]["none"] = __("Bummer! No results found", "flavor");
            $atom["attributes"]["data"]["number"] = 5;
        }

        // Post types
        $types = isset($_GET["post_type"]) && $_GET["post_type"] ? sanitize_text_field($_GET["post_type"]) : "";
        if ($atom["types"]) {
            $types = $types ?: implode(",", $atom["types"]);
        }

        if ($types) {
            $atom["attributes"]["data"]["types"] = $types;
            $atom["form"] = str_replace(
                "</form>",
                '<input type="hidden" name="post_type" value="' . $types . '"></form>',
                $atom["form"]
            );
        }

        return $atom;
    }
}
