<?php
/**
 * WPC Search Block - Server-side Render
 */

defined("ABSPATH") || exit();

$atom_properties = [
    "ajax" => !empty($attributes["ajax"]),
    "collapse" => !empty($attributes["collapse"]),
    "all" => sanitize_text_field($attributes["allText"] ?? __("View all search results", "wp-components")),
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
        "data" => [
            "delay" => absint($attributes["searchDelay"] ?? 500),
            "length" => absint($attributes["minLength"] ?? 3),
            "number" => absint($attributes["resultsNumber"] ?? 5),
            "none" => sanitize_text_field($attributes["noneText"] ?? __("No results found", "wp-components")),
            "types" => sanitize_text_field($attributes["postTypes"] ?? ""),
        ],
    ],
];

if (!empty($attributes["postTypes"])) {
    $atom_properties["types"] = array_map("trim", explode(",", $attributes["postTypes"]));
}

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("search", $atom_properties);
