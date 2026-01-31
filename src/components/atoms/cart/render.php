<?php
/**
 * WPC Cart Block - Server-side Render
 */

defined("ABSPATH") || exit();

$atom_properties = [
    "icon" => sanitize_text_field($attributes["icon"] ?? "fas fa-shopping-cart"),
    "count" => !empty($attributes["showCount"]),
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("cart", $atom_properties);
