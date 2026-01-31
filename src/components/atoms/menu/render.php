<?php
/**
 * WPC Menu Block - Server-side Render
 */

defined("ABSPATH") || exit();

$atom_properties = [
    "hamburger" => !empty($attributes["hamburger"]),
    "dropdown" => sanitize_text_field($attributes["dropdown"] ?? "default"),
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (!empty($attributes["menuLocation"])) {
    $atom_properties["menu"] = sanitize_text_field($attributes["menuLocation"]);
}

if (!empty($attributes["menuId"])) {
    $atom_properties["menu_id"] = absint($attributes["menuId"]);
}

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("menu", $atom_properties);
