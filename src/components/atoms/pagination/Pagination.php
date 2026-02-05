<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays pagination
 */
class Pagination extends Component
{
    public static $block = [
        "name" => "wpc/pagination",
        "title" => "Pagination",
        "description" => "Displays pagination links.",
        "category" => "wpc-atoms",
        "icon" => "controls-forward",
        "keywords" => ["pagination", "pages", "navigation"],
    ];

    public static $atts = [
        "format" => ["type" => "string", "default" => "/page/%#%"],
        "next" => ["type" => "string", "default" => "&rsaquo;"],
        "pagination" => ["type" => "string", "default" => ""],
        "prev" => ["type" => "string", "default" => "&lsaquo;"],
        "size" => ["type" => "integer", "default" => 2],
        "type" => [
            "type" => "string",
            "default" => "numbers",
            "enum" => ["numbers", "arrows", "post"],
        ],
    ];

    protected function prepare_attributes(array $atom): array
    {
        $atom["attributes"]["class"] .= " atom-pagination-" . $atom["type"];

        return $atom;
    }
}
