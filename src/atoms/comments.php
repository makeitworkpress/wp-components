<?php
/**
 * Displays an adapted comments template
 */

// Backword compatibility
$atom = MakeitWorkPress\WP_Components\Build::convert_camels($atom, ['closedText' => 'closed_text', 'hasComments' => 'has_comments']);

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, array(
    'attributes'    => [
        'id' => 'comments'
    ],
    'closed'        => ! comments_open(), 
    'closed_text'   => __('Comments are closed.', WP_COMPONENTS_LANGUAGE), // May contain a string for the closed text
    'form'          => true,
    'has_comments'  => get_comments_number(),
    'pagination'    => true,
    'seperate'      => false,                   // If comments should be seperated by type
    'template'      => '',                      // Loads a custom template
    'title'         => sprintf( 
        _n( 'One Response to %2$s', '%1$s Responses to %2$s', get_comments_number(), WP_COMPONENTS_LANGUAGE ),
        number_format_i18n( get_comments_number() ),
        get_the_title()
    )
) );

// Return if a password is required
if ( post_password_required() ) {
	return;
}

// Use forward slash for file directories (windows uses backwards)
$file_path  = str_replace('\\', '/', dirname(__FILE__) );
$theme_path = is_child_theme() ? str_replace('\\', '/', STYLESHEETPATH ) : str_replace('\\', '/', TEMPLATEPATH );

// When the component is overwritten, we use a different file
if( $atom['template'] ) {
    $file = $atom['template'];
} else {
    $file = str_replace( $theme_path, '', $file_path ) . '/compatible/comments.php';
}

// Store our atom in a global variable so that we can access it later in the template file
$GLOBALS['atom']    = $atom;

/**
 * The following code is needed because of the way WordPress currently loads comments using the comments_template function.
 */
comments_template( $file, $atom['seperate'] ); ?>