<?php
/**
 * WPC Title Block - Server-side Render
 */

defined("ABSPATH") || exit();

if (empty($attributes["title"])) {
    return "";
}

$atom_properties = [
    "title" => wp_kses_post($attributes["title"]),
    "tag" => sanitize_text_field($attributes["tag"] ?? "h2"),
    "link" => esc_url($attributes["link"] ?? ""),
    "schema" => $attributes["schema"] ?? true,
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " has-text-align-" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("title", $atom_properties);
