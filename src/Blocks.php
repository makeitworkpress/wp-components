<?php
/**
 * Registers Gutenberg blocks for WP-Components atoms and molecules.
 *
 * This class handles the registration of all WPC blocks with the WordPress block editor,
 * including enqueuing editor assets and registering server-side render callbacks.
 */
namespace MakeitWorkPress\WP_Components;

defined("ABSPATH") || exit();

class Blocks
{
    /**
     * List of atom block names to register.
     *
     * @var array
     */
    private array $atoms = [];

    /**
     * List of molecule block names to register.
     * Currently, those are not registered as blocks
     *
     * @var array
     */
    private array $molecules = [];

    /**
     * Initialize the Blocks registration.
     */
    public function __construct()
    {
        $this->atoms = array_map(
            "basename",
            glob(__DIR__ . "/components/atoms/*", GLOB_ONLYDIR),
        );
        $this->molecules = array_map(
            "basename",
            glob(__DIR__ . "/components/molecules/*", GLOB_ONLYDIR),
        );

        $this->register_hooks();
    }

    /**
     * Register WordPress hooks.
     */
    private function register_hooks(): void
    {
        add_action("init", [$this, "register_blocks"]);
    }

    /**
     * Registers a block.
     *
     * @param string $block_name The component (and folder) name (e.g. "button", "content-block")
     * @param string $type The type of component (e.g. "atom", "molecule")
     */
    private function register_block(string $block_name, string $type)
    {
        $class = Build::resolve_class($component, $type);
        if (!class_exists($class) || empty($class::$block)) {
            return;
        }

        $block = $class::$block;
        $script_handle = "wpc-" . $block_name . "-edit";

        wp_register_script(
            $script_handle,
            WP_COMPONENTS_ASSETS . "blocks/wpc-" . $block_name . "-edit.js",
            ["wp-blocks", "wp-element", "wp-block-editor"],
            filemtime($script_path),
            true,
        );

        register_block_type(
            $block["name"],
            array_merge($block, [
                "attributes" => $class::get_block_atts(),
                "editor_script" => $script_handle,
                "render_callback" => function (array $properties) use (
                    $block_name,
                ) {
                    if ($type === "atom") {
                        return Build::atom($block_name, $properties, false);
                    }
                    if ($type === "molecule") {
                        return Build::molecule($block_name, $properties, false);
                    }
                },
            ]),
        );
    }

    /**
     * Register all WPC blocks.
     */
    public function register_blocks(): void
    {
        foreach ($this->atoms as $block_name) {
            $this->register_block($block_name);
        }
        foreach ($this->molecules as $block_name) {
            $this->register_block($block_name);
        }
    }
}
