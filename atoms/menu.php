<?php
/**
 * Returns a WordPress menu
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'args'       => array(),
    'hamburger'  => 'mobile', // Accepts mobile (768px), tablet (1024px) or always (always hamburger)
    'indicator'  => true,
    'menu'       => ''
) );

if( $atom['hamburger'] )
    $atom['style'] .= ' atom-menu-' . $atom['hamburger'] . '-hamburger';

if( $atom['indicator'] )
    $atom['style'] .= ' atom-menu-indicator';

// Our echo is always false and or container empty (if set to a string)
$atom['args']['container'] = 'nothing';
$atom['args']['echo'] = false;

// A menu can be set manually if preferred
if( ! $atom['menu'] )
    $atom['menu'] = wp_nav_menu( $atom['args'] );

?>

<nav class="atom-menu <?php echo $atom['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement" <?php echo $atom['inlineStyle']; ?>>
    
    <?php echo $atom['menu']; ?>
    
    <?php if( $atom['hamburger'] ) { ?> 
        <a class="atom-menu-hamburger" href="#"><span></span><span></span><span></span></a>
    <?php } ?>
    
</nav>