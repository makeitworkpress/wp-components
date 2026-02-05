/**
 * Modal Block Editor
 * Attributes match Modal.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextareaControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface ModalAttributes extends Partial<BaseAttributes> {
  content: string;
}

interface EditProps {
  attributes: ModalAttributes;
  setAttributes: (attrs: Partial<ModalAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { content } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Modal Settings", "wp-components")}
          initialOpen={true}
        >
          <TextareaControl
            label={__("Content", "wp-components")}
            value={content}
            onChange={(value: string) => setAttributes({ content: value })}
            help={__("HTML content to display in the modal", "wp-components")}
            rows={6}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/modal" attributes={attributes} />
    </BlockWrapper>
  );
}
