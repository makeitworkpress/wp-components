<?php
/**
 * Represents a list of clickable terms from a certain taxonomy.
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'after'     => '',                              // Content after each tag
    'args'      => array('taxonomy' => 'post_tag'), // Arguments for retrieving the tags 
    'before'    => '',                              // Content before each tag
    'seperator' => '',                              // Content that seperates tags
    'terms'      => array(),                        // Accepts a custom array of terms
    'tagstyle'  => 'default'                        // Way of displaying individual terms, also accepts atom-button
) );

if( ! $atom['terms'] )
    $atom['terms'] = get_terms( $atom['args'] );

// Return if we do not have a video
if( ! $atom['terms'] )
    return; 

$count = count($atom['terms']);
$i = 0; ?>

<ul class="atom-terms <?php echo $atom['style']; ?>" data-taxonomy="<?php echo $atom['args']['taxonomy']; ?>">
    
    <?php foreach( $atom['terms'] as $term ) { ?>
        <li>
            
            <?php 
                if( $atom['before'] )                              
                    echo $atom['before']; 
            ?>
            
            <a href="<?php echo esc_url( get_term_link($term) ) ?>" data-id="<?php echo $term->term_id; ?>">
                <?php echo $term->name; ?>
            </a>
            
            <?php 
                if( $atom['after'] )                              
                    echo $atom['after']; 
            ?>
            
        </li>
    
        <?php 
            
            // Seperators
            if( $atom['seperator'] ) {                                  
                                              
            $i++;
                                              
            if( $count != $count )                                  
                echo $atom['seperator']; 
                
            }

        ?>
    
    <?php } ?>
    
</ul>