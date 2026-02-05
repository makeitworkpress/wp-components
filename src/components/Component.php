<?php
/**
 * Contains the class abstraction for our components
 */
namespace MakeitWorkPress\WP_Components\Components;
use WP_Error as WP_Error;

defined("ABSPATH") or die("Go eat veggies!");

abstract class Component
{
    /**
     * Contains the called class name
     * @access private
     */
    private $component;

    /**
     * Contains the component-specific attributes, defined in child classes.
     * Matches the WordPress register_block_type attributes format.
     * @access public
     */
    public static $atts = [];

    /**
     * Contains the base attributes shared by every component.
     * Matches the WordPress register_block_type attributes format.
     * @access protected
     */
    protected static $base_atts = [
        'align'      => ['type' => 'string',  'default' => ''],
        'animation'  => ['type' => 'string',  'default' => ''],
        'appear'     => ['type' => 'string',  'default' => ''],
        'background' => ['type' => 'string',  'default' => ''],
        'border'     => ['type' => 'string',  'default' => ''],
        'boxshadow'  => ['type' => 'string',  'default' => ''],
        'color'      => ['type' => 'string',  'default' => ''],
        'display'    => ['type' => 'string',  'default' => ''],
        'float'      => ['type' => 'string',  'default' => ''],
        'grid'       => ['type' => 'string',  'default' => ''],
        'height'     => ['type' => 'string',  'default' => ''],
        'hover'      => ['type' => 'string',  'default' => ''],
        'overlay'    => ['type' => 'string',  'default' => ''],
        'parallax'   => ['type' => 'string',  'default' => ''],
        'position'   => ['type' => 'string',  'default' => ''],
        'rounded'    => ['type' => 'string',  'default' => ''],
        'video'      => ['type' => 'string',  'default' => ''],
        'width'      => ['type' => 'string',  'default' => ''],
        'attributes' => [
            'type' => 'object',
            'default' => ['class' => ''],
            'properties' => [
                'class' => ['type' => 'string']
            ]
        ],

    ];

    /**
     * Contains the general settings for the block,
     * such as name, description, category, icon, keywords.
     * @access public
     */
    public static $block = [];

    /**
     * Contains the custom properties, used in the template
     * @access public
     */
    private $props = [];

    /**
     * Contains the template
     * @access protected
     */
    private $template = "";

    /**
     * Contains the type of component
     * @access private
     */
    private $type;

    /**
     * Set up our parameters and component
     *
     * @param array     $params     The parameters for our material grid
     * @param boolean   $format     If we want to query and format by default
     * @param boolean   $render     If we want to render by default
     */
    final public function __construct(
        string $type,
        array $props = [],
    ) {

        if (empty($props)) {
            $props = [];
        }

        $this->component = strtolower(preg_replace('/(?<!^)[A-Z]/', '-$0', (new ReflectionClass($this))->getShortName()));
        $this->template = apply_filters(
            "components_" . $type . "_path",
            WP_COMPONENTS_PATH .
                "components/" .
                $type .
                "s/" .
                $this->component .
                "/template.php",
            $this->component,
        );

        $this->parse_properties();
        $this->props = apply_filters(
            "wfr_components_props_" . $this->component,
            $props,
        );
        $this->type = $type;
    }

    private function validate_properties($type, $properties) {
        if (!in_array($type, ["atom", "molecule"])) {
            new WP_Error(
                "wrong",
                __(
                    "The type for rendering should be a molecule or atom.",
                    "wpc",
                ),
            );
        }

        // Properties should be an array
        if (!is_array($properties)) {
            throw new WP_Error(
                "wrong",
                sprintf(
                    __(
                        "The properties for the molecule or atom called %s are not properly formatted as an array.",
                        "wpc",
                    ),
                    $component,
                ),
            );
        }

        // If we have atom properties, they should have proper properties
        if (isset($properties["atoms"]) && is_array($properties["atoms"])) {
            foreach ($properties["atoms"] as $atom) {
                if (!isset($atom["atom"])) {
                    throw new WP_Error(
                        "wrong",
                        sprintf(
                            __(
                                "The custom atoms within %s are not properly formatted and miss the atom key.",
                                "wpc",
                            ),
                            $component,
                        ),
                    );
                }
            }
        }
    }

    /**
     * Returns the full set of attributes (base + child) for use with register_block_type.
     * Usage: register_block_type('wpc/button', ['attributes' => Button::get_block_atts(), ...]);
     *
     * @return array The merged attributes in WordPress register_block_type format
     */
    public static function get_block_settings(): array
    {

        if(! isset(static::$block) || ! static::$block) {
            return [];
        }
        static::$block['attributes'] = self::get_component_atts();

        return static::$block;
    }

    /**
     * Returns the full set of attributes (base + child) for use with register_block_type.
     * Usage: register_block_type('wpc/button', ['attributes' => Button::get_block_atts(), ...]);
     *
     * @return array The merged attributes in WordPress register_block_type format
     */
    public static function get_component_atts(): array
    {
        return \MakeitWorkPress\WP_Components\Props::multi_parse_args(static::$atts, self::$base_atts);
    }

    /**
     * Parses input props and attributes against the full attribute definitions (base + child).
     * Extracts default values, deep merges input props on top, and applies backwards compatibility conversions.
     */
    private function parse_properties()
    {
        $this->props = \MakeitWorkPress\WP_Components\Props::convert_camels($this->props);
        $this->props = \MakeitWorkPress\WP_Components\Props::sanitize_properties($this->props, static::get_component_atts());
        $this->props = \MakeitWorkPress\WP_Components\Props::set_default_properties($this->component, $this->props, $this->type);
        $defaults = [];

        foreach (static::$atts as $key => $attribute) {
            $defaults[$key] = $attribute['default'] ?? '';
        }

        $this->props = \MakeitWorkPress\WP_Components\Build::multi_parse_args($this->props, $defaults);

        // Set the main component html tag attributes
        $this->props = $this->prepare_attributes($this->props);
        $this->props['attributes'] = \MakeitWorkPress\WP_Components\Props::attributes($this->props['attributes']);

    }

    /**
     * This function should prepare the attributes for the main html tag of the component
     * @param array $type_props The properties of the component
     * @return array The attributes of the component
     */
    abstract protected function prepare_attributes(array $type_props): array;

    /**
     * Renders a component
     *
     * @param boolean   $return     If we return the given template instead of rendering it
     */
    public function render($render = true)
    {
        if (!$this->props) {
            throw new WP_Error(
                "wrong",
                sprintf(
                    __("No properties are defined for the component %s"., "wpc"),
                    $this->component,
                ),
            );
        }

        if (!file_exists($this->template)) {
            throw new WP_Error(
                "wrong",
                sprintf(
                    __(
                        "The given template for the molecule or atom called %s does not exist.",
                        "wpc",
                    ),
                    $this->class,
                ),
            );
        }

        // Cast our object properties into the type variable, so they are accessible by the template file under the type name
        ${$this->type} = $this->props;
        $attributes = $this->props['attributes'];

        if (!$render) {
            ob_start();
        }

        require $this->template;

        if (!$render) {
            return ob_get_clean();
        }
    }
}
