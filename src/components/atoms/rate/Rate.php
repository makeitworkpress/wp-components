<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a rating component
 */
class Rate extends Component
{
    public static $block = [
        "name" => "wpc/rate",
        "title" => "Rate",
        "description" => "Displays a star rating component.",
        "category" => "wpc-atoms",
        "icon" => "star-filled",
        "keywords" => ["rate", "rating", "stars", "review"],
    ];

    public static $atts = [
        "author" => ["type" => "string", "default" => ""],
        "author_type" => ["type" => "string", "default" => "http://schema.org/Person"],
        "count" => ["type" => "integer", "default" => 0],
        "id" => ["type" => "integer", "default" => 0],
        "max" => ["type" => "integer", "default" => 5],
        "min" => ["type" => "integer", "default" => 0],
        "rate" => ["type" => "boolean", "default" => true],
        "reviewed" => ["type" => "string", "default" => ""],
        "schema" => ["type" => "boolean", "default" => true],
        "value" => ["type" => "number", "default" => 0],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $id = $atom["id"] ?: get_the_ID();

        if (empty($atom["count"])) {
            $atom["count"] = get_post_meta($id, "components_rating_count", true);
        }
        if (empty($atom["value"])) {
            $atom["value"] = get_post_meta($id, "components_rating", true) ?: 0;
        }

        if ($atom["rate"]) {
            $atom["attributes"]["class"] .= " atom-rate-can";
            $atom["attributes"]["data"]["id"] = $id;
            $atom["attributes"]["data"]["max"] = $atom["max"];
            $atom["attributes"]["data"]["min"] = $atom["min"];
        }

        if ($atom["schema"]) {
            $atom["attributes"]["itemprop"] = "aggregateRating";
            $atom["attributes"]["itemscope"] = "itemscope";
            $atom["attributes"]["itemtype"] = "http://schema.org/AggregateRating";
        }

        return $atom;
    }
}
