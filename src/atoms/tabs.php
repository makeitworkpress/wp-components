<?php
/**
 * Represents a list of clickable tags from a certain taxonomy
 */

// Atom values
$atom = wp_parse_args( $atom, [
    'position'  => 'top',
    'tabs'      => []      // Accepts an array with tab ids as keys, with an array with content, icon, link or title
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
                <a class="atom-tab <?php echo $active; ?>" href="<?php echo isset($tab['link']) ? $tab['link'] : '#'; ?>" data-target="<?php echo $key; ?>">
                    
                    <?php if( isset($tab['icon']) ) { ?> 
                        <i class="fa fa-<?php echo $tab['icon']; ?>"></i>
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
                    // Our definite tab content                                
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