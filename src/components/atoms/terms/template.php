<?php
/**
 * Terms component template
 */
if (!$atom["terms"] || is_wp_error($atom["terms"])) {
    return;
}

$term_style = $atom["term_style"] ? " atom-term-style-" . $atom["term_style"] : "";

// Get active term
$query = get_queried_object();
$active = isset($query->term_id) && $query->term_id ? $query->term_id : 0;

$count = count($atom["terms"]);
$i = 0;
?>

<ul <?php echo $attributes; ?>>
    <?php foreach ($atom["terms"] as $term) {
        $term_link = esc_url(get_term_link($term));
        $term_class = $term_style;

        if ($active == $term->term_id) {
            $term_class .= " atom-term-active";
        }

        if ($atom["hover_item"]) {
            $term_class .= " hvr-" . $atom["hover_item"];
        }
    ?>
        <li>
            <?php if ($atom["before"]) {
                echo $atom["before"];
            } ?>

            <a class="atom-term<?php echo $term_class; ?>" href="<?php echo $term_link; ?>" data-id="<?php echo $term->term_id; ?>">
                <?php echo $term->name; ?>
            </a>

            <?php if ($atom["after"]) {
                echo $atom["after"];
            } ?>
        </li>

        <?php
        if ($atom["seperator"]) {
            $i++;
            if ($i != $count) {
                echo '<span class="atom-terms-seperator">' . $atom["seperator"] . '</span>';
            }
        }
        ?>
    <?php } ?>
</ul>
