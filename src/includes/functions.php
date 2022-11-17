<?php
/**
 * Contains utility functions
 */
defined( 'ABSPATH' ) or die( 'Go eat veggies!' );

/**
 * Short function for rendering an atom
 * 
 * @param string    $type       The molecule to render
 * @param array     $properties The properties for this molecule
 * @param boolean   $render     Whether to render or return this atom
 * 
 * @return void/string          The rendered atom
 */
function wpc_atom( string $type = '', array $properties = [], bool $render = true ) {

    if( ! class_exists('MakeitWorkPress\WP_Components\Build') || ! $type ) {
        return;
    }

    if( $render ) {
        MakeitWorkPress\WP_Components\Build::atom( $type, $properties, $render );
    } else {
        return MakeitWorkPress\WP_Components\Build::atom( $type, $properties, $render );
    }

}

/** 
 * Short function for rendering a molecule
 * 
 * @param string    $type       The molecule to render
 * @param array     $properties The properties for this molecule
 * @param boolean   $render     Whether to render or return this molecule
 * 
 * @return void/string          The rendered molecule
 */
function wpc_molecule( string $type = '', array $properties = [], bool $render = true  ) {

    if( ! class_exists('MakeitWorkPress\WP_Components\Build') || ! $type ) {
        return;
    }

    if( $render ) {
        MakeitWorkPress\WP_Components\Build::molecule( $type, $properties, $render );
    } else {
        return MakeitWorkPress\WP_Components\Build::molecule( $type, $properties, $render );
    }

}

/**
 * Generates the attributes for a component
 * 
 * @param array $attributes The array with attributes
 * 
 * @return array            The generated attributes
 */
function wpc_attributes( array $attributes = [] ): array {
    return MakeitWorkPress\WP_Components\Build::attributes( $attributes );
}

/**
 * Parses arguments in a multidimensional way
 * 
 * @param array $defaults   The array with default attributes
 * @param array $parameters The array with added parameters
 * 
 * @return array            The parsed parameters
 */
function wpc_multi_parse( array $defaults = [], array $parameters = [] ): array {
    return MakeitWorkPress\WP_Components\Build::multi_parse_args( $defaults, $parameters );
}