<?php
/**
 * Represents a modal pop-up
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'content'   => '',
    'id'        => uniqid()
) ); ?>

<div class="atom-modal <?php echo $atom['style']; ?>" data-id="<?php echo $atom['id']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    <div class="atom-modal-container">
        <?php if( atom['content'] ) { ?>
            <div class="atom-modal-content">
                <?php echo $atom['content']; ?>
            </div>
        <?php } ?>
    </div>
    <a href="#" class="atom-modal-close"><i class="fa fa-times fa-2x"></i></a>        	
</div>