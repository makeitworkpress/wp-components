<?php
/**
 * Displays the default featured image
 */

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multiParseArgs( $atom, [
    'items'     => [] // Accepts an array with list items, keyed with icon (font-awesome icon), label (the label) and link
] );

if( ! $atom['items'] ) {
    return;
}

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<ul <?php echo $attributes; ?>>

    <?php foreach($atom['items'] as $item) { ?> 

        <li>
    
            <?php if( isset($item['link']) && $item['link'] ) { ?>
                <a href="<?php echo $item['link']; ?>">
            <?php } ?>

                <?php if( isset($item['icon']) && $item['icon'] ) { ?>
                    <i class="fa fa-<?php echo $item['icon']; ?>"></i>
                <?php } ?>            
            
                <?php echo $item['label']; ?>
            
            <?php if( isset($item['link']) && $item['link'] ) { ?>
                </a>
            <?php } ?>

        </li>
    
    <?php } ?>
    
</ul>