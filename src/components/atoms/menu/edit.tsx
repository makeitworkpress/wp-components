/**
 * Menu Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl, ToggleControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface MenuAttributes extends Partial<BaseAttributes> {
  collapse: boolean;
  dropdown: boolean;
  hamburger: string;
  indicator: boolean;
  view: string;
}

interface EditProps {
  attributes: MenuAttributes;
  setAttributes: (attrs: Partial<MenuAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { collapse, dropdown, hamburger, indicator, view } = attributes;

  return (
    <BlockWrapper className="atom-menu">
      <InspectorControls>
        <PanelBody
          title={__("Menu Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("View", "wp-components")}
            value={view}
            options={[
              { label: __("Default", "wp-components"), value: "default" },
              { label: __("Dark", "wp-components"), value: "dark" },
              { label: __("Fixed", "wp-components"), value: "fixed" },
              { label: __("Left", "wp-components"), value: "left" },
              { label: __("Right", "wp-components"), value: "right" },
            ]}
            onChange={(value: string) => setAttributes({ view: value })}
          />
          <SelectControl
            label={__("Hamburger Menu", "wp-components")}
            value={hamburger}
            options={[
              { label: __("Mobile", "wp-components"), value: "mobile" },
              { label: __("Tablet", "wp-components"), value: "tablet" },
              { label: __("Always", "wp-components"), value: "always" },
              { label: __("Never", "wp-components"), value: "" },
            ]}
            onChange={(value: string) => setAttributes({ hamburger: value })}
          />
          <ToggleControl
            label={__("Show Dropdowns", "wp-components")}
            checked={dropdown}
            onChange={(value: boolean) => setAttributes({ dropdown: value })}
          />
          <ToggleControl
            label={__("Show Submenu Indicator", "wp-components")}
            checked={indicator}
            onChange={(value: boolean) => setAttributes({ indicator: value })}
          />
          <ToggleControl
            label={__("Collapse by Default", "wp-components")}
            checked={collapse}
            onChange={(value: boolean) => setAttributes({ collapse: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/menu" attributes={attributes} />
    </BlockWrapper>
  );
}
