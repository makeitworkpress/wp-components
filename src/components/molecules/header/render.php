<?php
defined("ABSPATH") || exit();

$molecule_properties = [
    "fixed" => $attributes["fixed"] ?? true,
    "transparent" => !empty($attributes["transparent"]),
    "shrink" => !empty($attributes["shrink"]),
    "headroom" => !empty($attributes["headroom"]),
    "container" => $attributes["container"] ?? true,
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $molecule_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

// For block editor inner blocks content
if (!empty($content)) {
    echo '<header class="molecule molecule-header ' . esc_attr($molecule_properties["attributes"]["class"]) . '">';
    if ($molecule_properties["container"]) echo '<div class="components-container">';
    echo $content;
    if ($molecule_properties["container"]) echo '</div>';
    echo '</header>';
} else {
    MakeitWorkPress\WP_Components\Build::molecule("header", $molecule_properties);
}
