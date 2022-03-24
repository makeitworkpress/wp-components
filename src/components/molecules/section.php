<?php
/**
 * Displays a generic section
 */

// Backward compatibility
$molecule = MakeitWorkPress\WP_Components\Build::convert_camels($molecule, ['gridGap' => 'grid_gap']);

// Arguments
$molecule = MakeitWorkPress\WP_Components\Build::multi_parse_args( $molecule, [
    'atoms'         => [],          // Can render atoms if necessary
    'columns'       => [],          // Columns to display with their corresponding width and containing atoms or molecules. Use ['column' => 'half', 'atoms' => [['atom' => 'atom']]]
    'container'     => true,        // Wrap this component in a container
    'custom_action' => '',          // Adds a custom add_action hook next to the default section hooks. This value is sanitized. Also ensures backwards compatibility
    'grid'          => false,       // Whether to display a grid
    'grid_gap'      => 'default',   // The gridgap, if a grid is enabled
    'molecules'     => [],          // Can render molecules if necessary
    'tag'           => 'section',   // A tag for the section. Supports section, header, footer, main and div
    'scroll'        => false,       // Renders a scroll down button if set to true.
    'video'         => ''           // Expects the url for a video for display a video background
] ); 

// Prevents the use of unsupported tags
if( ! in_array($molecule['tag'], ['div', 'footer', 'header', 'main', 'section']) ) {
    $molecule['tag'] = 'div';
}

// Adds wrapper classes if we don't have a container
if( ! $molecule['container'] && $molecule['grid'] ) {
    $molecule['attributes']['class'] .= ' components-grid-wrapper components-grid-' . $molecule['grid_gap'];
}

$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<<?php echo $molecule['tag']; ?> <?php echo $attributes; ?>>
    
    <?php do_action( 'components_section_before', $molecule ); ?>

    <?php if( $molecule['custom_action'] ) { ?>
        <?php do_action( 'components_' . sanitize_key( $molecule['custom_action'] ) . '_before', $molecule ); ?>    
    <?php } ?>

    <?php if($molecule['video']) { ?>
        <div class="components-video-background-container">
            <video class="components-video-background-src" autoplay="autoplay" muted="muted" loop="loop" playsinline="playsinline" src="<?php echo esc_url($molecule['video']); ?>"></video>
        </div>
    <?php } ?>

    <?php if( $molecule['container'] ) { ?>
        <div class="components-container<?php if($molecule['grid']) { ?> components-grid-wrapper components-grid-<?php echo $molecule['grid_gap']; } ?>">
    <?php } ?>

        <?php do_action( 'components_section_container_begin', $molecule ); ?>

        <?php if( $molecule['custom_action'] ) { ?>
            <?php do_action( 'components_' . sanitize_key( $molecule['custom_action'] ) . '_container_begin', $molecule ); ?>    
        <?php } ?>        

        <?php foreach( $molecule['columns'] as $column ) { ?>
            <div class="components-section-columns components-<?php echo isset($column['column']) ? $column['column'] : 'fourth'; ?>-grid">
                <?php 

                    // Molecules
                    if( isset($column['molecules']) && is_array($column['molecules']) ) { 
                        foreach( $column['molecules'] as $molecule ) {
                            MakeitWorkPress\WP_Components\Build::molecule($molecule['molecule'], $molecule['properties']); 
                        }
                    }                    

                    // Atoms
                    if( isset($column['atoms']) && is_array($column['atoms']) ) { 
                        foreach( $column['atoms'] as $atom ) {
                            MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties']); 
                        }
                    }
                ?>
            </div>
        <?php } ?>       

        <?php 

            // Displaying molecules
            foreach( $molecule['molecules'] as $sub_molecule ) { 
                MakeitWorkPress\WP_Components\Build::molecule($sub_molecule['molecule'], $sub_molecule['properties']);
            }          

            // Displaying atoms only
            foreach( $molecule['atoms'] as $atom ) { 
                MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties']);
            }            

        ?>

        <?php do_action( 'components_section_container_end', $molecule ); ?>

        <?php if( $molecule['custom_action'] ) { ?>
            <?php do_action( 'components_' . sanitize_key( $molecule['custom_action'] ) . '_container_end', $molecule ); ?>    
        <?php } ?>          

    <?php if( $molecule['container'] ) { ?>
        </div>
    <?php } ?>

    <?php 
    
        // Scroll-down button
        if( $molecule['scroll'] ) { 
            MakeitWorkPress\WP_Components\Build::atom( 'scroll', $molecule['scroll'] );
        }
    
    ?>    
    
    <?php do_action( 'components_section_after', $molecule ); ?>

    <?php if( $molecule['custom_action'] ) { ?>
        <?php do_action( 'components_' . sanitize_key( $molecule['custom_action'] ) . '_after', $molecule ); ?>    
    <?php } ?>        
    
</<?php echo $molecule['tag']; ?>>