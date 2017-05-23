<?php
/**
 * Returns a WordPress menu
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'hamburger'  => true,
    'location'   => '',
    'iconBefore' => '',
    'style'      => 'default',
    'target'     => '_self',
    'url'        => '#', 
) );

if( $atom['hamburger'] )
    $atom['style'] .= ' atom-menu-mobile';

// A menu can be set manually if preferred
if( ! isset($atom['hamburger']) )
    $atom['menu'] = wp_nav_menu( array('container' => '', 'echo' => false, 'theme_location' => $atom['location']) );

?>

<nav class="atom-menu <?php echo $atom['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement">
    
    <?php echo $atom['menu']; ?>
    
    <?php if( $atom['hamburger'] ) { ?> 
        <a class="atom-menu-hamburger" href="#"></a>
    <?php } ?>
    
</nav>