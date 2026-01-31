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
     * Path to the components directory.
     *
     * @var string
     */
    private string $components_path;

    /**
     * List of atom block names to register.
     *
     * @var array
     */
    private array $atoms = [
        "author",
        "breadcrumbs",
        "button",
        "cart",
        "comments",
        "image",
        "list",
        "logo",
        "map",
        "menu",
        "modal",
        "pagination",
        "rate",
        "scroll",
        "search",
        "share",
        "slider",
        "social",
        "tabs",
        "terms",
        "title",
        "video",
    ];

    /**
     * List of molecule block names to register.
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
        $this->components_path = WP_COMPONENTS_PATH . "components/";
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
     * Register all WPC blocks.
     */
    public function register_blocks(): void
    {
        // Register atom blocks
        foreach ($this->atoms as $block_name) {
            $block_dir = $this->components_path . "atoms/" . $block_name;

            if (file_exists($block_dir . "/block.json")) {
                register_block_type($block_dir);
            }
        }

        // Register molecule blocks
        foreach ($this->molecules as $block_name) {
            $block_dir = $this->components_path . "molecules/" . $block_name;

            if (file_exists($block_dir . "/block.json")) {
                register_block_type($block_dir);
            }
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
