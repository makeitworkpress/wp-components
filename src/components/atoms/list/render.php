<?php
defined("ABSPATH") || exit();

$items = array_map("wp_kses_post", $attributes["items"] ?? []);
if (empty($items)) return "";

$atom_properties = [
    "items" => $items,
    "icon" => sanitize_text_field($attributes["icon"] ?? ""),
    "ordered" => !empty($attributes["ordered"]),
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("list", $atom_properties);
