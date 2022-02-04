<?php
/**
 * Represents a list of clickable terms from a certain taxonomy.
 */

// Backward compatibility
$atom = MakeitWorkPress\WP_Components\Build::convert_camels($atom, ['hoverItem' => 'hover_item', 'termStyle' => 'term_style']);

// Atom values
$atom = wp_parse_args( $atom, [
    'after'         => '',                              // Content after each term
    'args'          => ['taxonomy' => 'post_tag'],      // Arguments for retrieving the tags 
    'before'        => '',                              // Content before each term
    'hover_item'    => '',                              // Allows a hover.css class applied to each item. Requires hover to be set true in Boot().  
    'seperator'     => '/',                             // Content that seperates terms
    'terms'         => [],                              // Accepts a custom array of terms
    'term_style'     => 'normal'                        // Accepts a custom style, such as 'button'
] );

if( ! $atom['terms'] ) {
    $atom['terms'] = get_terms( $atom['args'] );
}

// Return if we do not have a video
if( ! $atom['terms'] ) {
    return;
}

if( $atom['term_style'] ) {
    $atom['term_style'] = ' atom-term-style-' . $atom['term_style'];
}

// Get the queried object so we can see active terms
$query      = get_queried_object();
$active     = isset($query->term_id) && $query->term_id ? $query->term_id : 0;

// Save the taxonomy for possible filtering
$atom['attributes']['data']['taxonomy'] = $atom['args']['taxonomy'];

// So we can check our seprator
$count      = count($atom['terms']);
$i          = 0; 
$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<ul <?php echo $attributes; ?>>
    
    <?php foreach( $atom['terms'] as $term ) { ?>

        <?php 
            // Some term variables
            $term_link  = esc_url( get_term_link($term) ); 
            $term_class = $atom['term_style'];

            if( $active == $term->term_id ) {
                $term_class .= ' atom-term-active';    
            }

            if( $atom['hover_item'] ) {
                $term_class .= ' hvr-' . $atom['hover_item'];
            }
        ?>

        <li>
            
            <?php 
                if( $atom['before'] ) {                             
                    echo $atom['before']; 
                }
            ?>
            
            <a class="atom-term<?php echo $term_class; ?>" href="<?php echo $term_link; ?>" data-id="<?php echo $term->term_id; ?>">
                <?php echo $term->name; ?>
            </a>
            
            <?php 
                if( $atom['after'] ) {                             
                    echo $atom['after'];
                }
            ?>
            
        </li>
    
        <?php 
            
            // Seperators
            if( $atom['seperator'] ) {                                  
                                              
                $i++;

                if( $i != $count )                                  
                    echo '<span class="atom-terms-seperator">' . $atom['seperator'] . '</span>'; 
                
            }

        ?>
    
    <?php } ?>
    
</ul>