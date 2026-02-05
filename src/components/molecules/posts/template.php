<?php
defined("ABSPATH") or die("Go eat veggies!");

// Query vars for pagination
if (get_query_var('paged') && !isset($molecule['query_args']['paged'])) {
    $molecule['query_args']['paged'] = get_query_var('paged');
}

// Get our posts
if (!$molecule['query']) {
    $molecule['query'] = new WP_Query($molecule['query_args']);
}

// Set the query for pagination
if ($molecule['pagination'] && !isset($molecule['pagination']['query'])) {
    $molecule['pagination']['query'] = $molecule['query'];
}

// Output arguments for filter
if ($molecule['filter']) {
    add_action('wp_footer', function() use ($molecule) {
        echo '<script type="text/javascript"> var posts' . esc_js($molecule['attributes']['data']['id']) . '=' . json_encode($molecule) . ';</script>';
    });
}

// Wrapper classes
$wrapper_class = $molecule['wrapper'];
if (isset($molecule['post_properties']['grid']) && $molecule['post_properties']['grid']) {
    $wrapper_class .= ' components-grid-wrapper components-grid-' . $molecule['grid_gap'];
}

// Infinite scroll pagination adjustment
if ($molecule['infinite']) {
    $molecule['pagination']['size'] = 99999;
    $molecule['pagination']['type'] = 'numbers';
}

// Post class initial
$post_class = isset($molecule['post_properties']['attributes']['class']) ? $molecule['post_properties']['attributes']['class'] : '';

// Remove schemas if disabled
if (!$molecule['schema']) {
    unset($molecule['post_properties']['attributes']['itemprop']);
    unset($molecule['post_properties']['attributes']['itemscope']);
    unset($molecule['post_properties']['attributes']['itemtype']);

    if (isset($molecule['post_properties']['content_atoms']['content'])) {
        $molecule['post_properties']['content_atoms']['content']['properties']['schema'] = false;
    }
    if (isset($molecule['post_properties']['header_atoms']['title'])) {
        $molecule['post_properties']['header_atoms']['title']['properties']['schema'] = false;
    }
    if (isset($molecule['post_properties']['image']) && $molecule['post_properties']['image']) {
        $molecule['post_properties']['image']['schema'] = false;
    }
}

$key = 0;
?>

<div <?php echo $attributes; ?>>

    <?php do_action('components_posts_before', $molecule); ?>

    <?php
        if ($molecule['filter']) {
            MakeitWorkPress\WP_Components\Build::atom('terms', $molecule['filter']);
        }
    ?>

    <div class="molecule-posts-wrapper <?php echo esc_attr($wrapper_class); ?>">

        <?php if ($molecule['query']->posts) { ?>

            <?php foreach ($molecule['query']->posts as $post) { ?>

                <?php
                    $postID = isset($post->ID) && is_numeric($post->ID) ? $post->ID : $post;
                    $molecule['post_properties']['attributes']['class'] = $post_class;
                    $molecule['query']->the_post();
                    $molecule['post_properties']['attributes']['class'] .= implode(' ', get_post_class(' molecule-post', $postID));

                    if (isset($molecule['post_properties']['grid']) && is_array($molecule['post_properties']['grid'])) {
                        $molecule['post_properties']['attributes']['class'] .= ' components-' . $molecule['post_properties']['grid'][$key] . '-grid';
                    }

                    $key++;
                    $post_attributes = MakeitWorkPress\WP_Components\Props::attributes($molecule['post_properties']['attributes']);
                ?>

                <article <?php echo $post_attributes; ?>>

                    <?php if ($molecule['schema'] && $molecule['post_properties']['blog_schema']) { ?>
                        <span class="components-structured-data" itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Person">
                            <meta itemprop="name" content="<?php the_author(); ?>">
                        </span>
                        <span class="components-structured-data" itemprop="publisher" itemscope="itemscope" itemtype="http://schema.org/Organization">
                            <span itemprop="logo" itemscope="itemscope" itemtype="http://schema.org/ImageObject">
                                <?php if (strpos($molecule['post_properties']['logo'], '.svg')) { ?>
                                    <meta itemprop="contentUrl" content="<?php echo esc_attr($molecule['post_properties']['logo']); ?>" />
                                    <meta itemprop="url" content="<?php bloginfo('url'); ?>" />
                                <?php } else { ?>
                                    <meta itemprop="url" content="<?php echo esc_attr($molecule['post_properties']['logo']); ?>" />
                                <?php } ?>
                            </span>
                            <meta itemprop="name" content="<?php echo esc_attr($molecule['post_properties']['organization'] ?: get_bloginfo('name')); ?>" />
                        </span>
                        <meta itemprop="mainEntityOfPage" content="<?php the_permalink(); ?>" />
                        <meta itemprop="datePublished" content="<?php echo get_the_date('c'); ?>" />
                        <meta itemprop="dateModified" content="<?php echo get_the_modified_date('c'); ?>" />
                    <?php } ?>

                    <?php
                        do_action('components_posts_post_before', $postID, $molecule);

                        if ($molecule['post_properties']['image']) {
                            MakeitWorkPress\WP_Components\Build::atom('image', $molecule['post_properties']['image']);
                        }
                    ?>

                    <?php if ($molecule['post_properties']['header_atoms']) { ?>
                        <header class="entry-header">
                            <?php
                                foreach ($molecule['post_properties']['header_atoms'] as $atom) {
                                    MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties'] ?? []);
                                }
                            ?>
                        </header>
                    <?php } ?>

                    <?php if ($molecule['post_properties']['content_atoms']) { ?>
                        <div class="entry-content">
                            <?php
                                foreach ($molecule['post_properties']['content_atoms'] as $atom) {
                                    MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties'] ?? []);
                                }
                            ?>
                        </div>
                    <?php } ?>

                    <?php if ($molecule['post_properties']['footer_atoms']) { ?>
                        <footer class="entry-footer">
                            <?php
                                foreach ($molecule['post_properties']['footer_atoms'] as $atom) {
                                    MakeitWorkPress\WP_Components\Build::atom($atom['atom'], $atom['properties'] ?? []);
                                }
                            ?>
                        </footer>
                    <?php } ?>

                    <?php do_action('components_posts_post_after', $postID, $molecule); ?>

                </article>

            <?php } ?>

            <?php
                // Fill remainder with empty spans for grid styling
                if (isset($molecule['post_properties']['grid']) && !is_array($molecule['post_properties']['grid'])) {
                    $columns = match($molecule['post_properties']['grid']) {
                        'half' => 2,
                        'third' => 3,
                        'fourth' => 4,
                        'fifth' => 5,
                        default => 1,
                    };
                    $remainder = $columns - ($molecule['query']->post_count % $columns);
                    for ($i = 1; $i <= $remainder; $i++) {
                        echo '<span class="components-' . esc_attr($molecule['post_properties']['grid']) . '-grid"></span>';
                    }
                }
            ?>

        <?php } else { ?>
            <p class="atom-posts-none">
                <?php echo esc_html($molecule['none']); ?>
            </p>
        <?php } ?>

    </div>

    <?php
        if ($molecule['pagination']) {
            MakeitWorkPress\WP_Components\Build::atom('pagination', $molecule['pagination']);
        }

        wp_reset_query();
        do_action('components_posts_after', $molecule);
    ?>

</div>
