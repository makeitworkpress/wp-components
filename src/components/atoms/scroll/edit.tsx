/**
 * Scroll Block Editor
 * Attributes match Scroll.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, ToggleControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface ScrollAttributes extends Partial<BaseAttributes> {
  icon: string;
  top: boolean;
}

interface EditProps {
  attributes: ScrollAttributes;
  setAttributes: (attrs: Partial<ScrollAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { icon, top } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Scroll Settings", "wp-components")}
          initialOpen={true}
        >
          <ToggleControl
            label={__("Scroll to Top", "wp-components")}
            checked={top}
            onChange={(value: boolean) => setAttributes({ top: value })}
            help={__(
              "Enable to scroll to top, disable for scroll down",
              "wp-components",
            )}
          />
          <TextControl
            label={__("Icon Class", "wp-components")}
            value={icon}
            onChange={(value: string) => setAttributes({ icon: value })}
            placeholder={top ? "fas fa-angle-up" : "fas fa-chevron-down"}
            help={__("Font Awesome icon class", "wp-components")}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/scroll" attributes={attributes} />
    </BlockWrapper>
  );
}
