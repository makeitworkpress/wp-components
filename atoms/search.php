<?php
/**
 * Represents a search form
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'ajax'      => false,   // Enables the ajax search action,
    'all'       => __('View all search results', 'components'),
    'collapse'  => false,   // If collapsed, only shows a search form that can be opened
    'data'      => '',      // Custom data attributes
    'delay'     => 300,     
    'form'      => get_search_form(false),      
    'length'    => 3,       // The length to start querying with ajax
    'link'      => esc_url( get_search_link('') ), 
    'number'    => 10       // The amount of posts to query with ajax
) );  

if( ! $atom['data'] ) {
    
    $data = array( 'delay', 'length', 'number' );
    
    foreach( $data as $key => $data ) {  
        $atom['data'] .= ' data-' . $data . '="' . $atom[$data] . '"';
    }
    
}

// If we have an ajax action, we add it
if( $atom['collapse'] ) 
    $atom['style'] .= ' atom-search-collapse';

// If we have an ajax action, we add it
if( $atom['ajax'] ) 
    $atom['style'] .= ' atom-search-ajax'; ?>     

<div class="atom-search <?php echo $atom['style']; ?>" href="#" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    
    <?php echo $atom['form']; ?>
    
    <?php if( $atom['ajax'] ) { ?>
        <div class="atom-search-results">
            <a class="atom-search-all" href="<?php echo $atom['link']; ?>">
                <?php echo $atom['all']; ?>
            </a>
        </div>
    <?php } ?>
    
    <?php if( $atom['collapse'] ) { ?>
        <a href="#" class="atom-search-expand">
            <i class="fa fa-search"></i>
        </a>
    <?php } ?>
    
</div> 