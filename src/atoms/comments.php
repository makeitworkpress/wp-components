<?php
/**
 * Displays an adapted comments template
 */

// Retrieve our form so that it can be altered through our arguments
ob_start();
comment_form();
$form = ob_get_clean();

// Atom values
$atom = wp_parse_args( $atom, array(
    'closed'        => ! comments_open(), 
    'closedText'    => __('Comments are closed.', 'components'), // May contain a string for the closed text
    'form'          => $form,
    'haveComments'  => get_comments_number(),
    'next'          => '&rsaquo;',
    'paged'         => get_comment_pages_count() > 1 && get_option( 'page_comments' ) ? true : false,
    'prev'          => '&lsaquo;',
    'seperate'      => false,
    'template'      => '',
    'title'         => sprintf( 
        _n( 'One Response to %2$s', '%1$s Responses to %2$s', get_comments_number(), 'components' ),
        number_format_i18n( get_comments_number() ),
        get_the_title()
    )
) ); 

/**
 * Setup our pagination if we don't have it set-up
 */
if( ! isset($atom['pagination']) ) {
    $atom['pagination']  = get_previous_comments_link( $atom['prev'] );
    $atom['pagination'] .= get_next_comments_link( $atom['next'] );
} 

// Return if a password is required
if ( post_password_required() ) {
	return;
}

if( strpos(STYLESHEETPATH, dirname(__FILE__) . '/compatible/comments.php') !== false ) {
    $file = str_replace( STYLESHEETPATH, '', dirname(__FILE__) ) . '/compatible/comments.php';
} else {
    $file = str_replace( TEMPLATEPATH, '', dirname(__FILE__) ) . '/compatible/comments.php';
}

$GLOBALS['atom'] = $atom;

/**
 * The following code is needed because of the way WordPress currently loads comments using the comments_template function.
 */
comments_template( str_replace( STYLESHEETPATH, '', dirname(__FILE__) ) . '/compatible/comments.php', $atom['seperate'] ); ?>