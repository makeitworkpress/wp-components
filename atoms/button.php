<?php
/**
 * Represents a button
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'background'    => '',    // Accepts hex value or predefined value
    'color'         => '',   // Accepts hex value or  predefined value
    'iconAfter'     => '',
    'iconBefore'    => '',
    'inlineStyle'   => '',
    'link'          => '#', 
    'title'         => '',
    'rounded'       => true,
    'size'          => '',
    'style'         => 'default',
    'target'        => '_self'
) ); 

// Background color
if( strpos($atom['background'], '#') === 0 || strpos($atom['background'], 'rgb') === 0 || strpos($atom['background'], 'linear-gradient') === 0 ) {
    $atom['inlineStyle'] .= 'background:' . $atom['background'] . ';';
} elseif( $atom['background'] ) {
    $atom['style'] .= ' components-background-' . $atom['background'];
}

// Text color
if( strpos($atom['color'], '#') === 0 || strpos($atom['color'], 'rgb') === 0 ) {
    $atom['inlineStyle'] .= 'color:' . $atom['color'] . ';';
} elseif( $atom['color'] ) {
    $atom['style'] .= ' components-color-' . $atom['color'];
}

// Inline styles
if( $atom['inlineStyle'] )
    $atom['inlineStyle'] = 'style=" ' . $atom['inlineStyle'] . ' "';

// Rounded
if( $atom['rounded'] )
    $atom['style'] .= ' components-rounded';

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