<?php
defined("ABSPATH") || exit();

$atom_properties = [
    "image" => absint($attributes["image"] ?? 0),
    "mobile_image" => absint($attributes["mobileImage"] ?? 0),
    "link" => sanitize_text_field($attributes["link"] ?? "home"),
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("logo", $atom_properties);
