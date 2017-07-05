<?php
/**
 * Returns a WordPress menu
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'args'       => array(),
    'cart'       => false,
    'checkout'   => __('Checkout', 'components'),
    'collapse'   => false,      // If you want to collapse the mobile menu by default
    'hamburger'  => 'mobile',   // Accepts mobile (768px), tablet (1024px) or always (always hamburger)
    'indicator'  => true,
    'menu'       => '',
    'search'     => false,
    'social'     => array(),
    'view'       => '',         // Accepts dark to display a dark mobile menu, fixed, left or right to display the hamburger with a special menu
    'viewCart'   => __('View Cart', 'components')         
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
if( $atom['cart'] && class_exists('WooCommerce') ) {
    
    $cartUrl        = WC()->cart->get_cart_url();
    $checkoutUrl    = WC()->cart->get_checkout_url();
    $count          = WC()->cart->get_cart_contents_count();
    
    ob_start();
        woocommerce_mini_cart();
    $miniCart = ob_get_clean();    
    
    $cart    = '<li class="atom-menu-item-cart">';
    $cart   .= '    <a href="' . $cartUrl . '">';
    $cart   .= '        <i class="fa fa-shopping-cart"></i>';
    $cart   .= '        <span class="atom-menu-item-cart-count">' . $count . '</span>';
    $cart   .= '    </a>';
    $cart   .= '    <div class="sub-menu"><div class="widget_shopping_cart_content">' . $miniCart . '</div></div>';
    $cart   .= '</li>';
} else {
    $cart = '';
}

$social = $atom['social'] ? '<li class="atom-menu-item-social">' . WP_Components\Build::atom( 'social', array('urls' => $atom['social'], 'rounded' => true), false ) . '</li>' : '';
$search = $atom['search'] ? '<li class="atom-menu-item-search">' . WP_Components\Build::atom( 'search', array('ajax' => true, 'collapse' => true), false ) . '</li>' : '';

// Our echo is always false and or container empty (if set to a string and defined as menu in the menu editor)
$atom['args']['container'] = 'nothing';
$atom['args']['echo'] = false;

if( $social || $search || $cart )
    $atom['args']['items_wrap'] = '<ul id="%1$s" class="%2$s">%3$s' . $social . $cart . $search . '</ul>';   

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