<?php
/**
 * WPC Button Block - Server-side Render
 *
 * Renders the Button block on the frontend using the existing Button atom.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content (unused).
 * @param WP_Block $block      Block instance.
 * @return string  Rendered button HTML.
 */

defined("ABSPATH") || exit();

// Don't render if no label is set
if (empty($attributes["label"])) {
    return "";
}

// Build the atom properties from block attributes
$atom_properties = [
    "label" => wp_kses_post($attributes["label"]),
    "icon_before" => sanitize_text_field($attributes["iconBefore"] ?? ""),
    "icon_after" => sanitize_text_field($attributes["iconAfter"] ?? ""),
    "icon_visible" => sanitize_text_field(
        $attributes["iconVisible"] ?? "standard",
    ),
    "size" => sanitize_text_field($attributes["size"] ?? ""),
    "attributes" => [
        "href" => esc_url($attributes["url"] ?? ""),
        "target" => sanitize_text_field($attributes["linkTarget"] ?? "_self"),
        "class" => sanitize_text_field($attributes["className"] ?? ""),
    ],
];

// Add rel="noopener" for external links
if ($atom_properties["attributes"]["target"] === "_blank") {
    $atom_properties["attributes"]["rel"] = "noopener noreferrer";
}

// Handle background color
if (!empty($attributes["backgroundColor"])) {
    $atom_properties["background"] = sanitize_text_field(
        $attributes["backgroundColor"],
    );
}

// Handle text color
if (!empty($attributes["textColor"])) {
    $atom_properties["color"] = sanitize_text_field($attributes["textColor"]);
}

// Handle block alignment
if (!empty($attributes["align"])) {
    $atom_properties["align"] = sanitize_text_field($attributes["align"]);
}

// Render using the existing Button atom and return the output
MakeitWorkPress\WP_Components\Build::atom("button", $atom_properties);
