<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays social links
 */
class Social extends Component
{
    public static $block = [
        "name" => "wpc/social",
        "title" => "Social",
        "description" => "Displays social media profile links.",
        "category" => "wpc-atoms",
        "icon" => "share-alt2",
        "keywords" => ["social", "links", "profiles", "networks"],
    ];

    public static $atts = [
        "color_background" => ["type" => "boolean", "default" => true],
        "hover_item" => ["type" => "string", "default" => ""],
        "icons" => ["type" => "object", "default" => []],
        "titles" => ["type" => "object", "default" => []],
        "urls" => ["type" => "object", "default" => []],
    ];

    protected function prepare_attributes(array $atom): array
    {
        // Default icons
        if (empty($atom["icons"])) {
            $atom["icons"] = [
                "email" => "far fa-envelope",
                "telephone" => "fas fa-phone",
                "facebook" => "fab fa-facebook",
                "instagram" => "fab fa-instagram",
                "twitter" => "fab fa-twitter",
                "linkedin" => "fab fa-linkedin",
                "youtube" => "fab fa-youtube",
                "pinterest" => "fab fa-pinterest",
                "dribbble" => "fab fa-dribbble",
                "github" => "fab fa-github",
                "behance" => "fab fa-behance",
                "reddit" => "fab fa-reddit-alien",
                "stumbleupon" => "fab fa-stumbleupon",
                "whatsapp" => "fab fa-whatsapp",
            ];
        }

        if ($atom["color_background"]) {
            $atom["attributes"]["class"] .= " components-background";
        }

        return $atom;
    }
}
