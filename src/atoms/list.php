<?php
/**
 * Displays the default featured image
 */

// Backward compatibility
$atom = MakeitWorkPress\WP_Components\Build::convert_camels($atom, ['gridGap' => 'grid_gap', 'hoverItem' => 'hover_item']);

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, [      
    'grid'          => false,       // Displays the list in a grid,
    'grid_gap'      => 'default',   // Accepts a certain gridgap
    'hover_item'    => '',          // Allows a hover.css class applied to each item. Requires hover to be set true in Boot().      
    'items'         => [],          // Accepts an array with list items, keyed with icon (font-awesome icon), title, description, link and column
    'style'         => 'default',   // Accepts default or card to display a card like list
    'titleTag'      => 'h4'         // The title tag for the list title
] );

if( ! $atom['items'] ) {
    return;
}

// Additional classes
$atom['attributes']['class'] .= ' components-list-' . $atom['style'];

if( $atom['grid'] ) {
    $atom['attributes']['class'] .= ' components-grid-wrapper components-grid-' . $atom['grid_gap'];
}

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<ul <?php echo $attributes; ?>>

    <?php foreach($atom['items'] as $item) { ?> 

        <li class="components-list-item<?php if( isset($item['column']) && $item['column'] ) { ?> components-<?php echo $item['column']; ?>-grid<?php } if( $atom['hover_item'] ) { ?> hvr-<?php echo $atom['hover_item']; } ?>">

            <?php if( isset($item['icon']) && $item['icon'] ) { ?>
                <i class="fa fa-<?php echo $item['icon']; ?> hvr-icon"></i>
            <?php } ?>   
            
            <div class="components-list-item-content">
              
                <<?php echo $atom['titleTag']; ?> class="components-list-item-title">

                    <?php if( isset($item['link']) && $item['link'] ) { ?>
                        <a href="<?php echo $item['link']; ?>">
                    <?php } ?>
                
                        <?php echo $item['title']; ?>
            
                    <?php if( isset($item['link']) && $item['link'] ) { ?>
                        </a>
                    <?php } ?> 

                </<?php echo $atom['titleTag']; ?>>   

                <?php if( isset($item['description']) && $item['description'] ) { ?>
                    <p><?php echo $item['description']; ?></p>
                <?php } ?> 
                
            </div>               

        </li>
    
    <?php } ?>
    
</ul>