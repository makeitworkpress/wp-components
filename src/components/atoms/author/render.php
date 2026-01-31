<?php
/**
 * WPC Author Block - Server-side Render
 */

defined("ABSPATH") || exit();

$atom_properties = [
    "image_float" => sanitize_text_field($attributes["imageFloat"] ?? "none"),
    "image_rounded" => !empty($attributes["imageRounded"]),
    "prepend" => sanitize_text_field($attributes["prepend"] ?? ""),
    "job_title" => sanitize_text_field($attributes["jobTitle"] ?? ""),
    "schema" => $attributes["schema"] ?? true,
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (empty($attributes["showAvatar"])) {
    $atom_properties["avatar"] = false;
}

if (empty($attributes["showName"])) {
    $atom_properties["name"] = false;
}

if (empty($attributes["showDescription"])) {
    $atom_properties["description"] = false;
}

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("author", $atom_properties);
