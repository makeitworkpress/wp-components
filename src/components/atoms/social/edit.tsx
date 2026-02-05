/**
 * Social Block Editor
 * Attributes match Social.php $atts
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

interface SocialAttributes extends Partial<BaseAttributes> {
  color_background: boolean;
  hover_item: string;
  icons: object;
  titles: object;
  urls: object;
}

interface EditProps {
  attributes: SocialAttributes;
  setAttributes: (attrs: Partial<SocialAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { color_background, hover_item } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Social Settings", "wp-components")}
          initialOpen={true}
        >
          <ToggleControl
            label={__("Color Background", "wp-components")}
            checked={color_background}
            onChange={(value: boolean) =>
              setAttributes({ color_background: value })
            }
            help={__("Show network-colored backgrounds", "wp-components")}
          />
          <TextControl
            label={__("Hover Effect", "wp-components")}
            value={hover_item}
            onChange={(value: string) => setAttributes({ hover_item: value })}
            placeholder="grow"
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/social" attributes={attributes} />
    </BlockWrapper>
  );
}
