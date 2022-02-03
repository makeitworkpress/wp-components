<?php
/**
 * Displays a WooCommerce shopping cart which can be expended (or not)
 */
$atom = wp_parse_args( $atom, [
    'cart'          => true,        // Whether to show the cart content or not
    'collapse'      => true,        // Determines the behaviour of the cart. If we collapse, the cart is hidden by default.     
    'icon'          => true         // Shows a cart icon. Needed if we have collapsed our cart.
] ); 

if( $atom['collapse'] ) {
    $atom['attributes']['class'] .= ' atom-cart-collapsed';
}

// Woocommerce should be active
if( ! class_exists('WooCommerce') ) {
    return;
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>
    
<div <?php echo $attributes; ?>>
    <?php 
        if( $atom['icon'] ) { 
              
            //  Retrieve our count
            $count          = WC()->cart->get_cart_contents_count();

    ?>
        <a class="atom-cart-icon" href="<?php echo wc_get_cart_url(); ?>">
            <i class="fas fa-shopping-cart"></i>     
            <?php if( $count > 0 ) { ?>
                <span class="atom-cart-count"><?php echo $count; ?></span>
            <?php } ?>
        </a>
    <?php 
    
        } 

        if( $atom['cart'] ) { 

            ob_start();
            woocommerce_mini_cart();
            $miniCart = ob_get_clean(); 
    ?>
        <div class="atom-cart-content">
            <div class="widget_shopping_cart_content"><?php echo $miniCart; ?></div>
        </div>
    <?php 
        } 
    ?>
</div>