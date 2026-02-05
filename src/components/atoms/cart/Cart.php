<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a WooCommerce shopping cart
 */
class Cart extends Component
{
    public static $block = [
        "name" => "wpc/cart",
        "title" => "Cart",
        "description" => "Displays a WooCommerce shopping cart.",
        "category" => "wpc-atoms",
        "icon" => "cart",
        "keywords" => ["cart", "woocommerce", "shop"],
    ];

    public static $atts = [
        "cart" => ["type" => "boolean", "default" => true],
        "collapse" => ["type" => "boolean", "default" => true],
        "icon" => ["type" => "boolean", "default" => true],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if ($atom["collapse"]) {
            $atom["attributes"]["class"] .= " atom-cart-collapsed";
        }

        return $atom;
    }
}
