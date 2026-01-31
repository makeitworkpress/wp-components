<?php
/**
 * WPC Share Block - Server-side Render
 */

defined("ABSPATH") || exit();

$networks = $attributes["networks"] ?? ["facebook", "twitter", "linkedin", "email"];

$atom_properties = [
    "networks" => array_map("sanitize_text_field", $networks),
    "labels" => !empty($attributes["showLabels"]),
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("share", $atom_properties);
