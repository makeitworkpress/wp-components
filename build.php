<?php
/**
 * Load our components using a static wrapper
 */
namespace WP_Components;

class Build {
    
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
                wp_enqueue_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
            }            
            
            // Enqueue our components JS
            if( $this->configurations['js'] ) {
                wp_register_script( 'components-slider', COMPONENTS_ASSETS . 'js/vendor/flexslider.min.js', array('jquery'), NULL, true);
                wp_enqueue_script( 'scrollreveal', COMPONENTS_ASSETS . 'js/vendor/scrollreveal.min.js', array(), NULL, true);
                wp_enqueue_script( 'components', COMPONENTS_ASSETS . 'js/components' . $suffix . '.js', array('jquery', 'scrollreveal'), NULL, true);
                
                // Localize our script
                wp_localize_script( 'components', 'components', array(
                    'ajaxUrl' => admin_url( 'admin-ajax.php' ),
                    'debug'   => defined('WP_DEBUG') && WP_DEBUG ? true : false,
                    'nonce'   => wp_create_nonce( 'cucumber' ),
                ) );
            }
            
        });
        
    }
    
    /**
     * Retrieves the generic template for an atom or molecule.
     *
     * @param string    $type       The type, either a molecule or atom
     * @param string    $template   The template to load, either a template in the molecule or atom's folder
     * @param array     $properties The custom properties for the template    
     *
     * @todo DRY properties that are common under multiple components and possible define them here alltogether. 
     */
    private static function template( $type = 'atom', $template, $properties ) {
        
        $path = apply_filters( 'components_' . $type . '_path', COMPONENTS_PATH . $type . 's/' . $template . '.php', $template );
        
        if( file_exists($path) ) {
            ${$type} = apply_filters( 'components_' . $type . '_properties', self::defaultProperties($template, $properties), $template );
            require($path);  
        } else {
            _e('The given template for the molecule or atom does not exist', 'components');
        }
        
    }
    
    /**
     * Define the default properties per template, which are occuring in multiple templates. 
     * 
     * @param   string  $template   The template to load
     * @param   array   $properties The custom properties defined by the developer
     *
     * @return  array   $properties The custom properties merged with the defaults
     */ 
    private static function defaultProperties( $template, $properties ) {

        // Generic style and inlineStyle properties
        $properties['inlineStyle'] = isset($properties['inlineStyle']) ? $properties['inlineStyle'] : '';
        $properties['style'] = isset($properties['style']) ? $properties['style'] : 'default';
        
        // Animation
        if( isset($properties['animation']) ) {
            $properties['style'] .= ' components-' . $properties['animation'] . '-animation'; 
        }
        
        // Scrollreveal. Accepts top, bottom, left, right
        if( isset($properties['appear']) ) {
            $properties['style'] .= ' components-' . $properties['appear'] . '-appear'; 
        }         
        
        // Background color
        if( isset($properties['background']) ) {
            if( strpos($properties['background'], '#') === 0 || strpos($properties['background'], 'rgb') === 0 || strpos($properties['background'], 'linear-gradient') === 0 ) {
                $properties['inlineStyle'] .= 'background:' . $properties['background'] . ';';
            } elseif( $properties['background'] ) {
                $properties['style'] .= ' components-' . $properties['background'] . '-background';
            }
        }
        
        // Display
        if( isset($properties['display']) ) {
            $properties['style'] .= ' components-' . $properties['display'] . '-display'; 
        } 
        
        // Floats
        if( isset($properties['float']) ) {
            $properties['style'] .= ' components-' . $properties['float'] . '-float'; 
        } 
        
        // Floats
        if( isset($properties['grid']) ) {
            $properties['style'] .= ' components-' . $properties['grid'] . '-grid components-grid-item'; 
        }          
        
        // Heights
        if( isset($properties['height']) ) {
            $properties['style'] .= ' components-' . $properties['height'] . '-height'; 
        }
        
        // Overflow
        if( isset($properties['overflow']) ) {
            $properties['style'] .= ' components-overflow'; 
        } 
        
        // Rounded
        if( isset($properties['rounded']) ) {
            $properties['style'] .= ' components-rounded'; 
        }         

        // Text color
        if( isset($properties['color']) ) {
            if( strpos($properties['color'], '#') === 0 || strpos($properties['color'], 'rgb') === 0 ) {
                $properties['inlineStyle'] .= 'color:' . $properties['color'] . ';';
            } elseif( $properties['color'] ) {
                $properties['style'] .= ' components-' . $properties['color'] . '-color';
            }
        }

        // If we have inline styles, we make them
        if( $properties['inlineStyle'] )
            $properties['inlineStyle'] = 'style=" ' . $properties['inlineStyle'] . ' "';
        
        return $properties;
        
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