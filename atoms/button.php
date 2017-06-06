<?php
/**
 * Represents a button
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'iconAfter'     => '',
    'iconBefore'    => '',
    'link'          => '#', 
    'title'         => '',
    'size'          => '',
    'target'        => '_self'
) ); 

// Default background
if( ! isset($atom['background']) )
    $atom['style'] .= ' components-light-background';

// Rounded

// Size
if( $atom['size'] )
    $atom['style'] .= ' atom-button-' . $atom['size'];

// Custom link to a post
if( $atom['link'] == 'post' )
    $atom['link'] = esc_url( get_permalink() ); ?>

<a class="atom-button <?php echo $atom['style']; ?>" href="<?php echo $atom['link']; ?>" target="<?php echo $atom['target']; ?>" <?php echo $atom['inlineStyle']; ?>>
    
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