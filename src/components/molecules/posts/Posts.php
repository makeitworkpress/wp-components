<?php
namespace MakeitWorkPress\WP_Components\Components\Molecules;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a generic post grid or list
 */
class Posts extends Component
{
    public static $block = [
        "name" => "wpc/posts",
        "title" => "Posts",
        "description" => "Displays a post grid or list with customizable atoms.",
        "category" => "wpc-molecules",
        "icon" => "grid-view",
        "keywords" => ["posts", "grid", "list", "blog"],
    ];

    public static $atts = [
        "ajax" => ["type" => "boolean", "default" => true],
        "filter" => ["type" => "array", "default" => []],
        "grid_gap" => ["type" => "string", "default" => "default"],
        "infinite" => ["type" => "boolean", "default" => false],
        "none" => ["type" => "string", "default" => "Bummer! No posts found."],
        "pagination" => [
            "type" => "object",
            "default" => ["type" => "numbers"],
        ],
        "post_properties" => [
            "type" => "object",
            "default" => [
                "attributes" => [
                    "itemprop" => "blogPost",
                    "itemscope" => "itemscope",
                    "itemtype" => "http://schema.org/BlogPosting",
                ],
                "blog_schema" => true,
                "content_atoms" => [
                    "content" => [
                        "atom" => "content",
                        "properties" => ["type" => "excerpt"],
                    ],
                ],
                "footer_atoms" => [
                    "button" => [
                        "atom" => "button",
                        "properties" => [
                            "float" => "right",
                            "label" => "View post",
                            "link" => "post",
                            "size" => "small",
                        ],
                    ],
                ],
                "header_atoms" => [
                    "title" => [
                        "atom" => "title",
                        "properties" => [
                            "attributes" => [
                                "itemprop" => "name headline",
                                "class" => "entry-title",
                            ],
                            "tag" => "h2",
                            "link" => "post",
                        ],
                    ],
                ],
                "image" => [
                    "attributes" => ["class" => "entry-image"],
                    "link" => "post",
                    "size" => "medium",
                    "enlarge" => true,
                ],
                "logo" => "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                "organization" => "",
                "publisher" => "Organization",
            ],
        ],
        "query" => ["type" => "object", "default" => null],
        "query_args" => ["type" => "object", "default" => []],
        "schema" => ["type" => "boolean", "default" => true],
        "view" => ["type" => "string", "default" => "list", "enum" => ["list", "grid"]],
        "wrapper" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $molecule): array
    {
        if (!isset($molecule["attributes"]["data"])) {
            $molecule["attributes"]["data"] = [];
        }
        if (!isset($molecule["attributes"]["data"]["id"])) {
            $molecule["attributes"]["data"]["id"] = "molecule-posts";
        }

        if ($molecule["schema"]) {
            $molecule["attributes"]["itemscope"] = "itemscope";
            $molecule["attributes"]["itemtype"] = "http://schema.org/Blog";
        }

        if ($molecule["ajax"]) {
            $molecule["attributes"]["class"] .= " molecule-posts-ajax";
        }

        if ($molecule["view"]) {
            $molecule["attributes"]["class"] .= " molecule-posts-" . $molecule["view"];
        }

        if ($molecule["infinite"]) {
            $molecule["attributes"]["class"] .= " molecule-posts-infinite";
        }

        return $molecule;
    }
}
