<?php
defined("ABSPATH") || exit();

$atom_properties = [
    "form" => !empty($attributes["showForm"]),
    "avatar" => !empty($attributes["showAvatar"]),
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("comments", $atom_properties);
