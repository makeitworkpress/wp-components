<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays clickable terms from a taxonomy
 */
class Terms extends Component
{
    public static $block = [
        "name" => "wpc/terms",
        "title" => "Terms",
        "description" => "Displays clickable terms from a taxonomy.",
        "category" => "wpc-atoms",
        "icon" => "category",
        "keywords" => ["terms", "taxonomy", "filter", "tags"],
    ];

    public static $atts = [
        "after" => ["type" => "string", "default" => ""],
        "args" => ["type" => "object", "default" => ["taxonomy" => "post_tag"]],
        "before" => ["type" => "string", "default" => ""],
        "hover_item" => ["type" => "string", "default" => ""],
        "seperator" => ["type" => "string", "default" => "/"],
        "terms" => ["type" => "array", "default" => []],
        "term_style" => [
            "type" => "string",
            "default" => "normal",
            "enum" => ["normal", "button"],
        ],
    ];

    protected function prepare_attributes(array $atom): array
    {
        // Get terms if not provided
        if (empty($atom["terms"])) {
            $atom["terms"] = get_terms($atom["args"]);
        }

        // Save taxonomy for filtering
        if (isset($atom["args"]["taxonomy"])) {
            $atom["attributes"]["data"]["taxonomy"] = $atom["args"]["taxonomy"];
        }

        return $atom;
    }
}
