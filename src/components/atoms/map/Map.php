<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a Google Maps canvas
 */
class Map extends Component
{
    public static $block = [
        "name" => "wpc/map",
        "title" => "Map",
        "description" => "Displays a Google Maps canvas.",
        "category" => "wpc-atoms",
        "icon" => "location",
        "keywords" => ["map", "google", "location", "address"],
    ];

    public static $atts = [
        "center" => ["type" => "object", "default" => ["lat" => "52.090736", "lng" => "5.121420"]],
        "fit" => ["type" => "boolean", "default" => true],
        "id" => ["type" => "string", "default" => "wpcDefaultMap"],
        "markers" => ["type" => "array", "default" => []],
        "styles" => ["type" => "string", "default" => "[]"],
        "zoom" => ["type" => "integer", "default" => 12],
    ];

    protected function prepare_attributes(array $atom): array
    {
        return $atom;
    }
}
