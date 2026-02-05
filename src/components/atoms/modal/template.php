<?php
/**
 * Modal component template
 */
?>

<div <?php echo $attributes; ?>>
    <div class="atom-modal-container">
        <?php if ($atom["content"]) { ?>
            <div class="atom-modal-content">
                <?php echo $atom["content"]; ?>
            </div>
        <?php } ?>
    </div>
    <a href="#" class="atom-modal-close"><i class="fas fa-times fa-2x"></i></a>
</div>
