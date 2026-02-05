/**
 * Share Block Editor
 * Attributes match Share.php $atts
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

interface ShareAttributes extends Partial<BaseAttributes> {
  color_background: boolean;
  enabled: string[];
  fixed: boolean;
  hover_item: string;
  image: string;
  networks: object;
  share: string;
  source: string;
  title: string;
  url: string;
  via: string;
}

interface EditProps {
  attributes: ShareAttributes;
  setAttributes: (attrs: Partial<ShareAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { color_background, fixed, hover_item, share, via } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Share Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Share Label", "wp-components")}
            value={share}
            onChange={(value: string) => setAttributes({ share: value })}
            placeholder={__("Share:", "wp-components")}
          />
          <TextControl
            label={__("Twitter Via", "wp-components")}
            value={via}
            onChange={(value: string) => setAttributes({ via: value })}
            placeholder="username"
            help={__("Twitter username for via attribution", "wp-components")}
          />
          <ToggleControl
            label={__("Fixed Position", "wp-components")}
            checked={fixed}
            onChange={(value: boolean) => setAttributes({ fixed: value })}
            help={__("Fix share buttons to screen edge", "wp-components")}
          />
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

      <ServerSideRender block="wpc/share" attributes={attributes} />
    </BlockWrapper>
  );
}
