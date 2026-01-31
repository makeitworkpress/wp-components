<?php
defined("ABSPATH") || exit();

$atom_properties = [
    "taxonomy" => sanitize_text_field($attributes["taxonomy"] ?? "category"),
    "separator" => sanitize_text_field($attributes["separator"] ?? ", "),
    "link" => $attributes["link"] ?? true,
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

MakeitWorkPress\WP_Components\Build::atom("terms", $atom_properties);
