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
     * Renders generic template for an atom or molecule.
     *
     * @param string    $type       The type, either a molecule or atom
     * @param string    $template   The component to load, either a template in the molecule or atom's folder
     * @param array     $properties The custom properties for the template
     * @param array     $render     If the element is rendered. If set to false, the contents of the elements are returned
     *
     * @return string|void          The rendered string for the given atom or molecule, but only if render is true
     */
    private static function render(
        string $type,
        string $template,
        array $properties = [],
        bool $render = true,
    ) {
        if (!in_array($type, ["atom", "molecule"])) {
            $error = new WP_Error(
                "wrong",
                __(
                    "The type for rendering should be a molecule or atom.",
                    "wpc",
                ),
            );
            echo $error->get_error_message();
            return;
        }

        // Empty properties can be neglected
        if (empty($properties)) {
            $properties = [];
        }

        // Properties should be an array
        if (!is_array($properties)) {
            $error = new WP_Error(
                "wrong",
                sprintf(
                    __(
                        "The properties for the molecule or atom called %s are not properly formatted as an array.",
                        "wpc",
                    ),
                    $template,
                ),
            );
            echo $error->get_error_message();
            return;
        }

        // If we have atom properties, they should have proper properties
        if (isset($properties["atoms"]) && is_array($properties["atoms"])) {
            foreach ($properties["atoms"] as $atom) {
                if (!isset($atom["atom"])) {
                    $error = new WP_Error(
                        "wrong",
                        sprintf(
                            __(
                                "The custom atoms within %s are not properly formatted and miss the atom key.",
                                "wpc",
                            ),
                            $template,
                        ),
                    );
                    echo $error->get_error_message();
                    return;
                }
            }
        }

        // The molecules post-footer and post-header are deprecated. The following code ensures backwards compatibility.
        if ($template === "post-footer" || $template === "post-header") {
            switch ($template) {
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
            $template = "section";
        }

        // Our template path
        $path = apply_filters(
            "components_" . $type . "_path",
            WP_COMPONENTS_PATH .
                "components/" .
                $type .
                "s/" .
                $template .
                "/component.php",
            $template,
        );

        if (file_exists($path)) {
            ${$type} = apply_filters(
                "components_" . $type . "_properties",
                self::set_default_properties($template, $properties, $type),
                $template,
            );

            // If we do not render, we return
            if ($render == false) {
                ob_start();
            }

            require $path;

            if ($render == false) {
                return ob_get_clean();
            }
        } else {
            $error = new WP_Error(
                "wrong",
                sprintf(
                    __(
                        "The given template for the molecule or atom called %s does not exist.",
                        "wpc",
                    ),
                    $template,
                ),
            );
            echo $error->get_error_message();
        }
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
