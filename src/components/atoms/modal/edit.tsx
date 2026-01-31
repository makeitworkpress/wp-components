/**
 * WPC Modal Block - Editor Component
 */

import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
} from "@wordpress/components";


interface Attributes {
  content: string;
  modalId: string;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { content, modalId } = attributes;

  const blockProps = useBlockProps({
    className: "atom atom-modal",
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Modal Settings", "wp-components")} initialOpen={true}>
          <TextControl
            label={__("Modal ID", "wp-components")}
            value={modalId}
            onChange={(value) => setAttributes({ modalId: value })}
            help={__("Unique identifier for targeting this modal", "wp-components")}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="atom-modal-container" style={{ border: "2px dashed #ccc", padding: "20px", background: "#f9f9f9" }}>
          <p style={{ color: "#666", marginBottom: "10px" }}>
            <strong>{__("Modal Content", "wp-components")}</strong>
            {modalId && <span> (ID: {modalId})</span>}
          </p>
          <div className="atom-modal-content">
            <RichText
              tagName="div"
              value={content}
              onChange={(value) => setAttributes({ content: value })}
              placeholder={__("Enter modal content...", "wp-components")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Edit;
