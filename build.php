<?php
/**
 * Load our components using a static wrapper
 */
namespace WP_Components;
use WP_Error as WP_Error;

defined( 'ABSPATH' ) or die( 'Go eat veggies!' );

class Build {
    
    /**
     * Retrieves the generic template for an atom or molecule.
     *
     * @param string    $type       The type, either a molecule or atom
     * @param string    $template   The template to load, either a template in the molecule or atom's folder
     * @param array     $properties The custom properties for the template    
     * @param array     $render     If the element is rendered. If set to false, the contents of the elements are returned  
     */
    private static function template( $type = 'atom', $template, $properties = array(), $render = true ) {
        
        // Properties should be an array
        if( ! is_array($properties) ) {
            $error = new WP_Error( 'wrong', sprintf(__('The properties for the molecule or atom called %s are not properly formatted as an array.', 'components'), $template) );
            echo $error->get_error_message();    
            return;
        }

        // If we have atom properties, they should have
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
            
            ${$type} = apply_filters( 'components_' . $type . '_properties', self::defaultProperties($template, $properties), $template );
            
            // If we do not render, we return
            if( $render == false ) {
                
                ob_start();
                    require($path); 
                $output = ob_get_clean();

                return $output;
                
            } else {
                require($path); 
            }
            
        } else {
            $error = new WP_Error( 'wrong', sprintf( __('The given template for the molecule or atom called %s does not exist.', 'components'), $template ) );
            echo $error->get_error_message();             
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
        
        /**
         * Generic variables properties
         */
        $generics = array('data', 'inlineStyle', 'style');
        foreach( $generics as $generic ) {
            $properties[$generic] = isset( $properties[$generic] ) && $properties[$generic] ? $properties[$generic] : '';    
        }
        
        /**
         * Properties that generate a specific class for a style
         */
        $classes = array( 'align', 'animation', 'appear', 'display', 'float', 'grid', 'hover', 'parallax', 'rounded' );    
        
        foreach( $classes as $class ) {
            if( isset($properties[$class]) && $properties[$class] ) {
                $properties['style'] .= is_bool($properties[$class]) ? ' components-' . $class : ' components-' . $properties[$class] . '-' . $class;
            }
        }      
                    
        /**
         * Enqueue scripts of not enqueued yet
         */
        if( isset($properties['appear']) || isset($properties['postsAppear']) || (isset($properties['ajax']) && $properties['ajax'] == true && $template == 'search') 
        ) {

            if( ! wp_script_is('scrollreveal') && apply_filters('components_scrollreveal_script', true) )
                wp_enqueue_script('scrollreveal');
            
        }
        
        if( isset($properties['lazyload']) && $properties['lazyload'] ) {
            if( ! wp_script_is('lazyload') && apply_filters('components_lazyload_script', true) )
                wp_enqueue_script('lazyload');        
        }
        
        /**
         * Specific selectors
         */
        
        // Background color
        if( isset($properties['background']) && $properties['background'] ) {
            if( strpos($properties['background'], '#') === 0 || strpos($properties['background'], 'rgb') === 0 || strpos($properties['background'], 'linear-gradient') === 0 ) {
                $properties['inlineStyle'] .= 'background:' . $properties['background'] . ';';
            } elseif( strpos($properties['background'], 'http') === 0 ) {
                if( isset($properties['lazyload']) && $properties['lazyload'] ) {
                    $properties['data']  .= ' data-src="' . $properties['background'] . '"';
                    $properties['style'] .= ' components-image-background components-lazyload'; 
                } else {
                    $properties['inlineStyle'] .= 'background-image: url(' . $properties['background'] . ');';
                    $properties['style'] .= ' components-image-background';                    
                }
            } elseif( $properties['background'] ) {
                $properties['style'] .= ' components-' . $properties['background'] . '-background';
            }
        }
        
        // Border color
        if( isset($properties['border']) && $properties['border'] ) {
            if( strpos($properties['border'], '#') === 0 || strpos($properties['border'], 'rgb') === 0 ) {
               $properties['inlineStyle'] .= 'border: 2px solid' . $properties['border'] . ';';
            } elseif( strpos($properties['border'], 'linear-gradient') === 0 ) {
                $properties['inlineStyle'] .= 'border: 2px solid transparent;';
                $properties['inlineStyle'] .= 'border-image: ' . $properties['border'] . '; border-image-slice: 1;';
            } elseif( $properties['border'] ) {
                $properties['style'] .= ' components-' . $properties['border'] . '-border';
            }
        }                
        
        // Heights
        if( isset($properties['height']) && $properties['height'] ) {
            if( is_numeric($properties['height']) ) {
                $properties['inlineStyle'] .= 'min-height: ' . $properties['height'] . 'px;';
            } else {
                $properties['style'] .= ' components-' . $properties['height'] . '-height'; 
            }
        }             

        // Text color
        if( isset($properties['color']) && $properties['color'] ) {
            if( strpos($properties['color'], '#') === 0 || strpos($properties['color'], 'rgb') === 0 ) {
                $properties['inlineStyle'] .= 'color:' . $properties['color'] . ';';
            } elseif( $properties['color'] ) {
                $properties['style'] .= ' components-' . $properties['color'] . '-color';
            }
        }

        /**
         * If we have inline styles, we add them
         */
        if( $properties['inlineStyle'] )
            $properties['inlineStyle'] = 'style=" ' . $properties['inlineStyle'] . ' "';
        
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
            return self::template( 'atom', $atom, $variables, $render );    
        }
        
        self::template( 'atom', $atom, $variables );
        
    }
    
    /**
     * Displays any molecule
     *
     * @param string    $molecule   The atom to load
     * @param array     $variables  The custom variables for a molecule
     */
    public static function molecule( $molecule, $variables = array(), $render = true ) {
        
        if( $render == false ) {
            return self::template( 'molecule', $molecule, $variables, $render );    
        }
        
        self::template( 'molecule', $molecule, $variables );
        
    }
    
}