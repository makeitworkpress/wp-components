<?php
/**
 * Represents a search form
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'ajax'      => false,   // Enables the ajax search action,
    'all'       => __('View all search results', 'components'),
    'collapse'  => false,   // If collapsed, only shows a search icon that opens a form upon click
    'data'      => '',      // Custom data attributes
    'delay'     => 300,     
    'form'      => get_search_form(false),      
    'length'    => 3,       // The length to start querying with ajax
    'link'      => esc_url( get_search_link('') ), 
    'none'      => __('Bummer! No results found', 'components'), 
    'number'    => 5       // The amount of posts to query with ajax
) );  
 
// Our data attributes
$data = array( 'delay', 'length', 'none', 'number' );
foreach( $data as $key => $data ) {  
    $atom['data'] .= ' data-' . $data . '="' . $atom[$data] . '"';
}

if( $atom['collapse'] ) {
    $atom['style'] .= ' atom-search-collapse';
}

if( $atom['ajax'] ) {
    $atom['style'] .= ' atom-search-ajax'; 
} ?>     

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