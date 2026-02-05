<?php
/**
 * Load our components using a static wrapper
 * Adds some functionalities for modifying component properties and parsing arguments
 */
namespace MakeitWorkPress\WP_Components;
use WP_Error as WP_Error;

defined("ABSPATH") or die("Go eat veggies!");

class Build
{
    /**
     * Resolves the component class name from a block folder name.
     *
     * @param string $component The folder name (e.g. "button", "content-block")
     * @param string $type The type of component (e.g. "atom", "molecule")
     * @return string The fully qualified class name
     */
    public static function resolve_class(
        string $component,
        string $type,
    ): string {
        $class_name = str_replace("-", "", ucwords($component, "-"));
        return "MakeitWorkPress\\WP_Components\\Components\\" .
            ucfirst($type) .
            "s\\" .
            $class_name;
    }

    /**
     * Renders generic template for an atom or molecule.
     *
     * @param string    $type       The type, either a molecule or atom
     * @param string    $component   The component to load, either a template in the molecule or atom's folder
     * @param array     $properties The custom properties for the template
     * @param array     $render     If the element is rendered. If set to false, the contents of the elements are returned
     *
     * @return string|void          The rendered string for the given atom or molecule, but only if render is true
     */
    private static function render(
        string $type,
        string $component,
        array $properties = [],
        bool $render = true,
    ) {
        // The molecules post-footer and post-header are deprecated. The following code ensures backwards compatibility.
        if ($component === "post-footer" || $component === "post-header") {
            switch ($component) {
                case "post-footer":
                    $custom_action = "post_footer";
                    $tag = "footer";
                    break;
                case "post-header":
                    $custom_action = "post_header";
                    $tag = "header";
                    break;
            }

            $properties["custom_action"] = $custom_action;
            $properties["tag"] = $tag;
            $component = "section";
        }

        $component_class = Build::resolve_class($component, $type);
        $component_instance = new ${$component_class}($type, $properties);
        $component_instance->render($render);
    }

    /**
     * Displays any atom
     *
     * @param string    $atom           The atom to load
     * @param array     $properties     The custom properties for a molecule
     *
     * @return string:|void             The rendered atom
     */
    public static function atom(
        string $atom,
        array $properties = [],
        bool $render = true,
    ) {
        if ($render == false) {
            return self::render("atom", $atom, $properties, $render);
        }

        self::render("atom", $atom, $properties);
    }

    /**
     * Displays any molecule
     *
     * @param string    $molecule       The atom to load
     * @param array     $properties     The custom properties for a molecule
     *
     * @return string:|void             The rendered molecule
     */
    public static function molecule(
        string $molecule,
        array $properties = [],
        bool $render = true,
    ) {
        if ($render == false) {
            return self::render("molecule", $molecule, $properties, $render);
        }

        self::render("molecule", $molecule, $properties);
    }
}
