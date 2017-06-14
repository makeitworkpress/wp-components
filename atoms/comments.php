<?php
/**
 * Displays an adapted comments template
 */

// Retrieve our list
ob_start();
wp_list_comments();
$list = ob_get_clean();

// Retrieve our form
ob_start();
comment_form();
$form = ob_get_clean();

// Atom values
$atom = wp_parse_args( $atom, array(
    'closed'        => ! comments_open(), 
    'closedText'    => __('Comments are closed.', 'components'), // May contain a string for the closed text
    'form'          => $form,
    'haveComments'  => have_comments(),
    'list'          => $list,
    'next'          => '&rsaquo;',
    'paged'         => get_comment_pages_count() > 1 && get_option( 'page_comments' ) ? true : false,
    'prev'          => '&lsaquo;',
    'title'         => sprintf( 
        _n( 'One Response to %2$s', '%1$s Responses to %2$s', get_comments_number(), 'components' ),
        number_format_i18n( get_comments_number() ),
        get_the_title()
    )
) ); 

if( ! isset($atom['pagination']) ) {
    $atom['pagination']  = get_previous_comments_link( $atom['prev'] );
    $atom['pagination'] .= get_next_comments_link( $atom['next'] );
} 

// Return if a password is required
if ( post_password_required() ) {
	return;
} ?>

<div class="atom-comments <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?>>
    
    <?php echo $atom['form']; ?>
    
    <?php if( $atom['closed'] ) { ?> 
        <p class="atom-comments-closed"><?php echo $atom['closedText']; ?></p>
    <?php } else { ?> 
    
        <?php if( $atom['haveComments'] ) { ?> 
    
            <?php if( $atom['title'] ) { ?> 

                <h3 class="atom-comments-title"><?php echo $atom['title']; ?></h3>

            <?php } ?>
    
            <ol>
                <?php echo $atom['comments']; ?>
            </ol>
    
            <?php if( $atom['paged'] ) { ?> 
                <nav class="atom-comments-navigation">
                    <?php echo $atom['pagination']; ?>    
                </nav>
            <?php } ?>
    
        <?php } ?>
    
    <?php } ?>

</div>