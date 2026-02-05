<?php
/**
 * Termlist component template
 */

// Retrieve term lists
$hasTerms = false;
foreach ($atom["taxonomies"] as $taxonomy => $properties) {
    $termlist = get_the_term_list(
        $atom["id"],
        $taxonomy,
        $properties["before"] ?? "",
        $properties["seperator"] ?? ", ",
        $properties["after"] ?? ""
    );
    if ($termlist && !is_wp_error($termlist)) {
        $atom["taxonomies"][$taxonomy]["list"] = $termlist;
        $hasTerms = true;
    }
}

if (!$hasTerms) {
    return;
}
?>

<div <?php echo $attributes; ?>>
    <?php foreach ($atom["taxonomies"] as $taxonomy => $properties) { ?>
        <?php if (isset($properties["list"]) && $properties["list"]) { ?>
            <div class="atom-termlist-item entry-<?php echo $taxonomy; ?>" <?php if (isset($properties["schema"]) && $properties["schema"] && $atom["schema"]) {
                echo 'itemprop="' . $properties["schema"] . '"';
            } ?>>
                <?php if (isset($properties["icon"]) && $properties["icon"]) { ?>
                    <i class="<?php echo $properties["icon"]; ?> hvr-icon"></i>
                <?php } ?>
                <?php echo $properties["list"]; ?>
            </div>
        <?php } ?>
    <?php } ?>
</div>
