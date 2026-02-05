<?php
defined("ABSPATH") or die("Go eat veggies!");
?>
<header <?php echo $attributes; ?>>

    <?php do_action('components_header_before', $molecule); ?>

    <?php if ($molecule['video']) { ?>
        <div class="components-video-background-container">
            <video class="components-video-background" autoplay="autoplay" muted="muted" loop="loop" playsinline="playsinline" src="<?php echo esc_url($molecule['video']); ?>"></video>
        </div>
    <?php } ?>

    <?php if ($molecule['top_atoms']) { ?>
        <div class="molecule-header-top-atoms">

            <?php if ($molecule['container']) { ?>
                 <div class="components-container">
            <?php } ?>

                <?php
                    foreach ($molecule['top_atoms'] as $atom) {
                        MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties'] ?? []);
                    }
                ?>

            <?php if ($molecule['container']) { ?>
                </div>
            <?php } ?>

        </div>
    <?php } ?>

    <?php if ($molecule['atoms']) { ?>

        <div class="molecule-header-atoms">

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

    <?php if ($molecule['socket_atoms']) { ?>
        <div class="molecule-header-socket-atoms">

            <?php if ($molecule['container']) { ?>
                 <div class="components-container">
            <?php } ?>

                <?php
                    foreach ($molecule['socket_atoms'] as $atom) {
                        MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties'] ?? []);
                    }
                ?>

            <?php if ($molecule['container']) { ?>
                </div>
            <?php } ?>

        </div>
    <?php } ?>

    <?php do_action('components_header_after', $molecule); ?>

</header>
