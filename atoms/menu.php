<?php
/**
 * Returns a WordPress menu
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'args'       => array(),
    'collapse'   => false,      // If you want to collapse the mobile menu by default
    'hamburger'  => 'mobile',   // Accepts mobile (768px), tablet (1024px) or always (always hamburger)
    'indicator'  => true,
    'menu'       => '',
    'search'     => false,
    'social'     => array(),
    'view'       => '',         // Accepts dark to display a dark mobile menu, fixed, left or right to display the hamburger with a special menu
) );

if( $atom['collapse'] )
    $atom['style'] .= ' atom-menu-collapse';

if( $atom['hamburger'] )
    $atom['style'] .= ' atom-menu-' . $atom['hamburger'] . '-hamburger';

if( $atom['indicator'] )
    $atom['style'] .= ' atom-menu-indicator';

if( $atom['view'] )
    $atom['style'] .= ' atom-menu-' . $atom['view'];

// Extra menu items
$social = $atom['social'] ? '<li class="atom-menu-item-social">' . WP_Components\Build::atom('social', array('urls' => $atom['social'], 'rounded' => true), false) . '</li>' : '';
$search = $atom['search'] ? '<li class="atom-menu-item-search">' . WP_Components\Build::atom('search', array('ajax' => true, 'collapse' => true), false) . '</li>' : '';

// Our echo is always false and or container empty (if set to a string and defined as menu)
$atom['args']['container'] = 'div';
$atom['args']['echo'] = false;

if( $social || $search )
    $atom['args']['items_wrap'] = '<ul id="%1$s" class="%2$s">%3$s' . $social . $search . '</ul>';   

// A menu can be set manually if preferred
if( ! $atom['menu'] )
    $atom['menu'] = wp_nav_menu( $atom['args'] );

?>

<nav class="atom-menu <?php echo $atom['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement" <?php echo $atom['inlineStyle']; ?> role="navigation">
    
    <?php echo $atom['menu']; ?>
    
    <?php if( $atom['hamburger'] ) { ?> 
        <a class="atom-menu-hamburger" href="#"><span></span><span></span><span></span></a>
    <?php } ?>
    
</nav>