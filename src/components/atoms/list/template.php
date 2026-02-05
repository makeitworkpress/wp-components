<?php
/**
 * List component template
 */
if (!$atom["items"]) {
    return;
}

$title_tag = $atom["title_tag"];
?>

<ul <?php echo $attributes; ?>>
    <?php foreach ($atom["items"] as $item) { ?>
        <li class="components-list-item<?php if (isset($item["column"]) && $item["column"]) { ?> components-<?php echo $item["column"]; ?>-grid<?php } ?><?php if ($atom["hover_item"]) { ?> hvr-<?php echo $atom["hover_item"]; ?><?php } ?>">

            <?php if (isset($item["icon"]) && $item["icon"]) { ?>
                <i class="<?php echo $item["icon"]; ?> hvr-icon"></i>
            <?php } ?>

            <div class="components-list-item-content">
                <<?php echo $title_tag; ?> class="components-list-item-title">
                    <?php if (isset($item["link"]) && $item["link"]) { ?>
                        <a href="<?php echo $item["link"]; ?>">
                    <?php } ?>

                    <?php echo $item["title"]; ?>

                    <?php if (isset($item["link"]) && $item["link"]) { ?>
                        </a>
                    <?php } ?>
                </<?php echo $title_tag; ?>>

                <?php if (isset($item["description"]) && $item["description"]) { ?>
                    <p><?php echo $item["description"]; ?></p>
                <?php } ?>
            </div>
        </li>
    <?php } ?>
</ul>
