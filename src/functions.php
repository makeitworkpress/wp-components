<?php
/**
 * Short function for rendering an atom
 * 
 * @param string    $type       The molecule to render
 * @param array     $properties The properties for this molecule
 * @param boolean   $render     Whether to render or return this atom
 * 
 * @return void/string          The rendered atom
 */
function wpc_atom( $type = '', Array $properties = [], $render = true ) {

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
function wpc_molecule( $type = '', Array $properties = [], $render = true  ) {

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
 * @param Array $attributes The array with attributes
 * 
 * @return Array            The generated attributes
 */
function wpc_attributes( $attributes = [] ) {
    return MakeitWorkPress\WP_Components\Build::attributes( $attributes );
}

/**
 * Parses arguments in a multidimensional way
 * 
 * @param Array $defaults   The array with default attributes
 * @param Array $parameters The array with added parameters
 * 
 * @return Array            The parsed parameters
 */
function wpc_multi_parse( $defaults = [], $parameters = [] ) {
    return MakeitWorkPress\WP_Components\Build::multiParseArgs( $defaults, $parameters );
}