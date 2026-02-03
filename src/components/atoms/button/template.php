<?php
/**
 * Represents a button
 */

// Backward compatibility
$atom = MakeitWorkPress\WP_Components\Build::convert_camels($atom, [
    "iconAfter" => "icon_after",
    "iconBefore" => "icon_before",
    "iconVisible" => "icon_visible",
]);

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args($atom, [
    "attributes" => [
        "href" => "post",
        "target" => "_self",
    ],
    "icon_after" => "", // Icon before the button
    "icon_before" => "", // Icon after the button
    "icon_visible" => "standard", // When the icon becomes visible. Accepts standard or hover
    "label" => "", // The button label
    "size" => "", // Defines the size of the button. If set to none, displays a button without background, border and padding.
]);

// Buttons should have a label
if (!$atom["label"]) {
    return;
}
?>

<a <?php echo $attributes; ?>>

    <?php if ($atom["icon_before"]) { ?>
        <i class="<?php echo $atom["icon_before"]; ?> hvr-icon"></i>
    <?php } ?>

    <span class="atom-button-label">
        <?php echo $atom["label"]; ?>
    </span>

    <?php if ($atom["icon_after"]) { ?>
        <i class="<?php echo $atom["icon_after"]; ?> hvr-icon"></i>
    <?php } ?>

</a>
