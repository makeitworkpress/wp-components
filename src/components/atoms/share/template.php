<?php
/**
 * Share component template
 */
?>

<div <?php echo $attributes; ?>>
    <?php if ($atom["share"]) { ?>
        <span class="atom-network atom-share-title">
            <?php echo $atom["share"]; ?>
        </span>
    <?php } ?>

    <?php foreach ($atom["enabled"] as $network) { ?>
        <a class="atom-network components-<?php echo $network; ?><?php if ($atom["hover_item"]) { ?> hvr-<?php echo $atom["hover_item"]; ?><?php } ?>" href="<?php echo $atom["networks"][$network]["url"]; ?>" target="_blank" rel="nofollow">
            <?php if (isset($atom["networks"][$network]["icon"])) { ?>
                <i class="fab fa-<?php echo $atom["networks"][$network]["icon"]; ?> hvr-icon"></i>
            <?php } ?>
            <?php if (isset($atom["networks"][$network]["title"])) { ?>
                <span><?php echo $atom["networks"][$network]["title"]; ?></span>
            <?php } ?>
        </a>
    <?php } ?>
</div>
