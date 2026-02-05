/**
 * Button Block Editor
 * Attributes match Button.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface ButtonAttributes extends Partial<BaseAttributes> {
  attributes: {
    href: string;
    target: string;
    class: string;
  };
  icon_visible: string;
  icon_after: string;
  icon_before: string;
  label: string;
  size: string;
}

interface EditProps {
  attributes: ButtonAttributes;
  setAttributes: (attrs: Partial<ButtonAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const {
    attributes: htmlAttributes = { href: "post", target: "_self", class: "" },
    icon_visible,
    icon_after,
    icon_before,
    label,
    size,
  } = attributes;

  const updateHtmlAttribute = (key: string, value: string) => {
    setAttributes({
      attributes: {
        ...htmlAttributes,
        [key]: value,
      },
    });
  };

  return (
    <BlockWrapper>
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
            value={htmlAttributes.href}
            onChange={(value: string) => updateHtmlAttribute("href", value)}
            placeholder={__("post, https://example.com", "wp-components")}
            help={__("Use 'post' for current post permalink", "wp-components")}
          />
          <SelectControl
            label={__("Link Target", "wp-components")}
            value={htmlAttributes.target}
            options={[
              { label: __("Same Window", "wp-components"), value: "_self" },
              { label: __("New Tab", "wp-components"), value: "_blank" },
            ]}
            onChange={(value: string) => updateHtmlAttribute("target", value)}
          />
          <SelectControl
            label={__("Size", "wp-components")}
            value={size}
            options={[
              { label: __("Default", "wp-components"), value: "" },
              { label: __("None (Text Only)", "wp-components"), value: "none" },
              { label: __("Small", "wp-components"), value: "small" },
              { label: __("Medium", "wp-components"), value: "medium" },
              { label: __("Large", "wp-components"), value: "large" },
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
            value={icon_before}
            onChange={(value: string) => setAttributes({ icon_before: value })}
            placeholder={__("fas fa-arrow-right", "wp-components")}
            help={__(
              "Font Awesome class name (e.g., fas fa-arrow-right)",
              "wp-components",
            )}
          />
          <TextControl
            label={__("Icon After", "wp-components")}
            value={icon_after}
            onChange={(value: string) => setAttributes({ icon_after: value })}
            placeholder={__("fas fa-chevron-right", "wp-components")}
            help={__(
              "Font Awesome class name (e.g., fas fa-chevron-right)",
              "wp-components",
            )}
          />
          {(icon_before || icon_after) && (
            <SelectControl
              label={__("Icon Visibility", "wp-components")}
              value={icon_visible}
              options={[
                {
                  label: __("Always Visible", "wp-components"),
                  value: "standard",
                },
                { label: __("Show on Hover", "wp-components"), value: "hover" },
              ]}
              onChange={(value: string) =>
                setAttributes({ icon_visible: value })
              }
            />
          )}
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/button" attributes={attributes} />
    </BlockWrapper>
  );
}
