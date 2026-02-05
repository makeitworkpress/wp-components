/**
 * Termlist Block Editor
 * Attributes match Termlist.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface TermlistAttributes extends Partial<BaseAttributes> {
  id: number;
  schema: boolean;
  taxonomies: object;
}

interface EditProps {
  attributes: TermlistAttributes;
  setAttributes: (attrs: Partial<TermlistAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { schema } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Term List Settings", "wp-components")}
          initialOpen={true}
        >
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
            help={__(
              "Add Schema.org microdata for categories and tags",
              "wp-components",
            )}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/termlist" attributes={attributes} />
    </BlockWrapper>
  );
}
