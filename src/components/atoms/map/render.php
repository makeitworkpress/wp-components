<?php
/**
 * WPC Map Block - Server-side Render
 */

defined("ABSPATH") || exit();

if (empty($attributes["lat"]) || empty($attributes["lng"])) {
    return "";
}

$atom_properties = [
    "lat" => sanitize_text_field($attributes["lat"]),
    "lng" => sanitize_text_field($attributes["lng"]),
    "zoom" => absint($attributes["zoom"] ?? 14),
    "height" => sanitize_text_field($attributes["height"] ?? "400px"),
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (!empty($attributes["markers"]) && is_array($attributes["markers"])) {
    $atom_properties["markers"] = $attributes["markers"];
}

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("map", $atom_properties);
