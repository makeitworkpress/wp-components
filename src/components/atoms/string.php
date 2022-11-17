<?php 
/**
 * Echo's a simple string value or callback from the $atom variable
 */
$atom = wp_parse_args( $atom, [
    'string'    => ''
] ); 

if( $atom['string'] ) {
    echo $atom['string'];    
}