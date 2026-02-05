/**
 * Meta Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface MetaAttributes extends Partial<BaseAttributes> {
  after: string;
  before: string;
  key: string;
  meta: string;
}

interface EditProps {
  attributes: MetaAttributes;
  setAttributes: (attrs: Partial<MetaAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { after, before, key, meta } = attributes;

  return (
    <BlockWrapper className="atom-meta">
      <InspectorControls>
        <PanelBody
          title={__("Meta Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Meta Key", "wp-components")}
            value={key}
            onChange={(value: string) => setAttributes({ key: value })}
            help={__("The custom field key to display", "wp-components")}
          />
          <TextControl
            label={__("Custom Value", "wp-components")}
            value={meta}
            onChange={(value: string) => setAttributes({ meta: value })}
            help={__("Override with custom value", "wp-components")}
          />
          <TextControl
            label={__("Before", "wp-components")}
            value={before}
            onChange={(value: string) => setAttributes({ before: value })}
          />
          <TextControl
            label={__("After", "wp-components")}
            value={after}
            onChange={(value: string) => setAttributes({ after: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/meta" attributes={attributes} />
    </BlockWrapper>
  );
}
