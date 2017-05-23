<?php
/**
 * Represents a modal pop-up
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'content'   => ''
    'style'     => 'default none'
) ); ?>

<div class="atom-modal <?php echo $atom['style']; ?>">
    <div class="atom-modal-content">
        <?php echo $atom['content']; ?>
    </div>
    <a href="#" class="atom-modal-close"><i class="fa fa-times"></i></a>        	
</div>