/**
 * WPC Button Block - Editor Component
 *
 * Provides the Gutenberg editor interface for the Button atom.
 */

import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import { PanelBody, TextControl, SelectControl } from "@wordpress/components";


/**
 * Editor component for the WPC Button block.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set attributes.
 * @return {JSX.Element} Block editor element.
 */
function Edit({ attributes, setAttributes }) {
  const {
    label,
    url,
    linkTarget,
    iconBefore,
    iconAfter,
    iconVisible,
    size,
    backgroundColor,
    textColor,
  } = attributes;

  const blockProps = useBlockProps({
    className:
      `atom atom-button ${size ? `atom-button-${size}` : ""} ${iconVisible && (iconBefore || iconAfter) ? `atom-button-${iconVisible}` : ""} ${!backgroundColor ? "components-light-background" : ""}`.trim(),
    style: {
      backgroundColor: backgroundColor || undefined,
      color: textColor || undefined,
    },
  });

  return (
    <>
      <InspectorControls>
        <PanelBody
          title={__("Button Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("URL", "wp-components")}
            value={url}
            onChange={(value) => setAttributes({ url: value })}
            placeholder={__("https://example.com", "wp-components")}
          />
          <SelectControl
            label={__("Link Target", "wp-components")}
            value={linkTarget}
            options={[
              { label: __("Same Window", "wp-components"), value: "_self" },
              { label: __("New Tab", "wp-components"), value: "_blank" },
            ]}
            onChange={(value) => setAttributes({ linkTarget: value })}
          />
          <SelectControl
            label={__("Size", "wp-components")}
            value={size}
            options={[
              { label: __("Default", "wp-components"), value: "" },
              { label: __("Small", "wp-components"), value: "small" },
              { label: __("Large", "wp-components"), value: "large" },
              { label: __("None (Text Only)", "wp-components"), value: "none" },
            ]}
            onChange={(value) => setAttributes({ size: value })}
          />
        </PanelBody>

        <PanelBody
          title={__("Icon Settings", "wp-components")}
          initialOpen={false}
        >
          <TextControl
            label={__("Icon Before", "wp-components")}
            value={iconBefore}
            onChange={(value) => setAttributes({ iconBefore: value })}
            placeholder={__("fas fa-arrow-right", "wp-components")}
            help={__(
              "Font Awesome class name (e.g., fas fa-arrow-right)",
              "wp-components",
            )}
          />
          <TextControl
            label={__("Icon After", "wp-components")}
            value={iconAfter}
            onChange={(value) => setAttributes({ iconAfter: value })}
            placeholder={__("fas fa-chevron-right", "wp-components")}
            help={__(
              "Font Awesome class name (e.g., fas fa-chevron-right)",
              "wp-components",
            )}
          />
          {(iconBefore || iconAfter) && (
            <SelectControl
              label={__("Icon Visibility", "wp-components")}
              value={iconVisible}
              options={[
                {
                  label: __("Always Visible", "wp-components"),
                  value: "standard",
                },
                { label: __("Show on Hover", "wp-components"), value: "hover" },
              ]}
              onChange={(value) => setAttributes({ iconVisible: value })}
            />
          )}
        </PanelBody>

        <PanelBody title={__("Colors", "wp-components")} initialOpen={false}>
          <TextControl
            label={__("Background Color", "wp-components")}
            value={backgroundColor}
            onChange={(value) => setAttributes({ backgroundColor: value })}
            placeholder={__("#000000 or rgb(0,0,0)", "wp-components")}
            help={__(
              "Leave empty for default light background",
              "wp-components",
            )}
          />
          <TextControl
            label={__("Text Color", "wp-components")}
            value={textColor}
            onChange={(value) => setAttributes({ textColor: value })}
            placeholder={__("#ffffff or rgb(255,255,255)", "wp-components")}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {iconBefore && (
          <i className={`${iconBefore} hvr-icon`} aria-hidden="true"></i>
        )}
        <RichText
          tagName="span"
          className="atom-button-label"
          value={label}
          onChange={(value) => setAttributes({ label: value })}
          placeholder={__("Button Text...", "wp-components")}
          allowedFormats={[]}
        />
        {iconAfter && (
          <i className={`${iconAfter} hvr-icon`} aria-hidden="true"></i>
        )}
      </div>
    </>
  );
}

/**
 * Register the WPC Button block.
 */
registerBlockType(metadata.name, {
  edit: Edit,
});
