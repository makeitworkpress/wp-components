<?php
/**
 * Displays an adapted comments template
 */

// Retrieve our form so that it can be altered through our arguments

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, array(
    'attributes'    => [
        'id' => 'comments'
    ],
    'closed'        => ! comments_open(), 
    'closedText'    => __('Comments are closed.', WP_COMPONENTS_LANGUAGE), // May contain a string for the closed text
    'form'          => true,
    'hasComments'   => get_comments_number(),
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

// When the component is overwritten, we use a different file
if( $atom['template'] ) {
    $file = $atom['template'];
} elseif( strpos(dirname(__FILE__) . '/compatible/comments.php', STYLESHEETPATH) !== false ) {
    $file = str_replace( STYLESHEETPATH, '', dirname(__FILE__) ) . '/compatible/comments.php';
} else {
    $file = str_replace( TEMPLATEPATH, '', dirname(__FILE__) ) . '/compatible/comments.php';
}

// Store our atom in a global variable so that we can access it later
$GLOBALS['atom']    = $atom;

/**
 * The following code is needed because of the way WordPress currently loads comments using the comments_template function.
 */
comments_template( $file, $atom['seperate'] ); ?>