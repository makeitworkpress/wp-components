<?php
/**
 * Represents a search form
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'attributes' => [
        'data' => [
            'appear'    => 'bottom', // Determines from which direction posts apear, using scroll-reveal. Accepts bottom, top, left or right
            'delay'     => 300,      // Delay to start searching after typing
            'length'    => 3,        // The length of the search string to start querying with ajax
            'none'      => __('Bummer! No results found', WP_COMPONENTS_LANGUAGE), 
            'number'    => 5       // The amount of posts to query with ajax
        ]
    ],
    'ajax'      => false,   // Enables the ajax search action,
    'all'       => __('View all search results', WP_COMPONENTS_LANGUAGE),
    'collapse'  => false,   // If collapsed, only shows a search icon that opens a form upon click
    'form'      => get_search_form(false),      
    'link'      => esc_url( get_search_link('') ), 
] );  

if( $atom['collapse'] ) {
    $atom['attributes']['class'] .= ' atom-search-collapse';
}

if( $atom['ajax'] ) {
    $atom['attributes']['class'] .= ' atom-search-ajax'; 
} 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>     

<div <?php echo $attributes; ?>>
    
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