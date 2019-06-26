<?php
/**
 * Load our components using a static wrapper
 */
namespace MakeitWorkPress\WP_Components;
use MakeitWorkPress\WP_Components\Build as Build;

defined( 'ABSPATH' ) or die( 'Go eat veggies!' );

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
            if( in_array($method, ['__construct', 'addMessage', 'addError', 'resolve', 'hasErrors']) )
                continue;
            
            // If a method is public, also add
            if( strpos($method, 'public') == 0 ) {
                add_action('wp_ajax_nopriv_' . $method, [$this, $method] );
            }

            add_action('wp_ajax_' . $method,  [$this, $method] );
                
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
           
            $count      = intval( get_post_meta($id, 'components_rating_count', true) );
            $rating     = floatval( get_post_meta($id, 'components_rating', true) );
            
            $newCount   = $count ? $count + 1 : 1;
            $newRating  = ($rating * $count + $userRating)/$newCount;
            
            update_post_meta($id, 'components_rating_count', $newCount);
            update_post_meta($id, 'components_rating', $newRating);

            $output = Build::atom( 'rate', ['count' => $newCount, 'value' => $newRating, 'id' => $id, 'max' => $max, 'min' => $min], false );
            
            wp_send_json_success( ['rating' => $newRating, 'count' => $newCount, 'output' => $output] );
        
        }
        
    }
    
    /**
     * Loads posts that are filtered
     */
    public function publicFilter() {
        
    }
    
    /**
     * Loads posts that are searched
     */
    public function publicSearch() {
        
        // Check nonce
        check_ajax_referer('cucumber', 'nonce');
        
        if( empty($_POST['search']) || ! is_numeric($_POST['number']) ) {
            wp_send_json_error();
        }
        
        $none       = sanitize_text_field( $_POST['none'] );
        
        // Developers can filter the arguments
        $args       = apply_filters( 'components_ajax_search_posts_args', [
            'queryArgs' => [
                'ep_integrate'      => true,
                'posts_per_page'    => intval( $_POST['number'] ), 
                'post_type'         => 'any',
                's'                 => sanitize_text_field( $_POST['search'] )
            ],
            'none'          => $none ? $none : __('Bummer! No posts found.', 'components'),
            'pagination'    => false,            
            'postProperties' => [
                'appear'        => sanitize_text_field( $_POST['appear'] ),
                'contentAtoms'  => [],
                'footerAtoms'   => [],           
                'headerAtoms'   => [
                    'title' => ['atom' => 'title', 'properties' => ['tag' => 'h4', 'link' => 'post']],
                    'type'  => ['atom' => 'type',  'properties' => []]
                ],
                'image'     => ['link' => 'post', 'size' => 'thumbnail', 'rounded' => true]
            ]
        ] );
        
        $list = Build::molecule( 'posts', $args , false );        
        
        // Return search results
        if( $list ) {
            wp_send_json_success( $list ); 
        }
        
    }    
    
}