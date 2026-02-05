<?php
/**
 * Logo component template
 */
if ($atom["mode"] === "logo" && !is_numeric($atom["default"]) && !isset($atom["default"]["src"])) {
    return;
}
?>

<a <?php echo $attributes; ?>>
    <?php if ($atom["mode"] === "title") { ?>
        <span class="atom-logo-title"><?php echo $atom["title"]; ?></span>
    <?php } else {
        foreach (["mobile", "mobile_transparent", "tablet", "tablet_transparent", "default", "default_transparent"] as $image) {
            $itemprop = "";

            if ($image == "default" && $atom["schema"]) {
                $itemprop = isset($atom["attributes"]["itemtype"]) && $atom["attributes"]["itemtype"] == "http://schema.org/Organization" ? "logo" : "image";
            }

            if (is_numeric($atom[$image])) {
                $args = ["itemprop" => $itemprop, "class" => "atom-logo-" . $image, "alt" => $atom["alt"]];
                if (!$atom["schema"]) {
                    unset($args["itemprop"]);
                }
                echo wp_get_attachment_image($atom[$image], $atom["size"], false, $args);
            } elseif (isset($atom[$image]["src"]) && $atom[$image]["src"] && isset($atom[$image]["width"]) && $atom[$image]["width"] && isset($atom[$image]["height"]) && $atom[$image]["height"]) {
                $itemprop_attr = $atom["schema"] ? 'itemprop="' . $itemprop . '"' : "";
                echo '<img class="atom-logo-' . $image . '" src="' . $atom[$image]["src"] . '" height="' . $atom[$image]["height"] . '" width="' . $atom[$image]["width"] . '" alt="' . $atom["alt"] . '"' . $itemprop_attr . '/>';
            }
        }
    } ?>

    <?php if ($atom["schema"]) { ?>
        <meta itemprop="name" content="<?php echo $atom["title"]; ?>" />
        <meta itemprop="url" content="<?php echo $atom["url"]; ?>" />
    <?php } ?>
</a>
