<?php
/**
 * Pagination component template
 */
global $wp_query;

$pagination = $atom["pagination"];

if ($atom["type"] == "numbers" && !$pagination) {
    $query = isset($atom["query"]) ? $atom["query"] : $wp_query;

    $pagination = paginate_links([
        "base" => str_replace(999999999, "%#%", get_pagenum_link(999999999)),
        "current" => isset($query->query_vars["paged"]) && $query->query_vars["paged"] ? $query->query_vars["paged"] : max(1, get_query_var("paged")),
        "format" => $atom["format"],
        "mid_size" => $atom["size"],
        "next_text" => $atom["next"],
        "prev_text" => $atom["prev"],
        "total" => $query->max_num_pages,
    ]);
}

if ($atom["type"] == "arrows" && !$pagination) {
    $pagination = get_previous_posts_link($atom["prev"]);
    $pagination .= get_next_posts_link($atom["next"]);
}

if ($atom["type"] == "post" && !$pagination) {
    $next = $atom["next"] == "&rsaquo;" ? "%title <span>&rsaquo;</span>" : $atom["next"];
    $prev = $atom["prev"] == "&lsaquo;" ? "<span>&lsaquo;</span> %title" : $atom["prev"];

    $pagination = get_previous_post_link("%link", $prev);
    $pagination .= get_next_post_link("%link", $next);
}

if (!$pagination) {
    return;
}
?>

<nav <?php echo $attributes; ?>>
    <?php echo $pagination; ?>
</nav>
