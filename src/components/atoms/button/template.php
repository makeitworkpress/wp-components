<?php
/**
 * Represents a button
 */

// Buttons should have a label
if (!$atom["label"]) {
    return;
} ?>

<a <?php echo $attributes; ?>>

    <?php if ($atom["icon_before"]) { ?>
        <i class="<?php echo $atom["icon_before"]; ?> hvr-icon"></i>
    <?php } ?>

    <span class="atom-button-label">
        <?php echo $atom["label"]; ?>
    </span>

    <?php if ($atom["icon_after"]) { ?>
        <i class="<?php echo $atom["icon_after"]; ?> hvr-icon"></i>
    <?php } ?>

</a>
