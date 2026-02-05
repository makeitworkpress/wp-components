<?php
/**
 * Meta component template
 */
if (!$atom["meta"]) {
    return;
}
?>

<div <?php echo $attributes; ?>>
    <?php
    if ($atom["before"]) {
        echo $atom["before"];
    }

    echo $atom["meta"];

    if ($atom["after"]) {
        echo $atom["after"];
    }
    ?>
</div>
