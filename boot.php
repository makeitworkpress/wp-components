<?php
/**
 * Initialize our components engine
 */
namespace WP_Components;

defined( 'ABSPATH' ) or die( 'Go eat veggies!' );

class Boot {
    
    /**
     * Holds our configurations
     * @access private
     */
    private $configurations;
    
    /**
     * Initialize our components
     *
     * @param array $configurations The basic configurations for the components
     */
    public function __construct( $configurations = array() ) {
        
        // Setup our configurations. By default, we load css and js from the components library.
        $this->configurations = wp_parse_args( $configurations, array('css' => true, 'js' => true) );
        
        // Find our path
        $folder = wp_normalize_path( substr( dirname(__FILE__), strpos(__FILE__, 'wp-content') + strlen('wp-content') ) );      
        
        // Define Constants
        defined( 'COMPONENTS_ASSETS' ) or define( 'COMPONENTS_ASSETS', content_url() . $folder . '/assets/' );
        defined( 'COMPONENTS_PATH' ) or define( 'COMPONENTS_PATH', plugin_dir_path( __FILE__ ) );
        
        // Register our ajax actions
        $ajax = new Ajax();
        
        // Hook actions
        $this->hook();
        
    } 
    
     
    /**
     * Contains our standaard hooks
     */
    private function hook() {
        
        add_action('wp_enqueue_scripts', function() {
            
            // If we are debugging, load the full scripts
            $suffix = defined('WP_DEBUG') && WP_DEBUG ? '' : '.min';
            
            // Enqueue our components CSS
            if( $this->configurations['css'] ) {
                wp_enqueue_style( 'components', COMPONENTS_ASSETS . 'css/components.min.css');
                wp_enqueue_style( 'font-awesome', COMPONENTS_ASSETS . 'css/vendor/font-awesome.min.css');
            }            
            
            // Enqueue our components JS
            if( $this->configurations['js'] ) {
                wp_register_script( 'components-slider', COMPONENTS_ASSETS . 'js/vendor/flexslider.min.js', array('jquery'), NULL, true);
                wp_register_script( 'scrollreveal', COMPONENTS_ASSETS . 'js/vendor/scrollreveal.min.js', array(), NULL, true);
                wp_register_script( 'lazyload', COMPONENTS_ASSETS . 'js/vendor/lazyload.min.js', array(), NULL, true);
                wp_enqueue_script( 'components', COMPONENTS_ASSETS . 'js/components' . $suffix . '.js', array('jquery'), NULL, true);
                
                // Localize our script
                wp_localize_script( 'components', 'components', array(
                    'ajaxUrl' => admin_url( 'admin-ajax.php' ),
                    'restUrl' => esc_url_raw( rest_url() ),
                    'debug'   => defined('WP_DEBUG') && WP_DEBUG ? true : false,
                    'nonce'   => wp_create_nonce( 'cucumber' ),
                ) );
            }
            
        });
        
        
        // Specific WooCommerce Based Actions
        if( class_exists('WooCommerce') ) {
            
            // Counter that updates the mini cart with ajax
            add_filter('woocommerce_add_to_cart_fragments', function($fragments) {
                $fragments['span.atom-menu-item-cart-count'] = '<span class="atom-menu-item-cart-count">' . WC()->cart->get_cart_contents_count() . '</span>'; 
                
                return $fragments;
            });
            
        }        
        
    }   

}