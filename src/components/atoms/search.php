<?php
/**
 * Represents a search form
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, [
    'attributes' => [
        'data' => [
            'appear'    => 'bottom',    // Determines from which direction posts apear, using scroll-reveal. Accepts bottom, top, left or right
            'delay'     => 500,         // Delay to start searching after typing
            'length'    => 3,           // The length of the search string to start querying with ajax
            'none'      => __('Bummer! No results found', WP_COMPONENTS_LANGUAGE), 
            'number'    => 5,           // The amount of posts to query with ajax
            'types'     => ''           // Option post types to search for, seperated by ,
        ]
    ],
    'ajax'      => false,   // Enables the ajax live search action,
    'all'       => __('View all search results', WP_COMPONENTS_LANGUAGE),
    'collapse'  => false,   // If collapsed, only shows a search icon that opens a form upon click
    'form'      => get_search_form(false),      
    'link'      => esc_url( get_search_link('') ), 
    'types'     => [], // Post types to include in search
] );  

if( $atom['collapse'] ) {
    $atom['attributes']['class'] .= ' atom-search-collapse';
}

if( $atom['ajax'] ) {
    $atom['attributes']['class'] .= ' atom-search-ajax'; 
} 

/**
 * Modify search for certain post types
 */
$types = isset($_GET['post_type']) && $_GET['post_type'] ? sanitize_text_field($_GET['post_type']) : false;
if( $atom['types'] ) {
    $types = $types ? $types : implode(',', $atom['types']);
}

if( $types ) {
    $atom['attributes']['data']['types'] = $types;
    
    // A bit ugly, but adds a hidden input field for post types
    $atom['form'] = str_replace(
        '</form>',
        '<input type="hidden" name="post_type" value="' . $types . '"></form>',
        $atom['form']
    );
}

// Generate attributes
$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>     

<div <?php echo $attributes; ?>>
    
    <div class="atom-search-form">
        <?php echo $atom['form']; ?>
        <i class="fas fa-spin fa-circle-notch"></i>
    </div>
    
    <?php if( $atom['ajax'] ) { ?>
        <div class="atom-search-results">
            <?php if( $atom['all'] ) { ?>
                <a class="atom-search-all" href="<?php echo $atom['link']; ?>" title="<?php echo $atom['all']; ?>">
                    <?php echo $atom['all']; ?>
                </a>
            <?php } ?>
        </div>
    <?php } ?>
    
    <?php if( $atom['collapse'] ) { ?>
        <a href="#" class="atom-search-expand">
            <i class="fas fa-search"></i>
        </a>
    <?php } ?>
    
</div> 