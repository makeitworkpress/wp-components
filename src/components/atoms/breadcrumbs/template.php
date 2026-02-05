<?php
/**
 * Breadcrumbs component template
 */
global $wp_query;

// Default locations
$default_locations = [
    '404' => __('404', 'flavor'),
    'archive' => isset(get_queried_object()->labels->name) ? get_queried_object()->labels->name : '',
    'author' => '',
    'category' => single_cat_title('', false),
    'day' => get_the_date(),
    'home' => isset(get_queried_object()->post_title) ? get_queried_object()->post_title : '',
    'month' => get_the_date('F Y'),
    'page' => get_the_title(),
    'search' => sprintf(__('Search Results: %s', 'flavor'), urldecode(get_query_var('s'))),
    'single' => get_the_title(),
    'tag' => single_tag_title('', false),
    'tax' => single_term_title('', false),
    'year' => get_the_date('Y'),
];

$locations = !empty($atom['locations']) ? $atom['locations'] : $default_locations;
$home_text = $atom['home'] ?: __('Home', 'flavor');

// Get page ID
$page = isset(get_queried_object()->ID) ? get_queried_object()->ID : 0;

// Return at homepage
if (is_front_page() || (is_home() && $page != get_option('page_for_posts'))) {
    return;
}
?>

<nav <?php echo $attributes; ?>>
    <ol itemscope="itemscope" itemtype="http://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
            <a itemprop="item" href="<?php echo esc_url(get_home_url()); ?>">
                <span itemprop="name"><?php echo $home_text; ?></span>
            </a>
            <meta itemprop="position" content="1" />
        </li>

        <?php
        $breadcrumbs = [];
        $position = 2;

        foreach ($locations as $location => $title) {
            $condition = 'is_' . $location;

            if (function_exists($condition) && $condition()) {
                $url = '';

                if ($location == 'page' || $location == 'single') {
                    $url = get_permalink();
                } elseif ($location == 'archive') {
                    $url = get_post_type_archive_link(get_queried_object()->name);
                } elseif ($location == 'category' || $location == 'tag' || $location == 'tax') {
                    $url = get_term_link(get_queried_object());
                } elseif ($location == 'search') {
                    $url = get_search_link(get_query_var('s'));
                } elseif ($location == 'author') {
                    $author = get_userdata(get_query_var('author'));
                    $title = $author->display_name;
                    $url = get_author_posts_url($author->ID);
                }

                $breadcrumbs[] = ['title' => $title, 'url' => $url];
            }
        }

        $breadcrumbs = apply_filters('components_breadcrumbs', $breadcrumbs);

        foreach ($breadcrumbs as $breadcrumb) {
        ?>
            <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
                <span class="atom-breadcrumbs-seperator"><?php echo $atom['seperator']; ?></span>
                <a itemprop="item" href="<?php echo esc_url($breadcrumb['url']); ?>">
                    <span itemprop="name"><?php echo $breadcrumb['title']; ?></span>
                </a>
                <meta itemprop="position" content="<?php echo $position++; ?>" />
            </li>
        <?php } ?>
    </ol>
</nav>
