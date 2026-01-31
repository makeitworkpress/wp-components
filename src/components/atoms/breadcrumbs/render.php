<?php
defined("ABSPATH") || exit();

$atom_properties = [
    "separator" => sanitize_text_field($attributes["separator"] ?? "/"),
    "home" => !empty($attributes["showHome"]),
    "home_label" => sanitize_text_field($attributes["homeLabel"] ?? __("Home", "wp-components")),
    "schema" => $attributes["schema"] ?? true,
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("breadcrumbs", $atom_properties);
