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
    private array $molecules = [
        "footer",
        "header",
        "posts",
        "section",
        "slider",
    ];

    /**
     * Initialize the Blocks registration.
     */
    public function __construct()
    {
        $this->atoms = array_values(
            array_filter(
                scandir(__DIR__ . "/components/atoms"),
                fn($dir) => $dir !== "." &&
                    $dir !== ".." &&
                    is_dir(__DIR__ . "/components/atoms/" . $dir),
            ),
        );

        $this->register_hooks();
    }

    /**
     * Register WordPress hooks.
     */
    private function register_hooks(): void
    {
        add_action("init", [$this, "register_blocks"]);
        add_action("enqueue_block_editor_assets", [
            $this,
            "enqueue_editor_assets",
        ]);
    }

    /**
     * Resolves the component class name from a block folder name.
     *
     * @param string $block_name The folder name (e.g. "button", "content-block")
     * @return string The fully qualified class name
     */
    private function resolve_class(string $block_name): string
    {
        $class_name = str_replace("-", "", ucwords($block_name, "-"));
        return "MakeitWorkPress\\WP_Components\\Components\\Atoms\\" .
            $class_name;
    }

    /**
     * Register all WPC blocks.
     */
    public function register_blocks(): void
    {
        foreach ($this->atoms as $block_name) {
            $class = $this->resolve_class($block_name);

            if (!class_exists($class) || empty($class::$block["name"])) {
                continue;
            }

            $block = $class::$block;
            $script_handle = "wpc-" . $block_name . "-editor";
            $script_path =
                __DIR__ . "/components/atoms/" . $block_name . "/edit.js";

            if (file_exists($script_path)) {
                wp_register_script(
                    $script_handle,
                    WP_COMPONENTS_ASSETS .
                        "components/atoms/" .
                        $block_name .
                        "/edit.js",
                    ["wp-blocks", "wp-element", "wp-block-editor"],
                    filemtime($script_path),
                    true,
                );
            }

            register_block_type(
                $block["name"],
                array_merge($block, [
                    "attributes" => $class::get_block_atts(),
                    "editor_script" => file_exists($script_path)
                        ? $script_handle
                        : null,
                    "render_callback" => function (array $attributes) use (
                        $block_name,
                    ) {
                        return Build::atom($block_name, $attributes, false);
                    },
                ]),
            );
        }
    }

    /**
     * Enqueue assets for the block editor.
     */
    public function enqueue_editor_assets(): void
    {
        wp_enqueue_script(
            "wpc-blocks-js",
            WP_COMPONENTS_ASSETS . "wpc-blocks.min.js",
            [],
            null,
            true,
        );
    }
}
