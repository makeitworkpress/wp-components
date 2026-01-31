<?php
/**
 * WPC Tabs Block - Server-side Render
 */

defined("ABSPATH") || exit();

if (empty($attributes["tabs"]) || !is_array($attributes["tabs"])) {
    return "";
}

$tabs = [];
foreach ($attributes["tabs"] as $tab) {
    $id = sanitize_key($tab["id"] ?? uniqid());
    $tabs[$id] = [
        "title" => wp_kses_post($tab["title"] ?? ""),
        "content" => wp_kses_post($tab["content"] ?? ""),
        "icon" => sanitize_text_field($tab["icon"] ?? ""),
    ];
}

$atom_properties = [
    "tabs" => $tabs,
    "position" => sanitize_text_field($attributes["position"] ?? "top"),
    "hover_item" => sanitize_text_field($attributes["hoverItem"] ?? ""),
    "attributes" => [
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

if (!empty($attributes["align"])) {
    $atom_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::atom("tabs", $atom_properties);
