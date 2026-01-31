<?php
/**
 * WPC Rating Block - Server-side Render
 */

defined("ABSPATH") || exit();

$atom_properties = [
    "max" => absint($attributes["max"] ?? 5),
    "vote" => !empty($attributes["allowVote"]),
    "count" => !empty($attributes["showCount"]),
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("rate", $atom_properties);
