<?php
/**
 * Menu component template
 */
$args = $atom["args"];
$args["echo"] = false;

$menu = $atom["menu"];
if (!$menu) {
    $menu = wp_nav_menu($args);
}
?>

<nav <?php echo $attributes; ?>>
    <?php echo $menu; ?>

    <?php if ($atom["hamburger"]) { ?>
        <a class="atom-menu-hamburger" href="#"><span></span><span></span><span></span></a>
    <?php } ?>
</nav>
