<?php
/**
 * WPC Type Block - Server-side render
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 */

// Build atom properties from block attributes
$atom = [
    'name' => $attributes['name'] ?? '',
    'type' => $attributes['type'] ?? '',
];

// Add custom class if set
if (!empty($attributes['className'])) {
    $atom['attributes']['class'] = $attributes['className'];
}

// Render the component
if (class_exists('MakeitWorkPress\WP_Components\Build')) {
    MakeitWorkPress\WP_Components\Build::atom('type', $atom);
}
