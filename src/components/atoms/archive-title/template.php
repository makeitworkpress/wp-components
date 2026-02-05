<?php
/**
 * Archive Title template
 */
global $wp_query;

// Default types
$default_types = [
    'author' => __('Posts Author Archive: %s', 'flavor'),
    'category' => single_cat_title('', false),
    'day' => sprintf(__('Daily Archives: %s', 'flavor'), '<span>' . get_the_date() . '</span>'),
    'default' => isset(get_queried_object()->labels->name) ? get_queried_object()->labels->name : __('Blog Archives', 'flavor'),
    'home' => isset(get_queried_object()->post_title) ? get_queried_object()->post_title : __('Blog Archives', 'flavor'),
    'month' => sprintf(__('Monthly Archives: %s', 'flavor'), '<span>' . get_the_date('F Y') . '</span>'),
    'search' => sprintf(
        _n('%1$s result for: %2$s', '%1$s results for: %2$s', $wp_query->found_posts, 'flavor'),
        '<span>' . number_format_i18n($wp_query->found_posts) . '</span>',
        '<span>' . get_search_query() . '</span>'
    ),
    'tag' => sprintf(__('Posts tagged: %s', 'flavor'), '<span>' . single_tag_title('', false) . '</span>'),
    'tax' => single_term_title('', false),
    'year' => sprintf(__('Yearly Archives: <span>%s</span>', 'flavor'), get_the_date('Y')),
];

$types = !empty($atom['types']) ? $atom['types'] : $default_types;
$archive_title = '';

foreach ($types as $type => $title) {
    $condition = 'is_' . $type;

    if (function_exists($condition) && $condition()) {
        if ($type == 'author') {
            $current = get_query_var('author_name') ? get_user_by('slug', get_query_var('author_name')) : get_userdata(get_query_var('author'));
            $title = sprintf(__('Posts written by: %s', 'flavor'), '<span>' . $current->display_name . '</span>');
        }
        $archive_title = $title;
    }
}

if (!$archive_title) {
    $archive_title = $types['default'] ?? '';
}

if ($atom['custom']) {
    $archive_title = $atom['custom'];
}

if (!$archive_title) {
    return;
}
?>

<h1 <?php echo $attributes; ?>>
    <?php echo $archive_title; ?>
</h1>
