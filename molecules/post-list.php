<?php
/**
 * Displays a generic post list
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'filter'    => false,       // Adds a custom filter for a certain taxonomy. Accepts a certain taxonomy name.
    'grid'      => '',          // Accepts a custom grid class or a certain pattern of grid classes
    'infinite'  => false,    
    'paginate'  => array( 'type' => 'default' ),   
    'style'     => 'default',
    'type'      => 'post'       // Custom post type to load
) ); 

if( $atom['infinite'] ) 
    $atom['style'] .= ' do-infinite'; ?>

<div class="atom-post-list <?php echo $atom['style']; ?>">
    
    <?php 
        // Pagination
        if( $atom['paginate'] ) { 
            Components::atom( 'paginate', $atom['paginate'] );
        } 
    ?>
</div>