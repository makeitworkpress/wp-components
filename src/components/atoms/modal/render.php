<?php
/**
 * WPC Modal Block - Server-side Render
 */

defined("ABSPATH") || exit();

$atom_properties = [
    "content" => wp_kses_post($attributes["content"] ?? ""),
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
        "data" => [
            "id" => sanitize_text_field($attributes["modalId"] ?? uniqid()),
        ],
    ],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("modal", $atom_properties);
