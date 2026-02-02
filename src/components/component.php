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
     * Contains the called class
     * @access private
     */
    private $class;

    /**
     * Contains the attributes for a component
     * @access protected
     */
    public static $atts = [];

    /**
     * Contains the public properties, used in the template
     * @access public
     */
    public $props = [];

    /**
     * Contains the template
     * @access protected
     */
    private $template = "";

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
        bool $render = true,
    ) {
        $this->$props = $props;
        $this->parse_arguments();

        $this->class = strtolower(new ReflectionClass($this)->getShortName());
        $this->template = apply_filters(
            "components_" . $type . "_path",
            WP_COMPONENTS_PATH .
                "components/" .
                $type .
                "s/" .
                $this->class .
                "/template.php",
            $this->class,
        );
        $this->props = apply_filters(
            "wfr_components_props_" . $this->class,
            $this->props,
        );
    }

    /**
     * This function initializes our components, sets it paramenters
     */
    abstract protected function parse_arguments();

    /**
     * This function initializes our components, sets it paramenters
     */
    abstract protected function parse_arguments();

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
                    $this->class,
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

        // Cast our object properties into the class variable, so they are accessible by the template file under the class name
        ${$this->class} = $this->props;

        if (!$render) {
            ob_start();
        }

        require $this->template;

        if (!$render) {
            return ob_get_clean();
        }
    }
}
