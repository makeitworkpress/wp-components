<?php
defined("ABSPATH") || exit();

$slides = [];
if (!empty($attributes["slides"]) && is_array($attributes["slides"])) {
    foreach ($attributes["slides"] as $slide) {
        $slides[] = [
            "image" => ["image" => absint($slide["id"] ?? 0), "size" => "large"],
        ];
    }
}

if (empty($slides)) return "";

$molecule_properties = [
    "slides" => $slides,
    "options" => [
        "autoplay" => !empty($attributes["autoplay"]),
        "autoplayTimeout" => absint($attributes["autoplaySpeed"] ?? 5000),
        "controls" => $attributes["arrows"] ?? true,
        "nav" => $attributes["dots"] ?? true,
        "loop" => $attributes["loop"] ?? true,
        "speed" => absint($attributes["speed"] ?? 500),
        "items" => absint($attributes["slidesToShow"] ?? 1),
    ],
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $molecule_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::molecule("slider", $molecule_properties);
