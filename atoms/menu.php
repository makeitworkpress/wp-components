<?php
/**
 * Returns a WordPress menu
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'all'        => __('View all search results', 'components'),
    'args'       => array(),
    'collapse'   => false,      // If you want to collapse to the mobile menu by default, and expandable with clicking
    'dropdown'   => true,       // If you want to remove dropdowns
    'hamburger'  => 'mobile',   // Accepts mobile (768px), tablet (1024px) always (always hamburger) or false (never hamburger)
    'indicator'  => true,
    'menu'       => '',
    'none'       => __('Bummer! No results found', 'components'),
    'view'       => '',         // Accepts dark to display a dark mobile menu, fixed, left or right to display the hamburger with a special menu      
) );

if( $atom['collapse'] )
    $atom['style'] .= ' atom-menu-collapse';

if( ! $atom['dropdown'] )
    $atom['style'] .= ' atom-menu-plain';

if( $atom['hamburger'] )
    $atom['style'] .= ' atom-menu-' . $atom['hamburger'] . '-hamburger';

if( $atom['indicator'] )
    $atom['style'] .= ' atom-menu-indicator';

if( $atom['view'] )
    $atom['style'] .= ' atom-menu-' . $atom['view']; 

// A menu can be set manually if preferred
if( ! $atom['menu'] ) {
    $atom['menu'] = wp_nav_menu( $atom['args'] );
} ?>

<nav class="atom-menu <?php echo $atom['style']; ?>" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    
    <?php echo $atom['menu']; ?>
    
    <?php if( $atom['hamburger'] ) { ?> 
        <a class="atom-menu-hamburger" href="#"><span></span><span></span><span></span></a>
    <?php } ?>
    
</nav>