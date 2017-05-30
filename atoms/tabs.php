<?php
/**
 * Represents a list of clickable tags from a certain taxonomy
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'style'     => 'default',   // Also accepts atom-tabs-left or atom-tabs-top as style to set the tabs at a certain position.
    'tabs'      => array()      // Accepts an array with tab ids as keys, with an array with content, icon, link or title

// Return if we do not have a video
if( ! $atom['tabs'] )
    return; ?>

<div class="atom-tabs <?php echo $atom['style']; ?>">
    <ul class="atom-tabs-navigation">
        <?php foreach( $atom['tabs'] as $key => $tab ) { ?>
            <li>
                <a href="<?php echo $tab['link'] ? $tab['link'] : '#'; ?>" data-target="<?php echo $key; ?>">
                    
                    <?php if( isset($tab['icon']) ) { ?> 
                        <i class="fa fa-<?php echo $tab['icon']; ?>"></i>
                    <?php } ?>
                    
                    <?php 
                        // Our definite tab title                                
                        if( isset($tab['title']) )    
                            echo $tab['title']; 
                    ?>    
                </a>
            </li>
        <?php } ?>
    </ul>
    <div class="atom-tabs-content">
        <?php foreach( $atom['tabs'] as $key => $tab ) { ?>
            <section data-id="<?php echo $key; ?>">
                <?php 
                    // Our definite tab content                                
                    if( isset($tab['content']) )    
                        echo $tab['content']; 
                ?>
            </section>
        <?php } ?>
    </div>
</div>