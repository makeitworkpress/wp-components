<?php
/**
 * Represents a modal pop-up
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, [
    'attributes' => [
        'data' => ['id' => uniqid()]
    ],
    'content'   => ''
] ); 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    <div class="atom-modal-container">
        <?php if( $atom['content'] ) { ?>
            <div class="atom-modal-content">
                <?php echo $atom['content']; ?>
            </div>
        <?php } ?>
    </div>
    <a href="#" class="atom-modal-close"><i class="fas fa-times fa-2x"></i></a>        	
</div>