<?php
namespace MakeitWorkPress\WP_Components\Components\Molecules;

use MakeitWorkPress\WP_Components\Components\Component;

defined("ABSPATH") or die("Go eat veggies!");

/**
 * Displays a generic section
 */
class Section extends Component
{
    public static $block = [
        "name" => "wpc/section",
        "title" => "Section",
        "description" => "Displays a section with columns, atoms and molecules.",
        "category" => "wpc-molecules",
        "icon" => "align-wide",
        "keywords" => ["section", "container", "layout"],
    ];

    public static $atts = [
        "atoms" => [
            "type" => "array",
            "default" => [],
            "items" => [
                "type" => "object",
                "properties" => [
                    "atom" => ["type" => "string"],
                    "properties" => ["type" => "object"],
                ],
            ],
        ],
        "columns" => [
            "type" => "array",
            "default" => [],
            "items" => [
                "type" => "object",
                "properties" => [
                    "column" => ["type" => "string"],
                    "atoms" => ["type" => "array"],
                    "molecules" => ["type" => "array"],
                ],
            ],
        ],
        "container" => ["type" => "boolean", "default" => true],
        "custom_action" => ["type" => "string", "default" => ""],
        "grid" => ["type" => "boolean", "default" => false],
        "grid_gap" => ["type" => "string", "default" => "default"],
        "molecules" => [
            "type" => "array",
            "default" => [],
            "items" => [
                "type" => "object",
                "properties" => [
                    "molecule" => ["type" => "string"],
                    "properties" => ["type" => "object"],
                ],
            ],
        ],
        "tag" => [
            "type" => "string",
            "default" => "section",
            "enum" => ["section", "header", "footer", "main", "div"],
        ],
        "scroll" => ["type" => "boolean", "default" => false],
        "video" => ["type" => "string", "default" => ""],
    ];

    protected function prepare_attributes(array $molecule): array
    {
        // Validate tag
        if (!in_array($molecule["tag"], ["div", "footer", "header", "main", "section"])) {
            $molecule["tag"] = "div";
        }

        // Grid wrapper classes when no container
        if (!$molecule["container"] && $molecule["grid"]) {
            $molecule["attributes"]["class"] .= " components-grid-wrapper components-grid-" . $molecule["grid_gap"];
        }

        return $molecule;
    }
}
