<?php
/**
 * WPC Scroll Button Block - Server-side Render
 */

defined("ABSPATH") || exit();

$atom_properties = [
    "icon" => sanitize_text_field($attributes["icon"] ?? "fas fa-chevron-down"),
    "target" => sanitize_text_field($attributes["target"] ?? ""),
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("scroll", $atom_properties);
