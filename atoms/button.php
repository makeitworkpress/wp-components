<?php
/**
 * Represents a button
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'iconAfter'  => '',
    'iconBefore' => '',
    'title'      => '',
    'style'      => 'default',
    'target'     => '_self',
    'url'        => '#', 
) ); ?>

<a class="atom-button <?php echo $atom['style']; ?>" href="<?php echo $atom['url']; ?>" target="<?php echo $atom['target']; ?>">
    
    <?php if( $atom['iconBefore'] ) { ?> 
        <i class="fa fa-<?php echo $atom['iconBefore']; ?>"></i>
    <?php } ?>
    
    <span class="atom-button-title">
        <?php echo $atom['title']; ?>
    </span>
    
    <?php if( $atom['iconAfter'] ) { ?> 
        <i class="fa fa-<?php echo $atom['iconAfter']; ?>"></i>
    <?php } ?>
    
</a>