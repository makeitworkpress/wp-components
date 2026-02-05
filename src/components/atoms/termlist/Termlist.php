<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays terms related to a post in a list
 */
class Termlist extends Component
{
    public static $block = [
        "name" => "wpc/termlist",
        "title" => "Term List",
        "description" => "Displays terms related to a post.",
        "category" => "wpc-atoms",
        "icon" => "tag",
        "keywords" => ["terms", "categories", "tags", "taxonomy"],
    ];

    public static $atts = [
        "id" => ["type" => "integer", "default" => 0],
        "schema" => ["type" => "boolean", "default" => true],
        "taxonomies" => ["type" => "object", "default" => []],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if (empty($atom["id"])) {
            global $post;
            $atom["id"] = isset($post) ? $post->ID : get_the_ID();
        }

        // Show default taxonomies if empty
        if (empty($atom["taxonomies"])) {
            $taxonomies = get_post_taxonomies($atom["id"]);

            if (is_array($taxonomies)) {
                foreach ($taxonomies as $taxonomy) {
                    // Skip polylang taxonomies
                    if (in_array($taxonomy, ["language", "post_translations"])) {
                        continue;
                    }

                    $schema = "";
                    if ($taxonomy == "category") {
                        $schema = "genre";
                    } elseif ($taxonomy == "post_tag") {
                        $schema = "keywords";
                    }

                    $icon = $taxonomy == "post_tag" ? "fas fa-tag" : "fas fa-dot-circle";

                    $atom["taxonomies"][$taxonomy] = [
                        "after" => "",
                        "before" => "",
                        "icon" => $icon,
                        "schema" => $schema,
                        "seperator" => ", ",
                    ];
                }
            }
        }

        return $atom;
    }
}
