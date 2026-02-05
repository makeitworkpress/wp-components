<?php
/**
 * Search component template
 */
?>

<div <?php echo $attributes; ?>>
    <div class="atom-search-form">
        <?php echo $atom["form"]; ?>
        <i class="fas fa-spin fa-circle-notch"></i>
    </div>

    <?php if ($atom["ajax"]) { ?>
        <div class="atom-search-results">
            <?php if ($atom["all"]) { ?>
                <a class="atom-search-all" href="<?php echo $atom["link"]; ?>" title="<?php echo esc_attr($atom["all"]); ?>">
                    <?php echo $atom["all"]; ?>
                </a>
            <?php } ?>
        </div>
    <?php } ?>

    <?php if ($atom["collapse"]) { ?>
        <a href="#" class="atom-search-expand">
            <i class="fas fa-search"></i>
        </a>
    <?php } ?>
</div>
