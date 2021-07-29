
 <?php 
/**
 * Echo's a simple callback from the $atom variable
 */
$atom = wp_parse_args( $atom, [
    'callback'    => '' // Either a string or an array for class methods
] ); 

if( ! $atom['callback'] ) {
    return;
}

call_user_func( $atom['callback'] );