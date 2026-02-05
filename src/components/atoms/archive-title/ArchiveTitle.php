<?php
namespace MakeitWorkPress\WP_Components\Components\Atoms;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays an archive title
 */
class ArchiveTitle extends Component
{
    public static $block = [
        "name" => "wpc/archive-title",
        "title" => "Archive Title",
        "description" => "Displays the current archive title.",
        "category" => "wpc-atoms",
        "icon" => "archive",
        "keywords" => ["archive", "title", "heading"],
    ];

    public static $atts = [
        "custom" => ["type" => "string", "default" => ""],
        "types" => ["type" => "object", "default" => []],
    ];

    protected function prepare_attributes(array $atom): array
    {
        return $atom;
    }
}
