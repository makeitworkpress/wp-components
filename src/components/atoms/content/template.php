<?php
/**
 * Content component template
 */
$content = $atom["content"];
$pages = wp_link_pages(['echo' => false]);

if (!$content) {
    if ($atom["type"] == "excerpt") {
        global $post;

        if (is_numeric($post)) {
            $post = get_post($post);
        }

        if (strpos($post->post_content, '<!--more-->') >= 1) {
            global $more;
            $more = 0;
            $content = wpautop(get_the_content());
        } else {
            $content = wpautop(get_the_excerpt($post));
        }
    } elseif ($atom["type"] == "content") {
        $content = apply_filters('the_content', get_the_content());
    }
}

if (!$content) {
    return;
}
?>

<div <?php echo $attributes; ?>>
    <?php do_action('components_content_before'); ?>

    <?php
    echo $content;

    if ($atom["type"] == "content") {
        echo $pages;
    }
    ?>

    <?php do_action('components_content_after'); ?>
</div>
