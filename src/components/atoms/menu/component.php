<?php
/**
 * Returns a WordPress menu
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, [
    'attributes' => [
        'itemtype'  => 'http://schema.org/SiteNavigationElement',
        'itemscope' => 'itemscope'   
    ],
    'args'       => [],         // The wp_nav_menu arguments
    'collapse'   => false,      // If you want to collapse to the mobile menu by default, and expandable with clicking
    'dropdown'   => true,       // If you want to remove dropdowns, set this to false
    'hamburger'  => 'mobile',   // Accepts mobile (767px), tablet (1080px) always (always hamburger) or false (never hamburger)
    'indicator'  => true,       // Shows a submenu indicator if an menu item has a submenu
    'menu'       => '',         // Pass a wordpress menu - overrides any args
    'view'       => 'default',  // Accepts dark to display a dark mobile menu, fixed, left or right to display the hamburger with a special menu      
] );

// By default, we don't echo the menu
$atom['args']['echo'] = false;

if( $atom['collapse'] ) {
    $atom['attributes']['class'] .= ' atom-menu-collapse';
}

if( ! $atom['dropdown'] ) {
    $atom['attributes']['class'] .= ' atom-menu-plain';
}

if( $atom['hamburger'] && ! in_array($atom['view'], ['fixed', 'left', 'right']) ) {
    $atom['attributes']['class'] .= ' atom-menu-' . $atom['hamburger'] . '-hamburger';
}

if( $atom['indicator'] ) {
    $atom['attributes']['class'] .= ' atom-menu-indicator';
}

if( $atom['view'] ) {
    $atom['attributes']['class'] .= ' atom-menu-' . $atom['view']; 
}

// A menu can be set manually if preferred
if( ! $atom['menu'] ) {
    $atom['menu'] = wp_nav_menu( $atom['args'] );
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<nav <?php echo $attributes; ?>>
    
    <?php echo $atom['menu']; ?>
    
    <?php if( $atom['hamburger'] ) { ?> 
        <a class="atom-menu-hamburger" href="#"><span></span><span></span><span></span></a>
    <?php } ?>
    
</nav>