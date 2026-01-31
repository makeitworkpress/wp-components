<?php
/**
 * WPC Date Block - Server-side render
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 */

// Build atom properties from block attributes
$atom = [
    'date'   => $attributes['date'] ?? '',
    'icon'   => $attributes['icon'] ?? '',
    'schema' => $attributes['schema'] ?? true,
];

// Add custom class if set
if (!empty($attributes['className'])) {
    $atom['attributes']['class'] = $attributes['className'];
}

// Render the component
if (class_exists('MakeitWorkPress\WP_Components\Build')) {
    MakeitWorkPress\WP_Components\Build::atom('date', $atom);
}
