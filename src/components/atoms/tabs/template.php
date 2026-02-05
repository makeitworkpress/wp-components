<?php
/**
 * Tabs component template
 */
if (!$atom["tabs"]) {
    return;
}
?>

<div <?php echo $attributes; ?>>
    <ul class="atom-tabs-navigation">
        <?php
        $count = 0;
        foreach ($atom["tabs"] as $key => $tab) {
            $active = $count === 0 ? " active" : " inactive";
            $count++;
        ?>
            <li>
                <a class="atom-tab<?php echo $active; ?><?php if ($atom["hover_item"]) { ?> hvr-<?php echo $atom["hover_item"]; ?><?php } ?>" href="<?php echo isset($tab["link"]) ? $tab["link"] : "#"; ?>" data-target="<?php echo $key; ?>">
                    <?php if (isset($tab["icon"])) { ?>
                        <i class="<?php echo $tab["icon"]; ?> hvr-icon"></i>
                    <?php } ?>

                    <?php if (isset($tab["title"])) {
                        echo $tab["title"];
                    } ?>
                </a>
            </li>
        <?php } ?>
    </ul>

    <div class="atom-tabs-content">
        <?php
        $count = 0;
        foreach ($atom["tabs"] as $key => $tab) {
            $active = $count === 0 ? " active" : "";
            $count++;
        ?>
            <section class="atom-tab<?php echo $active; ?>" data-id="<?php echo $key; ?>">
                <?php if (isset($tab["content"])) {
                    echo $tab["content"];
                } ?>
            </section>
        <?php } ?>
    </div>
</div>
