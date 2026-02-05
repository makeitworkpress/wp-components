<?php
/**
 * Type component template
 */
if (!$atom["type"] || !$atom["name"]) {
    return;
}
?>

<div <?php echo $attributes; ?>>
    <?php echo $atom["name"]; ?>
</div>
