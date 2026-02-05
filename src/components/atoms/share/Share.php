<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays social sharing buttons
 */
class Share extends Component
{
    public static $block = [
        "name" => "wpc/share",
        "title" => "Share",
        "description" => "Displays social sharing buttons.",
        "category" => "wpc-atoms",
        "icon" => "share",
        "keywords" => ["share", "social", "facebook", "twitter"],
    ];

    public static $atts = [
        "color_background" => ["type" => "boolean", "default" => true],
        "enabled" => ["type" => "array", "default" => ["facebook", "twitter", "linkedin", "pinterest", "reddit", "stumbleupon", "pocket", "whatsapp"]],
        "fixed" => ["type" => "boolean", "default" => false],
        "hover_item" => ["type" => "string", "default" => ""],
        "image" => ["type" => "string", "default" => ""],
        "networks" => ["type" => "object", "default" => []],
        "share" => ["type" => "string", "default" => "Share:"],
        "source" => ["type" => "string", "default" => ""],
        "title" => ["type" => "string", "default" => ""],
        "url" => ["type" => "string", "default" => ""],
        "via" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $postID = get_the_ID();

        // Get image
        if (empty($atom["image"]) && has_post_thumbnail($postID)) {
            $id = get_post_thumbnail_id($postID);
            $atom["image"] = wp_get_attachment_image_url($id, "large");
        }

        // Set defaults
        if (empty($atom["source"])) {
            $atom["source"] = get_bloginfo("name");
        }
        if (empty($atom["title"])) {
            $atom["title"] = rawurlencode(get_the_title($postID));
        }
        if (empty($atom["url"])) {
            $atom["url"] = rawurlencode(get_permalink($postID));
        }

        // Build network URLs
        if (empty($atom["networks"])) {
            $atom["networks"] = [
                "facebook" => ["url" => "http://www.facebook.com/sharer.php?u=" . $atom["url"], "icon" => "facebook"],
                "twitter" => ["url" => "http://twitter.com/share?url=" . $atom["url"] . "&text=" . $atom["title"] . "&via=" . $atom["via"], "icon" => "twitter"],
                "linkedin" => ["url" => "http://www.linkedin.com/shareArticle?mini=true&url=" . $atom["url"] . "&title=" . $atom["title"] . "&source=" . $atom["source"], "icon" => "linkedin"],
                "pinterest" => ["url" => "http://pinterest.com/pin/create/button/?url=" . $atom["url"] . "&description=" . $atom["title"] . "&media=" . $atom["image"], "icon" => "pinterest"],
                "reddit" => ["url" => "http://www.reddit.com/submit?url=" . $atom["url"] . "&title=" . $atom["title"], "icon" => "reddit-alien"],
                "stumbleupon" => ["url" => "http://stumbleupon.com/submit?url=" . $atom["url"] . "&title=" . $atom["title"], "icon" => "stumbleupon"],
                "pocket" => ["url" => "https://getpocket.com/edit.php?url=" . $atom["url"], "icon" => "get-pocket"],
                "whatsapp" => ["url" => "whatsapp://send?text=" . $atom["title"] . " " . $atom["url"], "icon" => "whatsapp"],
            ];
        }

        if ($atom["fixed"]) {
            $atom["attributes"]["class"] .= " atom-share-fixed";
        }

        if ($atom["color_background"]) {
            $atom["attributes"]["class"] .= " components-background";
        }

        return $atom;
    }
}
