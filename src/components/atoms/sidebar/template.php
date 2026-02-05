<?php
/**
 * Sidebar component template
 */
?>

<aside <?php echo $attributes; ?>>
    <?php
    foreach ($atom["sidebars"] as $sidebar) {
        if (is_active_sidebar($sidebar)) {
            dynamic_sidebar($sidebar);
        }
    }
    ?>
</aside>
