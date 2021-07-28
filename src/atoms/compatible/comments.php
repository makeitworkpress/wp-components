<?php
/**
 * This is the actual output for the comments atom, as loaded through comments_template in atoms/comments.php.
 */
global $atom;

// Retrieve the comments navigation - only works at template level (here)
$pagination = get_the_comments_navigation();

if( ! wp_script_is('comment-reply') && apply_filters('components_comment_script', true) ) {
    wp_enqueue_script('comment-reply'); 
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>
<div <?php echo $attributes; ?>>
    
    <?php if( $atom['closed'] ) { ?> 
        <p class="atom-comments-closed"><?php echo $atom['closed_text']; ?></p>
    <?php } ?>

    <?php if( $atom['has_comments'] ) { ?> 
    
        <?php if( $atom['title'] ) { ?> 

            <h3 class="atom-comments-title"><?php echo $atom['title']; ?></h3>

        <?php } ?>

        <?php if( $atom['pagination'] ) { ?> 
            <?php echo $pagination; ?>    
        <?php } ?>        

        <ol>
            <?php wp_list_comments(); ?>
        </ol>

        <?php if( $atom['pagination'] ) { ?> 
            <?php echo $pagination; ?>    
        <?php } ?>
    
    <?php } ?>
    
    <?php if( $atom['form'] ) { 
        if( is_string($atom['form']) ) { 
             echo $atom['form']; 
        } else {
            comment_form();
        }
    } ?>

</div>

<?php
    /**
     * Unset our global comments atom
     */
    unset($GLOBALS['atom']);
?>