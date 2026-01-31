<?php
defined("ABSPATH") || exit();

$molecule_properties = [
    "post_type" => sanitize_text_field($attributes["postType"] ?? "post"),
    "posts_per_page" => absint($attributes["postsPerPage"] ?? 6),
    "columns" => absint($attributes["columns"] ?? 3),
    "layout" => sanitize_text_field($attributes["layout"] ?? "grid"),
    "image" => $attributes["showImage"] ?? true,
    "excerpt" => $attributes["showExcerpt"] ?? true,
    "date" => $attributes["showDate"] ?? true,
    "author" => !empty($attributes["showAuthor"]),
    "orderby" => sanitize_text_field($attributes["orderBy"] ?? "date"),
    "order" => sanitize_text_field($attributes["order"] ?? "DESC"),
    "ajax" => !empty($attributes["ajax"]),
    "attributes" => ["class" => sanitize_text_field($attributes["className"] ?? "")],
];

if (!empty($attributes["categories"])) {
    $molecule_properties["categories"] = array_map("absint", $attributes["categories"]);
}

if (!empty($attributes["align"])) {
    $molecule_properties["attributes"]["class"] .= " align" . sanitize_text_field($attributes["align"]);
}

MakeitWorkPress\WP_Components\Build::molecule("posts", $molecule_properties);
