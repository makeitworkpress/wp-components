const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface ButtonAttributes {
  label: string;
  url: string;
  linkTarget: string;
  iconBefore: string;
  iconAfter: string;
  iconVisible: string;
  size: string;
  backgroundColor: string;
  textColor: string;
  className: string;
}

interface EditProps {
  attributes: ButtonAttributes;
  setAttributes: (attrs: Partial<ButtonAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
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

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody
          title={__("Button Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Label", "wp-components")}
            value={label}
            onChange={(value: string) => setAttributes({ label: value })}
            placeholder={__("Button Text", "wp-components")}
          />
          <TextControl
            label={__("URL", "wp-components")}
            value={url}
            onChange={(value: string) => setAttributes({ url: value })}
            placeholder={__("https://example.com", "wp-components")}
          />
          <SelectControl
            label={__("Link Target", "wp-components")}
            value={linkTarget}
            options={[
              { label: __("Same Window", "wp-components"), value: "_self" },
              { label: __("New Tab", "wp-components"), value: "_blank" },
            ]}
            onChange={(value: string) => setAttributes({ linkTarget: value })}
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
            onChange={(value: string) => setAttributes({ size: value })}
          />
        </PanelBody>

        <PanelBody
          title={__("Icon Settings", "wp-components")}
          initialOpen={false}
        >
          <TextControl
            label={__("Icon Before", "wp-components")}
            value={iconBefore}
            onChange={(value: string) => setAttributes({ iconBefore: value })}
            placeholder={__("fas fa-arrow-right", "wp-components")}
            help={__(
              "Font Awesome class name (e.g., fas fa-arrow-right)",
              "wp-components"
            )}
          />
          <TextControl
            label={__("Icon After", "wp-components")}
            value={iconAfter}
            onChange={(value: string) => setAttributes({ iconAfter: value })}
            placeholder={__("fas fa-chevron-right", "wp-components")}
            help={__(
              "Font Awesome class name (e.g., fas fa-chevron-right)",
              "wp-components"
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
              onChange={(value: string) => setAttributes({ iconVisible: value })}
            />
          )}
        </PanelBody>

        <PanelBody title={__("Colors", "wp-components")} initialOpen={false}>
          <TextControl
            label={__("Background Color", "wp-components")}
            value={backgroundColor}
            onChange={(value: string) => setAttributes({ backgroundColor: value })}
            placeholder={__("#000000 or rgb(0,0,0)", "wp-components")}
            help={__(
              "Leave empty for default light background",
              "wp-components"
            )}
          />
          <TextControl
            label={__("Text Color", "wp-components")}
            value={textColor}
            onChange={(value: string) => setAttributes({ textColor: value })}
            placeholder={__("#ffffff or rgb(255,255,255)", "wp-components")}
          />
        </PanelBody>
      </InspectorControls>

      <ServerSideRender
        block="wpc/button"
        attributes={attributes}
      />
    </div>
  );
}
