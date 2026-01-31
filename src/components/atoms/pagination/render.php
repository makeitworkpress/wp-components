<?php
defined("ABSPATH") || exit();

$atom_properties = [
    "type" => sanitize_text_field($attributes["type"] ?? "numbers"),
    "prev" => sanitize_text_field($attributes["prevText"] ?? __("Previous", "wp-components")),
    "next" => sanitize_text_field($attributes["nextText"] ?? __("Next", "wp-components")),
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("pagination", $atom_properties);
