<?php
/**
 * Load our components using a static wrapper
 */
namespace Components;

class Components {
    
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
        
        // Setup our configurations
        $this->configurations = wp_parse_args( $configurations, array('css' => true, 'js' => true) );
        
        // Find our path
        $folder = wp_normalize_path( substr( dirname(__FILE__), strpos(__FILE__, 'wp-content') + strlen('wp-content') ) );      
        
        // Define Constants
        defined( 'COMPONENTS_ASSETS' ) or define( 'COMPONENTS_ASSETS', content_url() . $folder . '/assets/' );
        defined( 'COMPONENTS_PATH' ) or define( 'COMPONENTS_PATH', plugin_dir_path( __FILE__ ) );
        
        // Hook actions
        $this->hook();
    }
    
    /**
     * Contains our standaard hooks
     */
    private function hook() {
        
        add_action('wp_enqueue_scripts', function() {
            
            // Enqueue our components CSS
            if( $this->configurations['css'] ) {
                wp_enqueue_style( 'components', COMPONENTS_ASSETS . '/css/components.min.css');
                wp_enqueue_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
            }            
            
            // Enqueue our components JS
            if( $this->configurations['js'] )
                wp_enqueue_script( 'components', COMPONENTS_ASSETS . '/css/components.min.js', array('jquery'), NULL, true);
            
        });
        
    }
    
    /**
     * Retrieves the generic template.
     *
     * @param string    $type       The type, either a molecule or atom
     * @param string    $template   The template to load, either a template in the molecule or atom's folder
     * @param array     $properties The custom properties for the template     
     */
    private static function template( $type = 'atom', $template, $properties ) {
        
        $path = apply_filters('components_' . $type . '_path', COMPONENTS_PATH . '/' . $type . 's/' . $template . '.php', $template);
        
        if( file_exists($path) ) {
            ${$type} = apply_filters('components_' . $type . '_properties', $properties, $template);
            require_once($path);  
        } else {
            __('The given template for the molecule or atom does not exist', 'components');
        }
        
    }
    
    /**
     * Displays any atom
     *
     * @param string $atom  The atom to load
     * @param array $variables  The custom variables for a molecule
     */
    public static function atom( $atom, $variables = array() ) {
        self::template( 'atom', $atom, $variables );
    }
    
    /**
     * Displays any molecule
     *
     * @param string    $molecule   The atom to load
     * @param array     $variables  The custom variables for a molecule
     */
    public static function molecule( $molecule, $variables = array() ) {
        self::template( 'molecule', $molecule, $variables );
    }    
    
}