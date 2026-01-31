<?php
defined("ABSPATH") || exit();

$molecule_properties = [
    "container" => $attributes["container"] ?? true,
    "fullheight" => !empty($attributes["fullHeight"]),
    "parallax" => !empty($attributes["parallax"]),
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["backgroundImage"])) {
    $molecule_properties["background"] = absint($attributes["backgroundImage"]);
}

if (!empty($attributes["backgroundColor"])) {
    $molecule_properties["background_color"] = sanitize_hex_color($attributes["backgroundColor"]);
}

if (!empty($attributes["overlayColor"])) {
    $molecule_properties["overlay"] = [
        "color" => sanitize_text_field($attributes["overlayColor"]),
        "opacity" => floatval($attributes["overlayOpacity"] ?? 0.5),
    ];
}

if (!empty($attributes["videoBackground"])) {
    $molecule_properties["video"] = esc_url($attributes["videoBackground"]);
}

if (!empty($attributes["align"])) {
    $molecule_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

if (!empty($content)) {
    $class = "molecule molecule-section " . $molecule_properties["attributes"]["class"];
    if ($molecule_properties["fullheight"]) $class .= " molecule-section-fullheight";
    if ($molecule_properties["parallax"]) $class .= " molecule-section-parallax";

    echo '<section class="' . esc_attr($class) . '">';
    if ($molecule_properties["container"]) echo '<div class="components-container">';
    echo $content;
    if ($molecule_properties["container"]) echo '</div>';
    echo '</section>';
} else {
    MakeitWorkPress\WP_Components\Build::molecule("section", $molecule_properties);
}
