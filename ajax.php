<?php
/**
 * Load our components using a static wrapper
 */
namespace Components;
use Components\Components as Components;

class Ajax {
    
    /**
     * Initialize our components
     *
     * @param array $configurations The basic configurations for the components
     */
    public function __construct( $configurations = array() ) {
        
        $methods = get_class_methods( $this );
        
        foreach( $methods as $method ) {
            
            // Skip our default methods
            if( in_array($method, array('__construct', 'addMessage', 'addError', 'resolve', 'hasErrors')) )
                continue;
            
            // If a method is public, also add
            if( strpos($method, 'public') == 0 ) {
                add_action('wp_ajax_nopriv_' . $method, array($this, $method) );
            }

            add_action('wp_ajax_' . $method,  array($this, $method) );
                
        }         
        
    }
    
    /**
     * Adds a rating to a given post
     */
    public function publicRate() {
        
    }
    
}