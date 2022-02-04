<?php
/**
 * Represents a list of clickable tags from a certain taxonomy
 */

// Backward compatibility
$atom = MakeitWorkPress\WP_Components\Build::convert_camels($atom, ['hoverItem' => 'hover_item']);

// Atom values
$atom = wp_parse_args( $atom, [
    'hover_item'    => '', // Allows a hover.css class applied to each item. Requires hover to be set true in Boot().    
    'position'      => 'top',
    'tabs'          => []      // Accepts an array with tab ids as keys, with an array with content, icon, link or title
] );

// Return if we do not have tabs
if( ! $atom['tabs'] ) {
    return;
}

// Our tabs position
$atom['attributes']['class'] .= ' atom-tabs-' . $atom['position']; 

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    <ul class="atom-tabs-navigation">
        <?php 
            $count = 0;
            foreach( $atom['tabs'] as $key => $tab ) { 
                $active = $count === 0 ? ' active' : 'inactive';
                $count++;
                
        ?>
            <li>
                <a class="atom-tab <?php echo $active; ?><?php if($atom['hover_item']) { ?> hvr-<?php echo $atom['hover_item']; } ?>" href="<?php echo isset($tab['link']) ? $tab['link'] : '#'; ?>" data-target="<?php echo $key; ?>">
                    
                    <?php if( isset($tab['icon']) ) { ?> 
                        <i class="<?php echo $tab['icon']; ?> hvr-icon"></i>
                    <?php } ?>
                    
                    <?php 
                        // Our definite tab title                                
                        if( isset($tab['title']) ) {    
                            echo $tab['title']; 
                        }
                    ?>    
                </a>
            </li>
        <?php 
            } 
        ?>
    </ul>
    <div class="atom-tabs-content">
        <?php 
            $count = 0;
            foreach( $atom['tabs'] as $key => $tab ) { 
                $active = $count === 0 ? ' active' : '';
                $count++;
        ?>
            <section class="atom-tab <?php echo $active; ?>" data-id="<?php echo $key; ?>">
                <?php                               
                    if( isset($tab['content']) ) {   
                        echo $tab['content'];
                    }
                ?>
            </section>
        <?php 
            } 
        ?>
    </div>
</div>