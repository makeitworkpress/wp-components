<?php
/**
 * Image component template
 */
$args = $atom["schema"] ? ['itemprop' => 'image'] : [];
$image = $atom["image"];

// Load image based on type
if (is_numeric($image)) {
    $image = wp_get_attachment_image($image, $atom["size"], false, $args);
} elseif (is_string($image) && strlen($image) > 3 && strpos($image, '<img') !== false) {
    // Already an img tag
} elseif (is_string($image) && strlen($image) > 2) {
    $id = get_post_meta(get_the_ID(), $image, true);
    $image = wp_get_attachment_image($id, $atom["size"], false, $args);
} elseif (empty($image) && isset($atom["post"]) && $atom["post"]) {
    $image = get_the_post_thumbnail($atom["post"], $atom["size"], $args);
} else {
    global $post;
    $image = get_the_post_thumbnail($post, $atom["size"], $args);
}

if (!$image) {
    return;
}
?>

<figure <?php echo $attributes; ?>>
    <?php if ($atom["link"]) { ?>
        <a href="<?php echo $atom["link"]; ?>" rel="bookmark">
    <?php } ?>

    <?php echo $image; ?>

    <?php if ($atom["link"]) { ?>
        </a>
    <?php } ?>
</figure>
