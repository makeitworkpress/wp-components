<?php
/**
 * Social component template
 */
?>

<div <?php echo $attributes; ?>>
    <?php foreach ($atom["urls"] as $network => $url) {
        // Modify urls for mail and telephone
        if ($network == "email") {
            $url = "mailto:" . $url;
        }
        if ($network == "telephone") {
            $url = "tel:" . $url;
        }
    ?>
        <a class="atom-network components-<?php echo esc_attr($network); ?><?php if ($atom["hover_item"]) { ?> hvr-<?php echo $atom["hover_item"]; ?><?php } ?>" href="<?php echo esc_url($url); ?>" target="_blank" rel="author external">
            <?php if (isset($atom["icons"][$network])) { ?>
                <i class="<?php echo $atom["icons"][$network]; ?> hvr-icon"></i>
            <?php } ?>

            <?php if (isset($atom["titles"][$network])) { ?>
                <span><?php echo $atom["titles"][$network]; ?></span>
            <?php } ?>
        </a>
    <?php } ?>
</div>
