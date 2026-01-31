<?php
defined("ABSPATH") || exit();

if (empty($attributes["src"])) return "";

$atom_properties = [
    "src" => esc_url($attributes["src"]),
    "poster" => absint($attributes["poster"] ?? 0),
    "autoplay" => !empty($attributes["autoplay"]),
    "loop" => !empty($attributes["loop"]),
    "muted" => !empty($attributes["muted"]),
    "controls" => $attributes["controls"] ?? true,
    "schema" => $attributes["schema"] ?? true,
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("video", $atom_properties);
