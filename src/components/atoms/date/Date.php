<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays the date for a post
 */
class Date extends Component
{
    public static $block = [
        "name" => "wpc/date",
        "title" => "Date",
        "description" => "Displays the date for a post.",
        "category" => "wpc-atoms",
        "icon" => "calendar",
        "keywords" => ["date", "time", "published"],
    ];

    public static $atts = [
        "date" => ["type" => "string", "default" => ""],
        "icon" => ["type" => "string", "default" => ""],
        "schema" => ["type" => "boolean", "default" => true],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if (empty($atom["date"])) {
            $atom["date"] = get_the_date();
        }

        $atom["attributes"]["datetime"] = get_the_date("c");

        if ($atom["schema"]) {
            $atom["attributes"]["itemprop"] = "datePublished";
        }

        return $atom;
    }
}
