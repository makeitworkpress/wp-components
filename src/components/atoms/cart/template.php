<?php
/**
 * Cart component template
 */
if (!class_exists('WooCommerce')) {
    return;
}
?>

<div <?php echo $attributes; ?>>
    <?php if ($atom["icon"]) {
        $count = WC()->cart->get_cart_contents_count();
    ?>
        <a class="atom-cart-icon" href="<?php echo wc_get_cart_url(); ?>">
            <i class="fas fa-shopping-cart"></i>
            <?php if ($count > 0) { ?>
                <span class="atom-cart-count"><?php echo $count; ?></span>
            <?php } ?>
        </a>
    <?php }

    if ($atom["cart"]) {
        ob_start();
        woocommerce_mini_cart();
        $miniCart = ob_get_clean();
    ?>
        <div class="atom-cart-content">
            <div class="widget_shopping_cart_content"><?php echo $miniCart; ?></div>
        </div>
    <?php } ?>
</div>
