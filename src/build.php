<?php
/**
 * Load our components using a static wrapper
 * Adds some functionalities for modifying component properties and parsing arguments
 */
namespace MakeitWorkPress\WP_Components;
use WP_Error as WP_Error;

defined( 'ABSPATH' ) or die( 'Go eat veggies!' );

class Build {
    
    /**
     * Renders generic template for an atom or molecule.
     *
     * @param string    $type       The type, either a molecule or atom
     * @param string    $template   The component to load, either a template in the molecule or atom's folder
     * @param array     $properties The custom properties for the template    
     * @param array     $render     If the element is rendered. If set to false, the contents of the elements are returned  
     * 
     * @return string|void          The rendered string for the given atom or molecule, but only if render is true
     */
    private static function render( string $type, string $template, array $properties = [], bool $render = true ) {

        if( ! in_array($type, ['atom', 'molecule']) ) {
            $error = new WP_Error( 'wrong', __('The type for rendering should be a molecule or atom.', 'wpc') );
            echo $error->get_error_message();    
            return;
        }
        
        // Empty properties can be neglected
        if( empty($properties) ) {
            $properties = [];
        }

        // Properties should be an array
        if( ! is_array($properties) ) {
            $error = new WP_Error( 'wrong', sprintf(__('The properties for the molecule or atom called %s are not properly formatted as an array.', 'wpc'), $template) );
            echo $error->get_error_message();    
            return;
        }

        // If we have atom properties, they should have proper properties
        if( isset($properties['atoms']) && is_array($properties['atoms']) ) {
            foreach( $properties['atoms'] as $atom ) {
                if( ! isset($atom['atom']) ) {
                    $error = new WP_Error( 'wrong', sprintf(__('The custom atoms within %s are not properly formatted and miss the atom key.', 'wpc'), $template) );
                    echo $error->get_error_message();  
                    return;
                }    
            }
        }
            
        // Our template path
        $path = apply_filters( 'components_' . $type . '_path', WP_COMPONENTS_PATH . $type . 's/' . $template . '.php', $template );
        
        if( file_exists($path) ) {
            
            ${$type}    = apply_filters( 'components_' . $type . '_properties', self::set_default_properties($template, $properties, $type), $template );
            
            // If we do not render, we return
            if( $render == false ) {
                ob_start();
            }
            
            require($path); 
            
            if( $render == false ) {
                return ob_get_clean();
            }
            
        } else {
            $error = new WP_Error( 'wrong', sprintf( __('The given template for the molecule or atom called %s does not exist.', 'wpc'), $template ) );
            echo $error->get_error_message();             
        }     
        
    }
    
    /**
     * Define the default attributes per template. This allows us to dynamically add attributes 
     * 
     * @param   string  $template   The molecule or atom template to load
     * @param   array   $properties The custom properties defined by the developer
     * @param   string  $type       Whether we load an atom or an molecule
     *
     * @return  array   $properties The custom properties merged with the defaults
     */ 
    public static function set_default_properties( string $template, array $properties, string $type = 'atom' ): array {

        // Define our most basic property - the class
        $properties['attributes']['class']  = isset($properties['attributes']['class']) ? $type . ' ' . $properties['attributes']['class'] : $type;
        $properties['attributes']['class'] .= ' ' . $type . '-' . $template;

        // These are the common properties that each element can have
        $classes = [
            'align', 
            'animation', 
            'appear', 
            'background', 
            'border',
            'boxshadow', 
            'color', 
            'display', 
            'float', 
            'grid', 
            'height', 
            'hover', 
            'overlay',
            'parallax', 
            'position', 
            'rounded', 
            'video', 
            'width'
        ];

        /**
         * Properties that generate a specific class for a style or are generic
         */
        foreach( $classes as $class ) {
            
            if( isset($properties[$class]) && $properties[$class] ) {

                // Advanced animations using animate.css (should be enabled in the configurations during instance boot as well)
                if( $class == 'animation' && ! in_array($properties[$class], ['fadein', 'fadeindown', 'slideinleft', 'slideinright']) ) {
                    $properties['attributes']['class'] .= ' animate__animated animate__' . $properties[$class]; 
                    continue;
                }                

                // Backgrounds
                if( $class == 'background' && preg_match('/hsl|http|https|rgb|linear-gradient|#/', $properties[$class]) ) {

                    if( preg_match('/http|https/', $properties[$class]) ) {

                        $properties['attributes']['class']                         .= ' components-image-background';                   
                        $properties['attributes']['style']['background-image']      = 'url(' . $properties[$class] . ')';

                    } else {
                        $properties['attributes']['style']['background']            = $properties[$class];
                    }

                    continue;
                }

                // Borders
                if( $class == 'border' && preg_match('/hsl|linear-gradient|rgb|#/', $properties[$class]) ) {
                    if( strpos($properties['border'], 'linear-gradient') === 0 ) {
                        $properties['attributes']['style']['border']                = '2px solid transparent;';
                        $properties['attributes']['style']['border-image']          = $properties[$class];                        
                        $properties['attributes']['style']['border-image-slice']    = 1;                        
                    } else {
                        $properties['attributes']['style']['border']                = '2px solid ' . $properties[$class];
                    }
                    continue;
                }

                // Box Shadow
                if( $class == 'boxshadow' && isset($properties[$class]) ) {
                    
                    // Custom shadows using CSS attr()
                    if( is_array($properties[$class]) ) {
                        $properties['attributes']['class'] .= ' components-custom-boxshadow';
                        foreach( ['x', 'y', 'blur', 'spread', 'color', 'type'] as $value) {
                            if( isset($properties[$class][$value]) ) {
                                $properties['attributes']['data'][$value] = $properties[$class][$value];
                            }
                        }
                    // Predefined shadows    
                    } elseif( is_string($properties[$class]) ) {
                        $properties['attributes']['class'] .= ' components-' . $properties[$class] . '-boxshadow';
                    }
                    continue;
                }                
                
                // Color
                if( $class == 'color' && preg_match('/hsl|rgb|#/', $properties[$class]) ) {
                    $properties['attributes']['style']['color']                     = $properties[$class];
                    continue;
                }  
                
                // Continue if our grid is an array
                if( $class == 'grid' && is_array($properties[$class]) ) {
                    continue;
                }

                // Height and Width
                if( ($class == 'height' || $class == 'width') && preg_match('/ch|em|ex|in|mm|pc|pt|px|rem|vh|vw|%/', $properties[$class]) ) {
                    $properties['attributes']['style']['min-' . $class]             = $properties[$class];
                    continue;
                }

                // Advanced hover settings using hover.css (should be enabled in the configurations during instance boot as well)
                if( $class == 'hover' ) {
                    $properties['attributes']['class'] .= ' hvr-' . $properties[$class]; 
                    continue;
                } 
                
                // Overlay
                if( $class == 'overlay' && isset($properties[$class]) ) {
                    
                    // Custom overlays using CSS attr()
                    if( is_array($properties[$class]) ) {
                        $properties['attributes']['class'] .= ' components-overlay components-custom-overlay';
                        foreach( ['color', 'opacity'] as $value) {
                            if( isset($properties[$class][$value]) ) {
                                $properties['attributes']['data'][$value] = $properties[$class][$value];
                            }
                        }
                    // Predefined overlays  
                    } elseif( is_string($properties[$class]) ) {
                        $properties['attributes']['class'] .= ' components-overlay components-' . $properties[$class] . '-overlay';
                    }
                    continue;
                }                 

                if( $class == 'video' ) {
                    $properties['attributes']['class'] .= ' components-video-background'; 
                    continue;
                }                

                // Set our definite class for other properties
                $properties['attributes']['class'] .= is_bool($properties[$class]) ? ' components-' . $class : ' components-' . $properties[$class] . '-' . $class;

            }
        }
        
        return $properties;
        
    }

    /**
     * Displays any atom
     *
     * @param string    $atom           The atom to load
     * @param array     $properties     The custom properties for a molecule
     * 
     * @return string:|void             The rendered atom
     */
    public static function atom( string $atom, array $properties = [], bool $render = true ) {
        
        if( $render == false ) {
            return self::render( 'atom', $atom, $properties, $render );    
        }
        
        self::render( 'atom', $atom, $properties );
        
    }
    
    /**
     * Displays any molecule
     *
     * @param string    $molecule       The atom to load
     * @param array     $properties     The custom properties for a molecule
     * 
     * @return string:|void             The rendered molecule
     */
    public static function molecule( string $molecule, array $properties = [], bool $render = true ) {
        
        if( $render == false ) {
            return self::render( 'molecule', $molecule, $properties, $render );    
        }
        
        self::render( 'molecule', $molecule, $properties );
        
    }

    /**
     * Turns our attributes into a usuable string for use in our atoms
     * 
     * @param   array   $attributes The array with custom properties
     * 
     * @return  string  $output     The attributes as a string
     */
    public static function attributes( array $attributes = [] ): string {

        $output     = '';

        foreach( $attributes as $key => $attribute ) {

            // Skip empty attributes
            if( ! $attribute ) {
                continue;
            }

            if( $key == 'data' && is_array($attribute) ) {
                foreach( $attribute as $data => $value ) {
                    $output .= ' data-' . $data . '="' . $value . '"';
                }
            } elseif( $key == 'style' && is_array($attribute) ) {
                $style  = '';
                foreach( $attribute as $selector => $value ) {
                    if( ! $value ) {
                        continue;
                    }                    
                    $style .= $selector . ':' . $value . ';';
                } 

                // Only if we style properties we add our inline styling
                if( $style ) {
                    $output .= ' style="' . $style . '"';
                }

            } else {
                $output .= ' ' . $key .'="' . $attribute . '"';
            }
        }

        return $output;

    }

    /**
     * This function exists for backwards compatibility for multiParseArgs, may they be used externally
     * 
     * @param array $args       The arguments to parse
     * @param array $default    The default arguments
     * 
     * @return array $array     The merged array
     */
    public static function multiParseArgs( array $args, array $default ): array {
        return self::multi_parse_args( $args, $default );
    }

    /**
     * Allows us to parse arguments in a multidimensional array
     * 
     * @param array $args       The arguments to parse
     * @param array $default    The default arguments
     * 
     * @return array $array     The merged array
     */
    public static function multi_parse_args( array $args, array $default ): array {

        if( ! is_array($default) ) {
            return wp_parse_args( $args, $default );
        }

        $array = [];

        // Loop through our multidimensional array
        foreach( [$default, $args] as $elements ) {

            foreach( $elements as $key => $element ) {

                // If we have numbered keys
                if( is_integer($key) ) {
                    $array[] = $element;

                // Atoms are always overwritten by the arguments
                } elseif( in_array($key, ['atoms', 'content_atoms', 'footer_atoms', 'header_atoms', 'image', 'socket_atoms', 'top_atoms']) ) { 
                    $array[$key] = $element;
                } elseif( isset( $array[$key] ) && (is_array( $array[$key] )) && ! empty($array[$key]) && is_array($element) ) {
                    $array[$key] = self::multi_parse_args( $element, $array[$key] );
                } else {
                    $array[$key] = $element;
                }

            }
        }

        return $array;

    } 
    
    /**
     * Retrieves older variable set-up, using camelcase to the new variations
     * This function exists for backwards compatibility
     * 
     * @param Array $properties     The properties for a component, either a molecule or component
     * @param Array $converts       The properties that need to be converted, in the format of old => new
     * 
     * @return Array $properties    The modified component properties
     */
    public static function convert_camels( $properties, $converts ) {

        foreach($converts as $old => $new ) {
            if( isset($properties[$old]) && $properties[$old] ) {
                $properties[$new] = $properties[$old];
                unset($properties[$old]);
            }
        }

        return $properties;  

    }
    
}