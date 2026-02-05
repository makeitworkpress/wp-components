<?php
defined("ABSPATH") or die("Go eat veggies!");

$tag = esc_attr($molecule['tag']);
?>
<<?php echo $tag; ?> <?php echo $attributes; ?>>

    <?php do_action('components_section_before', $molecule); ?>

    <?php if ($molecule['custom_action']) { ?>
        <?php do_action('components_' . sanitize_key($molecule['custom_action']) . '_before', $molecule); ?>
    <?php } ?>

    <?php if ($molecule['video']) { ?>
        <div class="components-video-background-container">
            <video class="components-video-background-src" autoplay="autoplay" muted="muted" loop="loop" playsinline="playsinline" src="<?php echo esc_url($molecule['video']); ?>"></video>
        </div>
    <?php } ?>

    <?php if ($molecule['container']) { ?>
        <div class="components-container<?php if ($molecule['grid']) { ?> components-grid-wrapper components-grid-<?php echo esc_attr($molecule['grid_gap']); } ?>">
    <?php } ?>

        <?php do_action('components_section_container_begin', $molecule); ?>

        <?php if ($molecule['custom_action']) { ?>
            <?php do_action('components_' . sanitize_key($molecule['custom_action']) . '_container_begin', $molecule); ?>
        <?php } ?>

        <?php foreach ($molecule['columns'] as $column) { ?>
            <div class="components-section-columns components-<?php echo esc_attr(isset($column['column']) ? $column['column'] : 'fourth'); ?>-grid">
                <?php
                    // Molecules in column
                    if (isset($column['molecules']) && is_array($column['molecules'])) {
                        foreach ($column['molecules'] as $sub_molecule) {
                            MakeitWorkPress\WP_Components\Build::molecule($sub_molecule['molecule'], $sub_molecule['properties'] ?? []);
                        }
                    }

                    // Atoms in column
                    if (isset($column['atoms']) && is_array($column['atoms'])) {
                        foreach ($column['atoms'] as $atom) {
                            MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties'] ?? []);
                        }
                    }
                ?>
            </div>
        <?php } ?>

        <?php if ($molecule['molecules'] || $molecule['atoms']) { ?>
            <div class="molecule-section-components">
        <?php } ?>

            <?php
                // Displaying molecules
                foreach ($molecule['molecules'] as $sub_molecule) {
                    MakeitWorkPress\WP_Components\Build::molecule($sub_molecule['molecule'], $sub_molecule['properties'] ?? []);
                }

                // Displaying atoms
                foreach ($molecule['atoms'] as $atom) {
                    MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties'] ?? []);
                }
            ?>

        <?php if ($molecule['molecules'] || $molecule['atoms']) { ?>
            </div>
        <?php } ?>

        <?php do_action('components_section_container_end', $molecule); ?>

        <?php if ($molecule['custom_action']) { ?>
            <?php do_action('components_' . sanitize_key($molecule['custom_action']) . '_container_end', $molecule); ?>
        <?php } ?>

    <?php if ($molecule['container']) { ?>
        </div>
    <?php } ?>

    <?php
        if ($molecule['scroll']) {
            MakeitWorkPress\WP_Components\Build::atom('scroll', is_array($molecule['scroll']) ? $molecule['scroll'] : []);
        }
    ?>

    <?php do_action('components_section_after', $molecule); ?>

    <?php if ($molecule['custom_action']) { ?>
        <?php do_action('components_' . sanitize_key($molecule['custom_action']) . '_after', $molecule); ?>
    <?php } ?>

</<?php echo $tag; ?>>
