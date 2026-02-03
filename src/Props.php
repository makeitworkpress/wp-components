<?php
/**
 * Load our components using a static wrapper
 * Adds some functionalities for modifying component properties and parsing arguments
 */
namespace MakeitWorkPress\WP_Components;
use WP_Error as WP_Error;

defined("ABSPATH") or die("Go eat veggies!");

class Props
{
    /**
     * Converts camelCase property keys to snake_case
     * Automatically detects camelCase keys if no explicit conversion map is provided
     *
     * @param Array $properties     The properties for a component, either a molecule or component
     *
     * @return Array $properties    The modified component properties with snake_case keys
     */
    public static function convert_camels($properties)
    {
        foreach (array_keys($properties) as $key) {
            $snake_key = strtolower(preg_replace("/[A-Z]/", '_$0', $key));

            if ($snake_key !== $key) {
                $properties[$snake_key] = $properties[$key];
                unset($properties[$key]);
            }
        }

        return $properties;
    }

    /**
     * Define the default attributes per template. This allows us to dynamically add attributes
     *
     * @param   string  $component  The molecule or atom name
     * @param   array   $properties The custom properties defined by the developer
     * @param   string  $type       Whether we load an atom or an molecule
     *
     * @return  array   $properties The custom properties merged with the defaults
     */
    public static function set_default_properties(
        string $component,
        array $properties,
        string $type = "atom",
    ): array {
        // Define our most basic property - the class
        $properties["attributes"]["class"] = isset(
            $properties["attributes"]["class"],
        )
            ? $type . " " . $properties["attributes"]["class"]
            : $type;
        $properties["attributes"]["class"] .= " " . $type . "-" . $component;

        // These are the common properties that each element can have
        $classes = [
            "align",
            "animation",
            "appear",
            "background",
            "border",
            "boxshadow",
            "color",
            "display",
            "float",
            "grid",
            "height",
            "hover",
            "overlay",
            "parallax",
            "position",
            "rounded",
            "video",
            "width",
        ];

        /**
         * Properties that generate a specific class for a style or are generic
         */
        foreach ($classes as $class) {
            if (isset($properties[$class]) && $properties[$class]) {
                // Advanced animations using animate.css (should be enabled in the configurations during instance boot as well)
                if (
                    $class == "animation" &&
                    !in_array($properties[$class], [
                        "fadein",
                        "fadeindown",
                        "slideinleft",
                        "slideinright",
                    ])
                ) {
                    $properties["attributes"]["class"] .=
                        " animate__animated animate__" . $properties[$class];
                    continue;
                }

                // Backgrounds
                if (
                    $class == "background" &&
                    preg_match(
                        "/hsl|http|https|rgb|linear-gradient|#/",
                        $properties[$class],
                    )
                ) {
                    if (preg_match("/http|https/", $properties[$class])) {
                        $properties["attributes"]["class"] .=
                            " components-image-background";
                        $properties["attributes"]["style"]["background-image"] =
                            "url(" . $properties[$class] . ")";
                    } else {
                        $properties["attributes"]["style"]["background"] =
                            $properties[$class];
                    }

                    continue;
                }

                // Borders
                if (
                    $class == "border" &&
                    preg_match(
                        "/hsl|linear-gradient|rgb|#/",
                        $properties[$class],
                    )
                ) {
                    if (
                        strpos($properties["border"], "linear-gradient") === 0
                    ) {
                        $properties["attributes"]["style"]["border"] =
                            "2px solid transparent;";
                        $properties["attributes"]["style"]["border-image"] =
                            $properties[$class];
                        $properties["attributes"]["style"][
                            "border-image-slice"
                        ] = 1;
                    } else {
                        $properties["attributes"]["style"]["border"] =
                            "2px solid " . $properties[$class];
                    }
                    continue;
                }

                // Box Shadow
                if ($class == "boxshadow" && isset($properties[$class])) {
                    // Custom shadows using CSS attr()
                    if (is_array($properties[$class])) {
                        $properties["attributes"]["class"] .=
                            " components-custom-boxshadow";
                        foreach (
                            ["x", "y", "blur", "spread", "color", "type"]
                            as $value
                        ) {
                            if (isset($properties[$class][$value])) {
                                $properties["attributes"]["data"][$value] =
                                    $properties[$class][$value];
                            }
                        }
                        // Predefined shadows
                    } elseif (is_string($properties[$class])) {
                        $properties["attributes"]["class"] .=
                            " components-" . $properties[$class] . "-boxshadow";
                    }
                    continue;
                }

                // Color
                if (
                    $class == "color" &&
                    preg_match("/hsl|rgb|#/", $properties[$class])
                ) {
                    $properties["attributes"]["style"]["color"] =
                        $properties[$class];
                    continue;
                }

                // Continue if our grid is an array
                if ($class == "grid" && is_array($properties[$class])) {
                    continue;
                }

                // Height and Width
                if (
                    ($class == "height" || $class == "width") &&
                    preg_match(
                        "/ch|em|ex|in|mm|pc|pt|px|rem|vh|vw|%/",
                        $properties[$class],
                    )
                ) {
                    $properties["attributes"]["style"]["min-" . $class] =
                        $properties[$class];
                    continue;
                }

                // Advanced hover settings using hover.css (should be enabled in the configurations during instance boot as well)
                if ($class == "hover") {
                    $properties["attributes"]["class"] .=
                        " hvr-" . $properties[$class];
                    continue;
                }

                // Overlay
                if ($class == "overlay" && isset($properties[$class])) {
                    // Custom overlays using CSS attr()
                    if (is_array($properties[$class])) {
                        $properties["attributes"]["class"] .=
                            " components-overlay components-custom-overlay";
                        foreach (["color", "opacity"] as $value) {
                            if (isset($properties[$class][$value])) {
                                $properties["attributes"]["data"][$value] =
                                    $properties[$class][$value];
                            }
                        }
                        // Predefined overlays
                    } elseif (is_string($properties[$class])) {
                        $properties["attributes"]["class"] .=
                            " components-overlay components-" .
                            $properties[$class] .
                            "-overlay";
                    }
                    continue;
                }

                if ($class == "video") {
                    $properties["attributes"]["class"] .=
                        " components-video-background";
                    continue;
                }

                // Set our definite class for other properties
                $properties["attributes"]["class"] .= is_bool(
                    $properties[$class],
                )
                    ? " components-" . $class
                    : " components-" . $properties[$class] . "-" . $class;
            }
        }

        return $properties;
    }

    /**
     * Turns our attributes into a usuable string for use in our atoms
     *
     * @param   array   $attributes The array with custom properties
     *
     * @return  string  $output     The attributes as a string
     */
    public static function attributes(array $attributes = []): string
    {
        $output = "";

        foreach ($attributes as $key => $attribute) {
            // Skip empty attributes
            if (!$attribute) {
                continue;
            }

            if ($key == "data" && is_array($attribute)) {
                foreach ($attribute as $data => $value) {
                    $output .=
                        " data-" .
                        sanitize_key($data) .
                        '="' .
                        esc_attr(wp_json_encode($value)) .
                        '"';
                }
            } elseif ($key == "style" && is_array($attribute)) {
                $style = "";
                foreach ($attribute as $selector => $value) {
                    if (!$value) {
                        continue;
                    }
                    $style .=
                        sanitize_key($selector) .
                        ":" .
                        sanitize_text_field($value) .
                        ";";
                }

                // Only if we style properties we add our inline styling
                if ($style) {
                    $output .= ' style="' . esc_attr($style) . '"';
                }
            } else {
                $output .=
                    " " .
                    sanitize_key($key) .
                    '="' .
                    esc_attr(sanitize_text_field($attribute)) .
                    '"';
            }
        }

        return $output;
    }

    /**
     * This function exists for backwards compatibility for multiParseArgs, may they be used externally
     *
     * @param array $args       The arguments to parse
     * @param array $default    The default arguments
     *
     * @return array $array     The merged array
     */
    public static function multiParseArgs(array $args, array $default): array
    {
        return self::multi_parse_args($args, $default);
    }

    /**
     * Allows us to parse arguments in a multidimensional array
     *
     * @param array $args       The arguments to parse
     * @param array $default    The default arguments
     *
     * @return array $array     The merged array
     */
    public static function multi_parse_args(array $args, array $default): array
    {
        if (!is_array($default)) {
            return wp_parse_args($args, $default);
        }

        $array = [];

        // Loop through our multidimensional array
        foreach ([$default, $args] as $elements) {
            foreach ($elements as $key => $element) {
                // If we have numbered keys
                if (is_integer($key)) {
                    $array[] = $element;

                    // Atoms are always overwritten by the arguments
                } elseif (
                    in_array($key, [
                        "atoms",
                        "content_atoms",
                        "footer_atoms",
                        "header_atoms",
                        "image",
                        "socket_atoms",
                        "top_atoms",
                    ])
                ) {
                    $array[$key] = $element;
                } elseif (
                    isset($array[$key]) &&
                    is_array($array[$key]) &&
                    !empty($array[$key]) &&
                    is_array($element)
                ) {
                    $array[$key] = self::multi_parse_args(
                        $element,
                        $array[$key],
                    );
                } else {
                    $array[$key] = $element;
                }
            }
        }

        return $array;
    }

    /**
     * Sanitizes properties based on the type defined in block attributes.
     * Applies the appropriate WordPress sanitization function per type.
     *
     * Supported types (matching WordPress register_block_type):
     * - string:  sanitize_text_field (or wp_kses_post if 'rich' is set)
     * - integer: intval
     * - number:  floatval
     * - boolean: cast to bool
     * - array:   recursive sanitization
     * - object:  recursive sanitization of values
     *
     * @param array $properties     The properties to sanitize
     * @param array $atts           The block attribute definitions with type info
     *
     * @return array $properties    The sanitized properties
     */
    public static function sanitize_properties(
        array $properties,
        array $atts,
    ): array {
        foreach ($properties as $key => $value) {
            if (!isset($atts[$key])) {
                continue;
            }

            if (!isset($atts[$key]["type"])) {
                throw new WP_Error(
                    "invalid_attribute_type",
                    "Attribute type is missing",
                );
            }

            $properties[$key] = self::sanitize_value($value, $atts[$key]);
        }

        return $properties;
    }

    /**
     * Sanitizes a single value based on its block attribute type
     *
     * @param mixed  $value     The value to sanitize
     * @param string $type      The block attribute type
     * @param array  $att       The full attribute definition (may contain 'rich', 'properties', 'items')
     *
     * @return mixed            The sanitized value
     */
    private static function sanitize_value($value, array $att = [])
    {
        $type = $att["type"];

        switch ($type) {
            case "string":
                if (!is_string($value)) {
                    return "";
                }
                // Use wp_kses_post for rich text fields that may contain HTML
                if (!empty($att["rich"])) {
                    return wp_kses_post($value);
                }
                return sanitize_text_field($value);

            case "integer":
                return intval($value);

            case "number":
                return floatval($value);

            case "boolean":
                return (bool) $value;

            case "array":
                if (!is_array($value)) {
                    return [];
                }
                // If items type is defined, sanitize each element
                if (isset($att["items"]["type"])) {
                    foreach ($value as $i => $item) {
                        $value[$i] = self::sanitize_value(
                            $item,
                            $att["items"]["type"],
                            $att["items"],
                        );
                    }
                }
                return $value;

            case "object":
                if (!is_array($value)) {
                    return [];
                }
                // If nested properties are defined, sanitize each known property
                if (isset($att["properties"])) {
                    foreach ($value as $k => $v) {
                        if (isset($att["properties"][$k]["type"])) {
                            $value[$k] = self::sanitize_value(
                                $v,
                                $att["properties"][$k]["type"],
                                $att["properties"][$k],
                            );
                        } else {
                            $value[$k] = is_string($v)
                                ? sanitize_text_field($v)
                                : $v;
                        }
                    }
                } else {
                    // No schema defined — sanitize string values, leave others
                    foreach ($value as $k => $v) {
                        if (is_string($v)) {
                            $value[$k] = sanitize_text_field($v);
                        } elseif (is_array($v)) {
                            $value[$k] = self::sanitize_value($v, "object");
                        }
                    }
                }
                return $value;

            default:
                return is_string($value) ? sanitize_text_field($value) : $value;
        }
    }
}
