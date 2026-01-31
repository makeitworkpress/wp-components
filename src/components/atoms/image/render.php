<?php
/**
 * WPC Image Block - Server-side Render
 */

defined("ABSPATH") || exit();

if (empty($attributes["image"])) {
    return "";
}

$atom_properties = [
    "image" => absint($attributes["image"]),
    "size" => sanitize_text_field($attributes["size"] ?? "large"),
    "link" => esc_url($attributes["link"] ?? ""),
    "enlarge" => !empty($attributes["enlarge"]),
    "schema" => $attributes["schema"] ?? true,
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("image", $atom_properties);
