<?php
/**
 * Description component template
 */
if (!$atom["description"]) {
    return;
}

$tag = $atom["tag"];
?>

<<?php echo $tag; ?> <?php echo $attributes; ?>>
    <?php echo $atom["description"]; ?>
</<?php echo $tag; ?>>
