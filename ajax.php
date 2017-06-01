<?php
/**
 * Load our components using a static wrapper
 */
namespace Components;
use Components\Build as Build;

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
        
        // Check nonce
        check_ajax_referer('cucumber', 'nonce');
        
        // Check values       
        if( ! is_numeric($_POST['id']) || ! is_numeric($_POST['rating']) )
            wp_send_json_error();        
        
        $userRating     = intval($_POST['rating']);
        $id             = intval($_POST['id']);
        $max            = intval($_POST['max']);
        $min            = intval($_POST['min']);
        
        // Proceed if the rating is numeric, and between 0 and 5
        if( $userRating <= $max && $userRating > $min ) {
           
            $count      = get_post_meta($id, 'components_rating_count', true);
            $rating     = get_post_meta($id, 'components_rating', true);
            
            $newCount   = $count ? intval($count) + 1 : 1;
            $newRating  = ($rating * $count + $userRating)/$newCount;
            
            update_post_meta($id, 'components_rating_count', $newCount);
            update_post_meta($id, 'components_rating', $newRating);
            
            ob_start();
                Build::atom( 'rate', array('count' => $newCount, 'value' => $newRating, 'id' => $id, 'max' => $max, 'min' => $min) );
                $output = ob_get_contents(); 
            ob_get_clean();
            
            wp_send_json_success( array('rating' => $newRating, 'count' => $newCount, 'output' => $output) );
        
        }
        
    }
    
    /**
     * Loads posts that are filtered
     */
    public function publicFilter() {
        
    }    
    
}