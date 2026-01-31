<?php
/**
 * WPC Copyright Block - Server-side render
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 */

// Build atom properties from block attributes
$atom = [
    'copyright' => $attributes['copyright'] ?? '©',
    'date'      => $attributes['date'] ?: date('Y'),
    'name'      => $attributes['name'] ?? '',
    'itemtype'  => $attributes['itemtype'] ?? 'http://schema.org/Organization',
];

// Add custom class if set
if (!empty($attributes['className'])) {
    $atom['attributes']['class'] = $attributes['className'];
}

// Render the component
if (class_exists('MakeitWorkPress\WP_Components\Build')) {
    MakeitWorkPress\WP_Components\Build::atom('copyright', $atom);
}
