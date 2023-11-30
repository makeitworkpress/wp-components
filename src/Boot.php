<?php
/**
 * Initialize our components engine
 */
namespace MakeitWorkPress\WP_Components;

defined( 'ABSPATH' ) or die( 'Go eat veggies!' );

class Boot {

    /**
     * Holds our ajax object
     * 
     * @access public
     */
    public $ajax = null;
    
    /**
     * Holds our configurations
     * @access private
     */
    private $configurations = [];
    
    /**
     * Initialize our components
     *
     * @param array $configurations The basic configurations for the components
     */
    public function __construct( $configurations = [] ) {
        
        // Setup our configurations. By default, we load css and js from the components library.
        $this->configurations = wp_parse_args( $configurations, [
            'animate'       => false,           // Whether to load animate.css or not
            'css'           => true,            // Load standard css
            'fontawesome'   => true,            // Loads the fontawesome css
            'hover'         => false,           // Whether to load hover.css or not
            'js'            => true,            // Load standard js
            'language'      => 'wp-components', // The default language domain
            'maps'          => '',              // The API key for Google Maps. 
            'scrollreveal'  => true,            // Loads the scrollreveal JS
            'tinyslider'    => true             // Loads the slider js and css
        ] );
        
        // Define Constants
        // $folder = wp_normalize_path( substr( dirname(__DIR__, 1), strpos(__FILE__, 'wp-content') + strlen('wp-content') ) ); 
        $root_dir = dirname(__DIR__, 1);
        $is_in_plugin = str_contains($root_dir, WP_PLUGIN_DIR) ? true : false; 
        $root_path = $is_in_plugin ? substr($root_dir, strpos($root_dir, '/plugins')) : substr($root_dir, strpos($root_dir, '/themes'));

        defined( 'WP_COMPONENTS_ASSETS' ) or define( 'WP_COMPONENTS_ASSETS', content_url() . $root_path . '/public/' );
        defined( 'WP_COMPONENTS_PATH' ) or define( 'WP_COMPONENTS_PATH', $root_dir . '/src/' );
        defined( 'WP_COMPONENTS_LANGUAGE' ) or define( 'WP_COMPONENTS_LANGUAGE', $this->configurations['language'] );
        
        // Register our ajax actions
        $this->ajax = new Ajax();

        // Load our functions
        require_once( WP_COMPONENTS_PATH . 'includes/functions.php' );
        
        // Register Hooks
        $this->hook();
        
    } 
    
     
    /**
     * Contains our standaard hooks
     */
    private function hook(): void {
        
        add_action( 'wp_enqueue_scripts', function(): void {
            
            // Enqueue tinyslider CSS and JS
            if( $this->configurations['tinyslider'] ) {
                wp_enqueue_style( 'tinyslider-css', WP_COMPONENTS_ASSETS . 'vendor/css/tinyslider.min.css');
                wp_enqueue_script( 'tinyslider-js', WP_COMPONENTS_ASSETS . 'vendor/js/tinyslider.min.js', [], NULL, true);
            }
            
            // Enqueue scrollreveal JS
            if( $this->configurations['scrollreveal'] ) {
                wp_enqueue_script( 'scrollreveal-js', WP_COMPONENTS_ASSETS . 'vendor/js/scrollreveal.min.js', [], NULL, true);
            }           
            
            // Enqueue our default components CSS
            if( $this->configurations['css'] ) {
                wp_enqueue_style( 'wpc-css', WP_COMPONENTS_ASSETS . 'css/wpc-styles.min.css');
            }

            if( $this->configurations['fontawesome'] ) {
                wp_enqueue_style( 'wpc-font-awesome', WP_COMPONENTS_ASSETS . 'vendor/css/font-awesome.min.css');
            }
            
            // Enqueue our animate CSS
            if( $this->configurations['animate'] ) {
                wp_enqueue_style( 'wpc-animate-css', WP_COMPONENTS_ASSETS . 'vendor/css/animate.min.css');
            } 
            
            // Enqueue our hover CSS
            if( $this->configurations['hover'] ) {
                wp_enqueue_style( 'wpc-hover-css', WP_COMPONENTS_ASSETS . 'vendor/css/hover.min.css');
            }  
            
            // Registers the maps script
            if( $this->configurations['maps'] ) {
                wp_register_script( 'google-maps-js', 'https://maps.googleapis.com/maps/api/js?key=' . $this->configurations['maps'], [], '3', true);
            }               
            
            // Enqueue our default components JS
            if( $this->configurations['js'] ) {
                
                wp_enqueue_script( 'wpc-js', WP_COMPONENTS_ASSETS . 'js/wpc-scripts.js', [], NULL, true );

                // Localize our script
                wp_localize_script( 'wpc-js', 'wpc', [
                    'ajaxUrl' => admin_url( 'admin-ajax.php' ),
                    'restUrl' => esc_url_raw( rest_url() ),
                    'debug'   => defined('WP_DEBUG') && WP_DEBUG ? true : false,
                    'nonce'   => wp_create_nonce( 'cucumber' ),
                ]);

            }
            
        } );     
        
        // Specific WooCommerce Based Actions
        if( class_exists('WooCommerce') ) { 
            // Counter that updates the mini cart with ajax
            add_filter('woocommerce_add_to_cart_fragments', function($fragments) {
                $fragments['span.atom-cart-count'] = '<span class="atom-cart-count">' . WC()->cart->get_cart_contents_count() . '</span>'; 
                
                return $fragments;
            });  
        }        
        
    }   

}