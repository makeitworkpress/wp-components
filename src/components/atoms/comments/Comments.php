<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a comments section
 */
class Comments extends Component
{
    public static $block = [
        "name" => "wpc/comments",
        "title" => "Comments",
        "description" => "Displays a comments section for posts.",
        "category" => "wpc-atoms",
        "icon" => "admin-comments",
        "keywords" => ["comments", "discussion", "replies"],
    ];

    public static $atts = [
        "closed_text" => ["type" => "string", "default" => "Comments are closed."],
        "form" => ["type" => "boolean", "default" => true],
        "pagination" => ["type" => "boolean", "default" => true],
        "seperate" => ["type" => "boolean", "default" => false],
        "template" => ["type" => "string", "default" => ""],
        "title" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $atom["attributes"]["id"] = "comments";

        // Set default title
        if (empty($atom["title"])) {
            $atom["title"] = sprintf(
                _n(
                    'One Response to %2$s',
                    '%1$s Responses to %2$s',
                    get_comments_number(),
                    'flavor'
                ),
                number_format_i18n(get_comments_number()),
                get_the_title()
            );
        }

        return $atom;
    }
}
