<?php
defined("ABSPATH") || exit();

$molecule_properties = [
    "container" => $attributes["container"] ?? true,
    "columns" => absint($attributes["columns"] ?? 4),
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["align"])) {
    $molecule_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

if (!empty($content)) {
    echo '<footer class="molecule molecule-footer ' . esc_attr($molecule_properties["attributes"]["class"]) . '">';
    if ($molecule_properties["container"]) echo '<div class="components-container">';
    echo $content;
    if ($molecule_properties["container"]) echo '</div>';
    echo '</footer>';
} else {
    MakeitWorkPress\WP_Components\Build::molecule("footer", $molecule_properties);
}
