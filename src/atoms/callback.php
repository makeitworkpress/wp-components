
 <?php 
/**
 * Echo's a simple callback from the $atom variable
 */
$atom = wp_parse_args( $atom, array(
    'callback'    => '' // Either a string or an array
) ); 

if( ! $atom['callback'] ) {
    return;
}

call_user_func( $atom['callback'] );