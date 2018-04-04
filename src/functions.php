<?php
/**
 * Short function for rendering an atom
 * 
 * @param string    $type       The molecule to render
 * @param array     $properties The properties for this molecule
 * @param boolean   $render     Whether to render or return this atom
 */
function wpc_atom( $type = '', Array $properties = [], $render = true ) {

    if( ! class_exists('MakeitWorkPress\WP_Components\Build') || ! $type ) {
        return;
    }

    MakeitWorkPress\WP_Components\Build::atom( $type, $properties, $render );

}

/** 
 * Short function for rendering a molecule
 * 
 * @param string    $type       The molecule to render
 * @param array     $properties The properties for this molecule
 * @param boolean   $render     Whether to render or return this molecule
 */
function wpc_molecule( $type = '', Array $properties = [], $render = true  ) {

    if( ! class_exists('MakeitWorkPress\WP_Components\Build') || ! $type ) {
        return;
    }

    MakeitWorkPress\WP_Components\Build::molecule( $type, $properties, $render );

}