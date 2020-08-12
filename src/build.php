<?php
/**
 * Load our components using a static wrapper
 */
namespace MakeitWorkPress\WP_Components;
use WP_Error as WP_Error;

defined( 'ABSPATH' ) or die( 'Go eat veggies!' );

class Build {
    
    /**
     * Renders generic template for an atom or molecule.
     *
     * @param string    $type       The type, either a molecule or atom
     * @param string    $template   The template to load, either a template in the molecule or atom's folder
     * @param array     $properties The custom properties for the template    
     * @param array     $render     If the element is rendered. If set to false, the contents of the elements are returned  
     */
    private static function render( $type = 'atom', $template, $properties = [], $render = true ) {
        
        // Empty properties can be neglected
        if( empty($properties) ) {
            $properties = [];
        }

        // Properties should be an array
        if( ! is_array($properties) ) {
            $error = new WP_Error( 'wrong', sprintf(__('The properties for the molecule or atom called %s are not properly formatted as an array.', 'components'), $template) );
            echo $error->get_error_message();    
            return;
        }

        // If we have atom properties, they should have proper properties
        if( isset($properties['atoms']) && is_array($properties['atoms']) ) {
            foreach( $properties['atoms'] as $atom ) {
                if( ! isset($atom['atom']) ) {
                    $error = new WP_Error( 'wrong', sprintf(__('The custom atoms within %s are not properly formatted and miss the atom key.', 'components'), $template) );
                    echo $error->get_error_message();  
                    return;
                }    
            }
        }
            
        // Our template path
        $path = apply_filters( 'components_' . $type . '_path', COMPONENTS_PATH . $type . 's/' . $template . '.php', $template );
        
        if( file_exists($path) ) {
            
            ${$type}    = apply_filters( 'components_' . $type . '_properties', self::setDefaultProperties($template, $properties, $type), $template );
            
            // If we do not render, we return
            if( $render == false ) {
                ob_start();
            }
            
            require($path); 
            
            if( $render == false ) {
                return ob_get_clean();
            }
            
        } else {
            $error = new WP_Error( 'wrong', sprintf( __('The given template for the molecule or atom called %s does not exist.', 'components'), $template ) );
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
    public static function setDefaultProperties( $template, $properties, $type = 'atom' ) {

        // Define our most basic property - the class
        $properties['attributes']['class']  = isset($properties['attributes']['class']) ? $type . ' ' . $properties['attributes']['class'] : $type;
        $properties['attributes']['class'] .= ' ' . $type . '-' . $template;

        /**
         * Properties that generate a specific class for a style or are generic
         */
        foreach( ['align', 'animation', 'appear', 'background', 'border', 'color', 'display', 'float', 'grid', 'height', 'hover', 'parallax', 'position', 'rounded', 'width'] as $class ) {
            
            if( isset($properties[$class]) && $properties[$class] ) {

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

                // Set our definite class
                $properties['attributes']['class'] .= is_bool($properties[$class]) ? ' components-' . $class : ' components-' . $properties[$class] . '-' . $class;

            }
        }
        
        return $properties;
        
    }

    /**
     * Displays any atom
     *
     * @param string    $atom       The atom to load
     * @param array     $variables  The custom variables for a molecule
     */
    public static function atom( $atom, $variables = array(), $render = true ) {
        
        if( $render == false ) {
            return self::render( 'atom', $atom, $variables, $render );    
        }
        
        self::render( 'atom', $atom, $variables );
        
    }
    
    /**
     * Displays any molecule
     *
     * @param string    $molecule   The atom to load
     * @param array     $variables  The custom variables for a molecule
     */
    public static function molecule( $molecule, $variables = array(), $render = true ) {
        
        if( $render == false ) {
            return self::render( 'molecule', $molecule, $variables, $render );    
        }
        
        self::render( 'molecule', $molecule, $variables );
        
    }

    /**
     * Turns our attributes into a usuable string for use in our atoms
     * 
     * @param   array   $attributes The array with custom properties
     * @return  string  $output     The attributes as a string
     */
    public static function attributes( $attributes = [] ) {

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
     * Allows us to parse arguments in a multidimensional array
     * 
     * @param array $args The arguments to parse
     * @param array $default The default arguments
     * 
     * @return array $array The merged array
     */
    public static function multiParseArgs( $args, $default ) {

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
                } elseif( in_array($key, ['atoms', 'contentAtoms', 'footerAtoms', 'headerAtoms', 'image', 'socketAtoms', 'topAtoms']) ) { 
                    $array[$key] = $element;
                } 
                elseif( isset( $array[$key] ) && (is_array( $array[$key] )) && ! empty($array[$key]) && is_array($element) ) {
                    $array[$key] = self::multiParseArgs( $element, $array[$key] );
                } else {
                    $array[$key] = $element;
                }

            }
        }

        return $array;

    }    
    
}