<?php
defined("ABSPATH") or die("Go eat veggies!");
?>
<footer <?php echo $attributes; ?>>

    <?php do_action('components_footer_before', $molecule); ?>

    <?php if ($molecule['video']) { ?>
        <div class="components-video-background-container">
            <video class="components-video-background" autoplay="autoplay" muted="muted" loop="loop" playsinline="playsinline" src="<?php echo esc_url($molecule['video']); ?>"></video>
        </div>
    <?php } ?>

    <?php if ($molecule['sidebars']) { ?>
        <div class="molecule-footer-sidebars <?php if (!$molecule['container']) { ?> components-grid-wrapper components-grid-<?php echo esc_attr($molecule['grid_gap']); ?> <?php } ?>">

            <?php if ($molecule['container']) { ?>
                <div class="components-container components-grid-wrapper components-grid-<?php echo esc_attr($molecule['grid_gap']); ?>">
            <?php } ?>

            <?php
                foreach ($molecule['sidebars'] as $sidebar => $grid) {
                    if (is_active_sidebar($sidebar)) { ?>
                        <aside class="molecule-footer-sidebar <?php echo esc_attr($grid); ?>">
                            <?php dynamic_sidebar($sidebar); ?>
                        </aside>
                    <?php }
                }
            ?>

            <?php if ($molecule['container']) { ?>
                </div>
            <?php } ?>

        </div>
    <?php } ?>

    <?php if ($molecule['atoms']) { ?>
        <div class="molecule-footer-socket">

            <?php if ($molecule['container']) { ?>
                <div class="components-container">
            <?php } ?>

                <?php
                    foreach ($molecule['atoms'] as $atom) {
                        MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties'] ?? []);
                    }
                ?>

            <?php if ($molecule['container']) { ?>
                </div>
            <?php } ?>

        </div>
    <?php } ?>

    <?php do_action('components_footer_after', $molecule); ?>

</footer>
