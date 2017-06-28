<?php
/**
 * Load our components using a static wrapper
 */
namespace WP_Components;

defined( 'ABSPATH' ) or die( 'Go eat veggies!' );

class Build {
    
    /**
     * Retrieves the generic template for an atom or molecule.
     *
     * @param string    $type       The type, either a molecule or atom
     * @param string    $template   The template to load, either a template in the molecule or atom's folder
     * @param array     $properties The custom properties for the template    
     * @param array     $render     If the element is rendered. If set to false, the contents of the elements are returned  
     *
     * @todo DRY properties that are common under multiple components and possible define them here alltogether. 
     */
    private static function template( $type = 'atom', $template, $properties, $render = true ) {
        
        // Properties should be an array
        if( ! is_array($properties) ) {
            
            printf( __('The properties for the molecule or atom called %s are not properly formatted as an array.', 'components'), $template );
            return;    
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
            printf( __('The given template for the molecule or atom called %s does not exist.', 'components'), $template );
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
        $properties['inlineStyle'] = isset($properties['inlineStyle']) && $properties['inlineStyle'] ? $properties['inlineStyle'] : '';
        $properties['style'] = isset($properties['style']) && $properties['style'] ? $properties['style'] : '';
        
        // Animation
        if( isset($properties['align']) && $properties['align'] ) {
            $properties['style'] .= ' components-' . $properties['align'] . '-align'; 
        }        
        
        if( isset($properties['animation']) && $properties['animation'] ) {
            $properties['style'] .= ' components-' . $properties['animation'] . '-animation'; 
        }
        
        // Scrollreveal. Accepts top, bottom, left, right
        if( isset($properties['appear']) && $properties['appear'] ) {
            $properties['style'] .= ' components-' . $properties['appear'] . '-appear';          
        } 
                    
        // Also enqueue scrollreveal if it is not enqueued yet
        if( isset($properties['appear']) || isset($properties['postsAppear']) || (isset($properties['ajax']) && $properties['ajax'] == true && $template == 'search') ) {

            if( ! wp_script_is('scrollreveal') && apply_filters('components_scrollreveal_script', true) )
                wp_enqueue_script('scrollreveal');
            
        }
        
        // Background color
        if( isset($properties['background']) && $properties['background'] ) {
            if( strpos($properties['background'], '#') === 0 || strpos($properties['background'], 'rgb') === 0 || strpos($properties['background'], 'linear-gradient') === 0 ) {
                $properties['inlineStyle'] .= 'background:' . $properties['background'] . ';';
            } elseif( strpos($properties['background'], 'http') === 0 ) {
                $properties['inlineStyle'] .= 'background-image: url(' . $properties['background'] . ');';
                $properties['style'] .= ' components-image-background';
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
        
        // Display
        if( isset($properties['display']) && $properties['display'] ) {
            $properties['style'] .= ' components-' . $properties['display'] . '-display'; 
        } 
        
        // Floats
        if( isset($properties['float']) ) {
            $properties['style'] .= ' components-' . $properties['float'] . '-float'; 
        } 
        
        // Floats
        if( isset($properties['grid']) && $properties['grid'] ) {
            $properties['style'] .= ' components-' . $properties['grid'] . '-grid components-grid-item'; 
        }          
        
        // Heights
        if( isset($properties['height']) && $properties['height'] ) {
            if( is_numeric($properties['height']) ) {
                $properties['inlineStyle'] .= 'min-height: ' . $properties['height'] . 'px;';
            } else {
                $properties['style'] .= ' components-' . $properties['height'] . '-height'; 
            }
        }
        
        // Heights
        if( isset($properties['hover']) && $properties['hover'] ) {
            $properties['style'] .= ' components-' . $properties['hover'] . '-hover'; 
        }        
        
        // Parallax effect for backgrounds
        if( isset($properties['parallax']) && $properties['parallax'] ) {
            $properties['style'] .= ' components-parallax'; 
        } 
        
        // Rounded
        if( isset($properties['rounded']) && $properties['rounded'] ) {
            $properties['style'] .= ' components-rounded'; 
        }         

        // Text color
        if( isset($properties['color']) && $properties['color'] ) {
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