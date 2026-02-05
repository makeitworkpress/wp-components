<?php
/**
 * Date component template
 */
?>

<time <?php echo $attributes; ?>>
    <?php if ($atom["icon"]) { ?>
        <i class="<?php echo $atom["icon"]; ?> hvr-icon"></i>
    <?php } ?>
    <?php echo $atom["date"]; ?>
</time>
