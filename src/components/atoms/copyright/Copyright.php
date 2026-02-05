<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a copyright notice
 */
class Copyright extends Component
{
    public static $block = [
        "name" => "wpc/copyright",
        "title" => "Copyright",
        "description" => "Displays a copyright notice.",
        "category" => "wpc-atoms",
        "icon" => "shield",
        "keywords" => ["copyright", "footer", "legal"],
    ];

    public static $atts = [
        "copyright" => ["type" => "string", "default" => "©"],
        "date" => ["type" => "string", "default" => ""],
        "itemtype" => ["type" => "string", "default" => "http://schema.org/Organization"],
        "name" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $atom): array
    {
        if (empty($atom["date"])) {
            $atom["date"] = date("Y");
        }

        return $atom;
    }
}
