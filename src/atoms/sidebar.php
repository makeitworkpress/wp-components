<?php
/**
 * Displays a generic WordPress sidebar
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'attributes'    => [
        'itemscope' => 'itemscope', 
        'itemtype'  => 'http://www.schema.org/WPSideBar'
    ],
    'sidebars'      => [] // Accepts an array with the sidebar names as values
] ); 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<aside <?php echo $attributes; ?>>
    
    <?php 

        foreach( $atom['sidebars'] as $sidebar ) {

            if( is_active_sidebar($sidebar) ) { 
                dynamic_sidebar( $sidebar ); 
            }

        } 

    ?>
    
</aside>