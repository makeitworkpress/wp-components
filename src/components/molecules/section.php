<?php
/**
 * Displays a generic section
 */

// Backward compatibility
$molecule = MakeitWorkPress\WP_Components\Build::convert_camels($molecule, ['gridGap' => 'grid_gap']);

// Arguments
$molecule = MakeitWorkPress\WP_Components\Build::multi_parse_args( $molecule, [
    'atoms'         => [],          // Can render atoms if necessary
    'columns'       => [],          // Columns to display with their corresponding width and containing atoms. Use ['column' => 'half', 'atoms' => [['atom' => 'atom']]]
    'container'     => true,        // Wrap this component in a container
    'grid'          => false,       // Whether to display a grid
    'grid_gap'       => 'default',   // The gridgap, if a grid is enabled
    'molecules'     => [],          // Can render molecules if necessary
    'tag'           => 'section',
    'video'         => ''           // Expects the url for a video for display a video background
] ); 

// Adds wrapper classes if we don't have a container
if( ! $molecule['container'] && $molecule['grid'] ) {
    $molecule['attributes']['class'] .= ' components-grid-wrapper components-grid-' . $molecule['grid_gap'];
}

$attributes = MakeitWorkPress\WP_Components\Build::attributes($molecule['attributes']); ?>

<<?php echo $molecule['tag']; ?> <?php echo $attributes; ?>>
    
    <?php do_action( 'components_section_before', $molecule ); ?>

    <?php if($molecule['video']) { ?>
        <div class="components-video-background-container">
            <video class="components-video-background-src" autoplay="autoplay" muted="muted" loop="loop" playsinline="playsinline" src="<?php echo esc_url($molecule['video']); ?>"></video>
        </div>
    <?php } ?>

    <?php if( $molecule['container'] ) { ?>
        <div class="components-container<?php if($molecule['grid']) { ?> components-grid-wrapper components-grid-<?php echo $molecule['grid_gap']; } ?>">
    <?php } ?>

        <?php foreach( $molecule['columns'] as $column ) { ?>
            <div class="components-section-columns components-<?php echo isset($column['column']) ? $column['column'] : 'fourth'; ?>-grid">
                <?php 
                    if( isset($column['atoms']) && is_array($column['atoms']) ) { 
                        foreach( $column['atoms'] as $atom ) {
                            MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties']); 
                        }
                    }
                ?>
            </div>
        <?php } ?>       

        <?php 

            // Displaying atoms only
            foreach( $molecule['atoms'] as $atom ) { 
                MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties']);
            } 

            // Displaying molecules
            foreach( $molecule['molecules'] as $sub_molecule ) { 
                MakeitWorkPress\WP_Components\Build::molecule($sub_molecule['molecule'], $sub_molecule['properties']);
            }             

        ?>

    <?php if( $molecule['container'] ) { ?>
        </div>
    <?php } ?>                 
    
    <?php do_action( 'components_section_after', $molecule ); ?>
    
</<?php echo $molecule['tag']; ?>>