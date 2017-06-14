<?php
/**
 * Represents a button
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'iconAfter'     => '',          // Icon before the button
    'iconBefore'    => '',          // Icon after the button
    'iconVisible'   => 'standard',  // When the icon becomes visible. Accepts standard or hover
    'link'          => '#',         // The link of the button
    'label'         => '',          // The button label
    'size'          => '',          // Defines the size of the button. If set to none, displays a button without background, border and padding.
    'target'        => '_self'
) ); 

$atom['style'] .= ' atom-button-' . $atom['iconVisible'];

// Default background
if( ! isset($atom['background']) )
    $atom['style'] .= ' components-light-background';

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
    
    <span class="atom-button-label">
        <?php echo $atom['label']; ?>
    </span>
    
    <?php if( $atom['iconAfter'] ) { ?> 
        <i class="fa fa-<?php echo $atom['iconAfter']; ?>"></i>
    <?php } ?>
    
</a>