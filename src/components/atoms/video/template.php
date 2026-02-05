<?php
/**
 * Video component template
 */
if (!$atom["video"]) {
    return;
}
?>

<div <?php echo $attributes; ?>>
    <div class="<?php echo $atom["placer"]; ?>" <?php if ($atom["schema"]) { ?>itemscope="itemscope" itemtype="http://schema.org/VideoObject"<?php } ?>>
        <?php echo $atom["video"]; ?>

        <?php if ($atom["schema"]) { ?>
            <?php if ($atom["date"]) { ?>
                <meta itemprop="uploadDate" content="<?php echo esc_attr($atom["date"]); ?>" />
            <?php } ?>
            <?php if ($atom["description"]) { ?>
                <meta itemprop="description" content="<?php echo esc_attr($atom["description"]); ?>" />
            <?php } ?>
            <?php if ($atom["name"]) { ?>
                <meta itemprop="name" content="<?php echo esc_attr($atom["name"]); ?>" />
            <?php } ?>
            <?php if ($atom["thumbnail"]) { ?>
                <meta itemprop="thumbnailUrl" content="<?php echo esc_url($atom["thumbnail"]); ?>" />
            <?php } ?>
        <?php } ?>
    </div>
</div>
