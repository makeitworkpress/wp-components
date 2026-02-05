<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays the author description and bio
 */
class Author extends Component
{
    public static $block = [
        "name" => "wpc/author",
        "title" => "Author",
        "description" => "Displays author information with avatar and bio.",
        "category" => "wpc-atoms",
        "icon" => "admin-users",
        "keywords" => ["author", "user", "bio", "avatar"],
    ];

    public static $atts = [
        "avatar" => ["type" => "string", "default" => ""],
        "description" => ["type" => "string", "default" => ""],
        "image_float" => [
            "type" => "string",
            "default" => "none",
            "enum" => ["none", "left", "right"],
        ],
        "image_rounded" => ["type" => "boolean", "default" => true],
        "job_title" => ["type" => "string", "default" => ""],
        "name" => ["type" => "string", "default" => ""],
        "prepend" => ["type" => "string", "default" => ""],
        "schema" => ["type" => "boolean", "default" => true],
        "url" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        global $post;

        if (is_numeric($post)) {
            $post = get_post($post);
        }

        // Set defaults from post if not provided
        if (empty($atom["avatar"]) && isset($post->post_author)) {
            $atom["avatar"] = get_avatar($post->post_author, 100);
        }
        if (empty($atom["description"]) && isset($post->post_author)) {
            $atom["description"] = get_the_author_meta("description", $post->post_author);
        }
        if (empty($atom["name"])) {
            $atom["name"] = get_the_author();
        }
        if (empty($atom["url"]) && isset($post->post_author)) {
            $atom["url"] = esc_url(get_author_posts_url($post->post_author));
        }

        // Schema attributes
        if ($atom["schema"]) {
            $atom["attributes"]["itemprop"] = "author";
            $atom["attributes"]["itemscope"] = "itemscope";
            $atom["attributes"]["itemtype"] = "http://schema.org/Person";
        }

        return $atom;
    }
}
