<?php
/**
 * Author component template
 */
$image_rounded = $atom["image_rounded"] ? "components-rounded" : "";
?>

<div <?php echo $attributes; ?>>

    <?php if ($atom["avatar"]) { ?>
        <figure class="atom-author-avatar components-<?php echo $atom["image_float"]; ?>-float <?php echo $image_rounded; ?>">
            <a class="url fn vcard" href="<?php echo $atom["url"]; ?>" rel="author">
                <?php echo $atom["avatar"]; ?>
            </a>
            <?php if ($atom["schema"]) { ?>
                <meta itemprop="name" content="<?php echo esc_attr($atom["name"]); ?>" />
            <?php } ?>
        </figure>
    <?php } ?>

    <?php if ($atom["description"] || $atom["name"] || $atom["job_title"]) { ?>
        <div class="atom-author-description components-<?php echo $atom["image_float"]; ?>-float">

            <?php if ($atom["name"]) { ?>
                <h4 <?php if ($atom["schema"]) { ?>itemprop="name"<?php } ?>><?php echo $atom["prepend"] . $atom["name"]; ?></h4>
            <?php } ?>

            <?php if ($atom["job_title"]) { ?>
                <p <?php if ($atom["schema"]) { ?>itemprop="jobTitle"<?php } ?>><?php echo $atom["job_title"]; ?></p>
            <?php } ?>

            <?php if ($atom["description"]) { ?>
                <p><?php echo $atom["description"]; ?></p>
            <?php } ?>

        </div>
    <?php } ?>

</div>
