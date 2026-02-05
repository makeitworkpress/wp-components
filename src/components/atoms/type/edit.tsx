/**
 * Type Block Editor
 * Attributes match Type.php $atts
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

interface TypeAttributes extends Partial<BaseAttributes> {
  name: string;
  type: string;
}

interface EditProps {
  attributes: TypeAttributes;
  setAttributes: (attrs: Partial<TypeAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { name, type } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Post Type Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Post Type", "wp-components")}
            value={type}
            onChange={(value: string) => setAttributes({ type: value })}
            placeholder="post"
            help={__("Leave empty to use current post type", "wp-components")}
          />
          <TextControl
            label={__("Custom Label", "wp-components")}
            value={name}
            onChange={(value: string) => setAttributes({ name: value })}
            help={__("Leave empty to use post type label", "wp-components")}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/type" attributes={attributes} />
    </BlockWrapper>
  );
}
