<?php
defined("ABSPATH") || exit();

$profiles = [];
if (!empty($attributes["profiles"]) && is_array($attributes["profiles"])) {
    foreach ($attributes["profiles"] as $profile) {
        $profiles[] = [
            "network" => sanitize_text_field($profile["network"] ?? ""),
            "url" => esc_url($profile["url"] ?? ""),
            "icon" => sanitize_text_field($profile["icon"] ?? ""),
        ];
    }
}

$atom_properties = [
    "profiles" => $profiles,
    "labels" => !empty($attributes["showLabels"]),
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("social", $atom_properties);
