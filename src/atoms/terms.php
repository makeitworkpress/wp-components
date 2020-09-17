<?php
/**
 * Represents a list of clickable terms from a certain taxonomy.
 */

// Atom values
$atom = wp_parse_args( $atom, [
    'after'     => '',                              // Content after each term
    'args'      => ['taxonomy' => 'post_tag'],      // Arguments for retrieving the tags 
    'before'    => '',                              // Content before each term
    'hoverItem' => '', // Allows a hover.css class applied to each item. Requires hover to be set true in Boot().  
    'seperator' => '/',                             // Content that seperates terms
    'terms'     => [],                              // Accepts a custom array of terms
    'termStyle' => 'normal'                         // Accepts a custom style, such as button
] );

if( ! $atom['terms'] ) {
    $atom['terms'] = get_terms( $atom['args'] );
}

// Return if we do not have a video
if( ! $atom['terms'] ) {
    return;
}

if( $atom['termStyle'] ) {
    $atom['termStyle'] = 'atom-term-style-' . $atom['termStyle'];
}

// Save the taxonomy for possible filtering
$atom['attributes']['data']['taxonomy'] = $atom['args']['taxonomy'];

// So we can check our seprator
$count      = count($atom['terms']);
$i          = 0; 
$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<ul <?php echo $attributes; ?>>
    
    <?php foreach( $atom['terms'] as $term ) { ?>
        <li>
            
            <?php 
                if( $atom['before'] ) {                             
                    echo $atom['before']; 
                }
            ?>
            
            <a class="atom-term <?php echo $atom['termStyle'] ?><?php if($atom['hoverItem']) { ?> hvr-<?php echo $atom['hoverItem']; } ?>" href="<?php echo esc_url( get_term_link($term) ) ?>" data-id="<?php echo $term->term_id; ?>">
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