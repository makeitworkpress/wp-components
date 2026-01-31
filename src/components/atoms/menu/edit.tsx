const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes {
  menuLocation: string;
  menuId: number;
  hamburger: boolean;
  dropdown: string;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { menuLocation, menuId, hamburger, dropdown } = attributes;

  const blockProps = useBlockProps({
    className: `atom atom-menu ${hamburger ? "atom-menu-hamburger" : ""}`.trim(),
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Menu Settings", "wp-components")} initialOpen={true}>
          <TextControl
            label={__("Menu Location", "wp-components")}
            value={menuLocation}
            onChange={(value) => setAttributes({ menuLocation: value })}
            help={__("Theme menu location slug (e.g., primary)", "wp-components")}
          />
          <TextControl
            label={__("Menu ID", "wp-components")}
            value={menuId ? String(menuId) : ""}
            onChange={(value) => setAttributes({ menuId: parseInt(value) || 0 })}
            type="number"
            help={__("Specific menu ID (overrides location)", "wp-components")}
          />
          <ToggleControl
            label={__("Hamburger Menu", "wp-components")}
            checked={hamburger}
            onChange={(value) => setAttributes({ hamburger: value })}
            help={__("Show hamburger icon for mobile", "wp-components")}
          />
          <SelectControl
            label={__("Dropdown Behavior", "wp-components")}
            value={dropdown}
            options={[
              { label: __("Default", "wp-components"), value: "default" },
              { label: __("Hover", "wp-components"), value: "hover" },
              { label: __("Click", "wp-components"), value: "click" },
            ]}
            onChange={(value) => setAttributes({ dropdown: value })}
          />
        </PanelBody>
      </InspectorControls>

      <nav {...blockProps}>
        <Placeholder
          icon="menu"
          label={__("WPC Menu", "wp-components")}
          instructions={
            menuLocation
              ? `${__("Menu Location:", "wp-components")} ${menuLocation}`
              : menuId
              ? `${__("Menu ID:", "wp-components")} ${menuId}`
              : __("Configure menu location or ID in block settings", "wp-components")
          }
        />
      </nav>
    </>
  );
}

export default Edit;
