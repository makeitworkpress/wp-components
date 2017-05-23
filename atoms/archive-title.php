<?php
/**
 * Represents a title in an archive
 */
global $wp_query;

// Atom values
$atom = wp_parse_args( $atom, array(
    'author'    => '',
    'category'  => '',
    'day'       => '',
    'month'     => '',
    'style'     => 'default',
    'taxonomy'  => '',
    'year'      => '',
) ); ?>