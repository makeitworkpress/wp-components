<?php
/**
 * Title component template
 */
if (!$atom["title"]) {
    return;
}

$tag = $atom["tag"];
?>

<<?php echo $tag; ?> <?php echo $attributes; ?>>
    <?php if ($atom["link"]) { ?>
        <a href="<?php echo $atom["link"]; ?>" rel="bookmark" <?php if ($atom["schema"]) { ?>itemprop="url"<?php } ?> title="<?php echo esc_attr($atom["title"]); ?>">
    <?php } ?>
        <?php echo $atom["title"]; ?>
    <?php if ($atom["link"]) { ?>
        </a>
    <?php } ?>
</<?php echo $tag; ?>>
